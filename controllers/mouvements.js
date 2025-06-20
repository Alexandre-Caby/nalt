const express = require('express');
const db = require('../api-management/bdd_config.js'); // Import database configuration

async function getMouvementsByUser(userId) {
   try {
        const [rows] = await db.query(`SELECT *
                                           FROM mouvement
                                         `);
        if (rows.length > 0) {
            return rows; // Return the first tiers found
        }
        return null; // No tiers found
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
}
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

    // Validation complète
    const errors = [];
    if (!typeMouvement) errors.push('typeMouvement is required');
    if (montant === undefined || montant === null || isNaN(montant)) errors.push('montant is required and must be a number');
    if (!dateMouvement) errors.push('dateMouvement is required');
    if (!idCompte) errors.push('idCompte is required');
    if (!idTiers) errors.push('idTiers is required');
    if (!idCategorie) errors.push('idCategorie is required');
    if(!idVirement) errors.push('idVirement is required');

    if (errors.length > 0) {
      const error = new Error('Validation error');
      error.details = errors;
      throw error;
    }
    
    // Insert mouvement
    const [result] = await db.query(
      `INSERT INTO mouvement 
        (montant, typeMouvement, dateMouvement, idCompte, idTiers, idCategorie, idSousCategorie,idVirement)
       VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
      [montant, typeMouvement, dateMouvement, idCompte, idTiers, idCategorie, idSousCategorie, idVirement]
    );

    // Get the new mouvement with all fields
    const newMouvement = await getMouvementById(result.insertId);
    return newMouvement;
  } catch (error) {
    if (error.details) {
      // Validation error
      throw error;
    }
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}
async function patchMouvement(idMouvement, mouvementData) {
  try {
    const {
      dateMouvement,
      idCategorie,
      idSousCategorie,
    } = mouvementData;

    // Validation
    const errors = [];
    if (dateMouvement !== undefined && !dateMouvement) errors.push('dateMouvement is required if provided');
    // Ajoute d'autres validations si besoin

    if (errors.length > 0) {
      const error = new Error('Validation error');
      error.details = errors;
      throw error;
    }

    // Construction dynamique de la requête
    let updateFields = [];
    let values = [];

    
    if (dateMouvement !== undefined) {
      updateFields.push('dateMouvement = ?');
      values.push(dateMouvement);
    }
  
    if (idCategorie !== undefined) {
      updateFields.push('idCategorie = ?');
      values.push(idCategorie);
    }
    if (idSousCategorie !== undefined) {
      updateFields.push('idSousCategorie = ?');
      values.push(idSousCategorie);
    }


    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    // Ajoute la date de mise à jour si tu as un champ prévu
    // updateFields.push('dateHeureMAJ = NOW()');
    //On ajoute la dateHeureMAJ
    updateFields.push('dateHeureMAJ = NOW()');
    values.push(idMouvement);

    const query = `UPDATE mouvement SET ${updateFields.join(', ')} WHERE idMouvement = ?`;
    await db.query(query, values);

    // Récupère le mouvement mis à jour
    const updatedMouvement = await getMouvementById(idMouvement);
    if (!updatedMouvement) {
      throw new Error('Mouvement not found after update');
    }

    return updatedMouvement;
  } catch (error) {
    if (error.details) {
      throw error;
    }
    console.error('Database update error:', error);
    throw new Error('Mouvement update failed: ' + error.message);
  }
}


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

async function deleteMouvement(idMouvement) {
  try {
    const [result] = await db.query('DELETE FROM mouvement WHERE idMouvement = ?', [idMouvement]);
    if (result.affectedRows > 0) {
      return { message: 'Mouvement deleted successfully' };
    }
    return { message: 'Mouvement not found' };
  } catch (error) {
    console.error('Database delete error:', error);
    throw new Error('Mouvement deletion failed');
  }
}


// N'oublie pas d'exporter la fonction :
module.exports = {
  getMouvementsByUser,
  createMouvement,
  getMouvementById,
  patchMouvement,
  deleteMouvement
};