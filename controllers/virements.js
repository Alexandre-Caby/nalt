const express = require('express');
const db = require('../api-management/bdd_config.js'); // Import database configuration

/**
 * Find virements by user id
 * @param {number} userId - User's id to search for
 * @returns {Promise<Array>} Array of virements objects
 */
async function getVirementsByUser(userId) {
    try {
        const [rows] = await db.query(`SELECT DISTINCT v.*
                                           FROM virement v
                                                    JOIN compte c1 ON v.idCompteDebit = c1.idCompte
                                                    JOIN compte c2 ON v.idCompteCredit = c2.idCompte
                                           WHERE c1.idUtilisateur = ? OR c2.idUtilisateur = ?`,
                                           [userId, userId]);
        if (rows.length > 0) {
            return rows; // Return the first virement found
        }
        return null; // No virement found
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
}

/**
 * Create a new virement
 * @param {Object} virementData - Virement data to insert
 * @param {number} virementData.idCompteDebit - Virement compteDebit
 * @param {number} virementData.idCompteCredit - Virement compteCredit
 * @param {decimal} virementData.montant - Virement montant
 * @param {date} virementData.dateVirement - Virement date (optionnal)
 * @param {number} virementData.idCategorie - Virement category
 * @returns {Promise<Object>} Created virement object with ID
 */
async function createVirementByUser(virementData) {
    try {
        const { idCompteDebit,
                idCompteCredit,
                montant,
                dateVirement,
                idCategorie
              } = virementData;

        // Validate required fields as specified in the YAML
        if (!idCompteDebit || !idCompteCredit || !montant || !idCategorie) {
            throw new Error('Missing required fields');
        }

        // Insert virement into the database
        const [result] = await db.query(
            'INSERT INTO virement (idCompteDebit, idCompteCredit, montant, dateVirement, idCategorie) VALUES (?, ?, ?, ?, ?)',
            [idCompteDebit, idCompteCredit, montant, dateVirement, idCategorie]
        );

        const dateVirementInsert = dateVirement ? dateVirement : new Date();

        // Return the created virement with mapped field names matching the API
        return {
            id: result.insertId,
            idCompteDebit: idCompteDebit,
            idCompteCredit: idCompteCredit,
            montant: montant,
            dateVirement: dateVirementInsert,
            dateHeureCreation : new Date(),
            dateHeureMAJ: new Date()
        };
    } catch (error) {
        console.error('Database insert error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Virement with this id already exists');
        }
        throw new Error('Virement creation failed: ' + error.message);
    }
}

/**
 * Find virement by id
 * @param {number} idVirement - Virement id to search for
 * @returns {Promise<Object|null>} Virement object or null if not found
 */
async function getVirementById(idVirement) {
    try {
        const [rows] = await db.query(`SELECT * FROM virement WHERE idVirement = ?`, [idVirement]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Failed to get virement');
    }
}

/**
 * Update a virement
 * @param {number} idVirement - Virement ID to update
 * @param {Object} virementData - Virement data to update
 * @param {date} virementData.dateVirement - Virement date (optionnal)
 * @param {number} virementData.idCategorie - Virement category (optionnal)
 * @returns {Promise<Object>} Updated virement object
 */
async function patchVirement(idVirement, virementData) {
    try {
        //On regarde chaque champ, s'il est défini, on le met à jour
        const fieldsToUpdate = [];
        const values = [];
        //Vérification des champs à mettre à jour

        if (virementData.dateVirement) {
            fieldsToUpdate.push('dateVirement = ?');
            values.push(virementData.dateVirement);
        }
        if (virementData.idCategorie) {
            fieldsToUpdate.push('idCategorie = ?');
            values.push(virementData.idCategorie);
        }
        if (fieldsToUpdate.length === 0) {
            throw new Error('Aucun champ à mettre à jour');
        }

        //On ajoute la dateHeureMAJ
        fieldsToUpdate.push('dateHeureMAJ = NOW()');
        //On ajoute l'ID du compte à la fin des valeurs
        values.push(idVirement);

        const [rows] = await db.query(`
            UPDATE virement 
            SET ${fieldsToUpdate.join(', ')} 
            WHERE idVirement = ?
        `, values);
        if (rows.affectedRows === 0) {
            throw new Error('Virement non trouvé');
        }

        return { id: idVirement, ...virementData }; // Retourne le virement mis à jour avec son ID
    } catch (error) {
        console.error('Erreur lors de la mise à jour partielle du virement:', error);
        throw new Error('Erreur lors de la mise à jour partielle du virement');
    }
}

/**
 * Delete a virement
 * @param {number} idVirement - Virement ID to delete
 * @returns {Promise<Object>} Success message
 */
async function deleteVirement(idVirement) {
    try {
        // Check if the virement exists first
        const virement = await getVirementById(idVirement);
        if (!virement) {
            throw new Error('Virement not found');
        }

        // Delete the category
        await db.query('DELETE FROM virement WHERE idVirement = ?', [idVirement]);

        // category name
        return { message: 'Virement deleted successfully', idVirement: virement.idVirement };
    } catch (error) {
        console.error('Database delete error:', error);
        throw new Error('Failed to delete virement: ' + error.message);
    }
}

module.exports = {
    getVirementsByUser,
    createVirementByUser,
    getVirementById,
    patchVirement,
    deleteVirement
};