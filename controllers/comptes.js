const express = require('express');
const db = require('../api-management/bdd_config.js'); // Import database configuration

/**
 * Récupérer tous les comptes de l'utilisateur authentifié
 * @returns {Promise<Array>} Liste des comptes de l'utilisateur
 * @throws {Error} Si une erreur de base de données se produit
 * @param {number} idUtilisateur - ID de l'utilisateur pour lequel récupérer les comptes
 */
async function getAllAccounts(idUtilisateur) {
    try {
        // Requête pour récupérer tous les comptes de l'utilisateur
        const [rows] = await db.query(`
        SELECT 
            idCompte AS id, 
            descriptionCompte AS nom,
            nomBanque,
            IdUtilisateur,
            dernierSolde AS solde, 
            soldeInitial,
            dateHeureCreation,
            dateHeureMAJ
        FROM compte
        WHERE idUtilisateur = ?
        `, [idUtilisateur]);
    
        return rows; // Retourne la liste des comptes
        } catch (error) {
        console.error('Erreur lors de la récupération des comptes:', error);
        throw new Error('Erreur lors de la récupération des comptes');
        }
    }

/**
 * Ajouter un nouveau compte pour l'utilisateur authentifié
 * @param {Object} compteData - Données du compte à ajouter
 * @param {string} compteData.descriptionCompte - Description du compte
 * @param {string} compteData.nomBanque - Nom de la banque
 * @param {number} compteData.IdUtilisateur - ID de l'utilisateur
 * @param {number} compteData.soldeInitial - Solde initial du compte
 * @return {Promise<Object>} Détails du compte créé avec son ID
 * @throws {Error} Si une erreur de base de données se produit
 */
async function addAccount(compteData) {
    try {
        // Requête pour insérer un nouveau compte
        const result = await db.query(`
            INSERT INTO compte (descriptionCompte, nomBanque, IdUtilisateur, soldeInitial, dernierSolde)
            VALUES (?, ?, ?, ?, ?)
        `, [compteData.descriptionCompte, compteData.nomBanque, compteData.IdUtilisateur, compteData.soldeInitial, compteData.soldeInitial]);

        return { id: result[0].insertId, ...compteData }; // Retourne le nouveau compte avec son ID
    } catch (error) {
        console.error('Erreur lors de la création du compte:', error);
        throw new Error('Erreur lors de la création du compte');
    }
}
/**
 * Récupérer un compte spécifique de l'utilisateur par son ID
 * @param {number} idUtilisateur - ID de l'utilisateur
 * @param {number} idCompte - ID du compte à récupérer
 * @returns {Promise<Object>} Détails du compte
 * @throws {Error} Si le compte n'est pas trouvé ou en cas d'erreur de base de données
 */
async function getAccountById(idUtilisateur, idCompte)
{
    try {
        // Requête pour récupérer un compte spécifique de l'utilisateur
        const [rows] = await db.query(`
            SELECT 
                idCompte AS id, 
                descriptionCompte AS nom,
                nomBanque,
                IdUtilisateur,
                dernierSolde AS solde, 
                soldeInitial,
                dateHeureCreation,
                dateHeureMAJ
            FROM compte
            WHERE idUtilisateur = ? AND idCompte = ?
        `, [idUtilisateur, idCompte]);

        if (rows.length === 0) {
            throw new Error('Compte non trouvé');
        }

        return rows[0]; // Retourne le compte trouvé
    } catch (error) {
        console.error('Erreur lors de la récupération du compte:', error);
        throw new Error('Erreur lors de la récupération du compte');
    }
}

async function updateAccount(idCompte, compteData) {
    try {
        // Requête pour mettre à jour un compte
        const result = await db.query(`
            UPDATE compte 
            SET descriptionCompte = ?, nomBanque = ?, soldeInitial = ?, dernierSolde = ?
            WHERE idCompte = ?
        `, [compteData.descriptionCompte, compteData.nomBanque, compteData.soldeInitial, compteData.soldeInitial, idCompte]);

        if (result[0].affectedRows === 0) {
            throw new Error('Compte non trouvé');
        }

        return { id: idCompte, ...compteData }; // Retourne le compte mis à jour avec son ID
    } catch (error) {
        console.error('Erreur lors de la mise à jour du compte:', error);
        throw new Error('Erreur lors de la mise à jour du compte');
    }
}

