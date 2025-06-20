const express = require('express');
const db = require('../api-management/bdd_config.js'); // Import database configuration

/**
 * Find tiers by user id
 * @param {number} userId - User's id to search for
 * @returns {Promise<Array>} Array of tiers objects
 */
async function getTiersByUser(userId) {
    try {
        const [rows] = await db.query(`SELECT idTiers, nomTiers, dateHeureCreation, dateHeureMAJ
                                           FROM tiers
                                           WHERE idUtilisateur = ?`,
                                           [userId]);
        if (rows.length > 0) {
            return rows; // Return the first tiers found
        }
        return null; // No tiers found
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
}

/**
 * Create a new tiers
 * @param {Object} tiersData - Tiers data to insert
 * @param {string} tiersData.nomTiers - Tiers name
 * @param {number} tiersData.idUtilisateur - User id
 * @returns {Promise<Object>} Created tiers object with ID
 */
async function createTiersByUser(tiersData) {
    try {
        const { nomTiers, idUtilisateur } = tiersData;

        // Validate required fields as specified in the YAML
        if (!nomTiers || !idUtilisateur) {
            throw new Error('Missing required fields');
        }

        // Insert tiers into the database
        const [result] = await db.query(
            'INSERT INTO tiers (nomTiers, idUtilisateur) VALUES (?, ?)',
            [nomTiers, idUtilisateur]
        );

        // Return the created tiers with mapped field names matching the API
        return {
            id: result.insertId,
            nomTiers: nomTiers,
            dateHeureCreation: new Date(),
            dateHeureMAJ: new Date(),
            idUtilisateur: idUtilisateur
        };
    } catch (error) {
        console.error('Database insert error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Tiers with this id already exists');
        }
        throw new Error('Tiers creation failed: ' + error.message);
    }
}

/**
 * Find tiers by id
 * @param {number} idTiers - Tiers id to search for
 * @returns {Promise<Object|null>} Tiers object or null if not found
 */
async function getTiersById(idTiers) {
    try {
        const [rows] = await db.query(`SELECT idTiers, nomTiers, dateHeureCreation, dateHeureMAJ
                                            FROM tiers
                                            WHERE idTiers = ?`,
                                            [idTiers]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Failed to get tiers');
    }
}

/**
 * Update a tiers
 * @param {number} idTiers - Tiers ID to update
 * @param {Object} tiersData - Tiers data to update
 * @param {string} tiersData.nomTiers - Tiers name
 * @returns {Promise<Object>} Updated tiers object
 */
async function updateTiers(idTiers, tiersData) {
    try {
        const { nomTiers } = tiersData;

        // Validate required fields
        if (!nomTiers) {
            throw new Error('Tiers name is required');
        }

        // Update the category
        await db.query(
            'UPDATE tiers SET nomTiers = ?, dateHeureMAJ = NOW() WHERE idTiers = ?',
            [nomTiers, idTiers]
        );

        // Get the updated tiers
        const updatedTiers = await getTiersById(idTiers);
        if (!updatedTiers) {
            throw new Error('Tiers not found after update');
        }

        return updatedTiers;
    } catch (error) {
        console.error('Database update error:', error);
        throw new Error('Failed to update tiers: ' + error.message);
    }
}

/**
 * Delete a tiers
 * @param {number} idTiers - Tiers ID to delete
 * @returns {Promise<Object>} Success message
 */
async function deleteTiers(idTiers) {
    try {
        // Check if the tiers exists first
        const tiers = await getTiersById(idTiers);
        if (!tiers) {
            throw new Error('Tiers not found');
        }

        // Delete the category
        await db.query('DELETE FROM tiers WHERE idTiers = ?', [idTiers]);

        // category name
        return { message: 'Virement deleted successfully', idTiers: tiers.idTiers };
    } catch (error) {
        console.error('Database delete error:', error);
        throw new Error('Failed to delete tiers: ' + error.message);
    }
}

module.exports = {
    getTiersByUser,
    createTiersByUser,
    getTiersById,
    updateTiers,
    deleteTiers
};