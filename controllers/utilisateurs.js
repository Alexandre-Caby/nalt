const express = require('express');
const db = require('../api-management/bdd_config.js');
const { hashPassword } = require('../api-management/utils.js');

/**
 * Find user by login in the database
 * @param {string} login - User's login to search for
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findUserByLogin(login) {
  try {
    const [rows] = await db.query('SELECT * FROM utilisateur WHERE login = ?', [login]);
    if (rows.length > 0) {
      return rows[0]; // Return the first user found
    }
    return null; // No user found
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

/**
 * Get all users from the database
 * @returns {Promise<Array>} Array of user objects
 */
async function getAllUsers() {
  try {
    // Match field names from the YAML documentation
    const [rows] = await db.query(`
      SELECT 
        idUtilisateur as id, 
        login, 
        nomUtilisateur as nom, 
        prenomUtilisateur as prenom, 
        ville, 
        codePostal,
        dateHeureCreation
      FROM utilisateur
    `);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

/**
 * Create a new user in the database
 * @param {Object} userData - User data to insert
 * @param {string} userData.login - User's login
 * @param {string} userData.motDePasse - User's password
 * @param {string} userData.nomUtilisateur - User's last name
 * @param {string} userData.prenomUtilisateur - User's first name
 * @param {string} userData.ville - User's city (optional)
 * @param {string} userData.codePostal - User's postal code (optional)
 * @returns {Promise<Object>} Created user object with ID
 * @throws {Error} If required fields are missing or database error occurs
 */
async function createUser(userData) {
  try {
    const { login, motDePasse, nomUtilisateur, prenomUtilisateur, ville, codePostal } = userData;
    
    // Validate required fields as specified in the YAML
    if (!nomUtilisateur || !prenomUtilisateur || !motDePasse) {
      throw new Error('Missing required fields');
    }
    
    // Generate a unique login : first letter of prenomUtilisateur + nomUtilisateur in lowercase
    if (!prenomUtilisateur || !nomUtilisateur) {
      throw new Error('First name and last name are required to generate a login');
    }
    if (prenomUtilisateur.length === 0 || nomUtilisateur.length === 0) {
      throw new Error('First name and last name cannot be empty');
    }    
    const userLogin = login || `${prenomUtilisateur.toLowerCase().charAt(0)}${nomUtilisateur.toLowerCase()}`;
    
    // Hash the password before storing
    const hashedPassword = await hashPassword(motDePasse);
    
    // Insert user into the database
    const [result] = await db.query(
      'INSERT INTO utilisateur (login, motDePasse, nomUtilisateur, prenomUtilisateur, ville, codePostal) VALUES (?, ?, ?, ?, ?, ?)', 
      [userLogin, hashedPassword, nomUtilisateur, prenomUtilisateur, ville || null, codePostal || null]
    );
    
    // Return the created user with mapped field names matching the API
    return { 
      id: result.insertId, 
      login: userLogin,
      nomUtilisateur, 
      prenomUtilisateur,
      ville: ville || null, 
      codePostal: codePostal || null,
      dateHeureCreation: new Date()
    };
  } catch (error) {
    console.error('Database insert error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('User with this login already exists');
    }
    throw new Error('User creation failed: ' + error.message);
  }
}

/**
 * Get user by ID from the database
 * @param {number} idUtilisateur - User ID to search for
 * @returns {Promise<Object|null>} User object or null if not found
 * @throws {Error} If database query fails
 */
async function getUserById(idUtilisateur) {
  try {
    // Match field names from the YAML documentation
    const [rows] = await db.query(`
      SELECT 
        idUtilisateur, 
        login, 
        nomUtilisateur, 
        prenomUtilisateur, 
        ville, 
        codePostal
      FROM utilisateur 
      WHERE idUtilisateur = ?
    `, [idUtilisateur]);
    
    if (rows.length > 0) {
      return rows[0]; // Return the user found
    }
    return null; // No user found
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

/**
 * Update user by ID in the database
 * @param {number} idUtilisateur - User ID to update
 * @param {Object} userData - User data to update
 * @param {string} userData.nomUtilisateur - User's last name
 * @param {string} userData.prenomUtilisateur - User's first name
 * @param {string} userData.motDePasse - User's password (optional)
 * @param {string} userData.ville - User's city (optional)
 * @param {string} userData.codePostal - User's postal code (optional)
 * @returns {Promise<Object>} Updated user object
 * @throws {Error} If database update fails
 */
async function updateUser(idUtilisateur, userData) {
  try {
    const { nomUtilisateur, prenomUtilisateur, motDePasse, ville, codePostal } = userData;
    
    let hashedPassword = null;
    if (motDePasse) {
      hashedPassword = await hashPassword(motDePasse);
    }
    
    // Build update query dynamically based on provided fields
    let updateFields = [];
    let values = [];
    
    if (nomUtilisateur) {
      updateFields.push('nomUtilisateur = ?');
      values.push(nomUtilisateur);
    }
    
    if (prenomUtilisateur) {
      updateFields.push('prenomUtilisateur = ?');
      values.push(prenomUtilisateur);
    }
    
    if (hashedPassword) {
      updateFields.push('motDePasse = ?');
      values.push(hashedPassword);
    }
    
    if (ville !== undefined) {
      updateFields.push('ville = ?');
      values.push(ville);
    }
    
    if (codePostal !== undefined) {
      updateFields.push('codePostal = ?');
      values.push(codePostal);
    }
    
    // Add dateHeureMAJ
    updateFields.push('dateHeureMAJ = NOW()');
    
    // Add the idUtilisateur to the values array
    values.push(idUtilisateur);
    
    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }
    
    const query = `UPDATE utilisateur SET ${updateFields.join(', ')} WHERE idUtilisateur = ?`;
    await db.query(query, values);
    
    // Get the updated user
    const updatedUser = await getUserById(idUtilisateur);
    if (!updatedUser) {
      throw new Error('User not found after update');
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Database update error:', error);
    throw new Error('User update failed: ' + error.message);
  }
}

/**
 * Delete user by ID from the database
 * @param {number} idUtilisateur - User ID to delete
 * @returns {Promise<Object>} Success message or error message if user not found
 * @throws {Error} If database delete fails
 */
async function deleteUser(idUtilisateur) {
  try {
    const [result] = await db.query('DELETE FROM utilisateur WHERE idUtilisateur = ?', [idUtilisateur]);
    if (result.affectedRows > 0) {
      return { message: 'User deleted successfully' };
    }
    return { message: 'User not found' };
  } catch (error) {
    console.error('Database delete error:', error);
    throw new Error('User deletion failed');
  }
}

module.exports = {
  findUserByLogin,
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};