async function patchAccount(idCompte, compteData) {
    try {
        // Requête pour mettre à jour partiellement un compte
        //On regarde chaque champ, s'il est défini, on le met à jour
        const fieldsToUpdate = [];
        const values = [];
        //Vérification des champs à mettre à jour

        if (compteData.descriptionCompte) {
            fieldsToUpdate.push('descriptionCompte = ?');
            values.push(compteData.descriptionCompte);
        }
        if (compteData.nomBanque) {
            fieldsToUpdate.push('nomBanque = ?');
            values.push(compteData.nomBanque);
        }
        if (compteData.soldeInitial !== undefined) {
            fieldsToUpdate.push('soldeInitial = ?');
            values.push(compteData.soldeInitial);
        }
        if (compteData.dernierSolde !== undefined) {
            fieldsToUpdate.push('dernierSolde = ?');
            values.push(compteData.dernierSolde);
        }
        if (fieldsToUpdate.length === 0) {
            throw new Error('Aucun champ à mettre à jour');
        }
        //On ajoute l'ID du compte à la fin des valeurs
        values.push(idCompte);

        const [rows] = await db.query(`
            UPDATE compte 
            SET ${fieldsToUpdate.join(', ')} 
            WHERE idCompte = ?
        `, values);
        if (rows.affectedRows === 0) {
            throw new Error('Compte non trouvé');
        }

        return { id: idCompte, ...compteData }; // Retourne le compte mis à jour avec son ID
    } catch (error) {
        console.error('Erreur lors de la mise à jour partielle du compte:', error);
        throw new Error('Erreur lors de la mise à jour partielle du compte');
    }
}

async function deleteAccount(idCompte) {
    try {
        // Requête pour supprimer un compte
        const result = await db.query('DELETE FROM compte WHERE idCompte = ?', [idCompte]);
        if (result[0].affectedRows === 0) {
            throw new Error('Compte non trouvé');
        }
        return { message: 'Compte supprimé avec succès' }; // Retourne un message de succès
    } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        throw new Error('Erreur lors de la suppression du compte');
    }
}

// Récupérer tous les mouvements d'un utilisateur pour un compte donné
async function getMouvementsByUserAndCompte(idUtilisateur, idCompte) {
  try {
    const [rows] = await db.query(
      `SELECT * FROM mouvement WHERE idCompte = ?`,
      [idUtilisateur, idCompte]
    );
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

// Créer un mouvement (déjà présent, mais rappel pour cohérence)
async function createMouvement(mouvementData) {
  try {
    const {
      montant,
      typeMouvement,
      dateMouvement,
      idCompte,
      idTiers,
      idCategorie,
      idSousCategorie,
      idVirement
    } = mouvementData;

    // Validation (déjà faite côté route, mais tu peux la renforcer ici)
    const [result] = await db.query(
      `INSERT INTO mouvement 
        (montant, typeMouvement, dateMouvement, idCompte, idTiers, idCategorie, idSousCategorie, idVirement)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [montant, typeMouvement, dateMouvement, idCompte, idTiers, idCategorie, idSousCategorie, idVirement]
    );

    // Retourne le mouvement créé
    const newMouvement = await getMouvementById(result.insertId);
    return newMouvement;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

// Récupérer un mouvement par son ID (utile pour createMouvement)
async function getMouvementById(idMouvement) {
  try {
    const [rows] = await db.query(
      `SELECT * FROM mouvement WHERE idMouvement = ?`,
      [idMouvement]
    );
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}


module.exports = {
    getAllAccounts,
    addAccount,
    getAccountById,
    updateAccount,
    patchAccount,
    deleteAccount,  
    getMouvementsByUserAndCompte,
  createMouvement,
  getMouvementById
};