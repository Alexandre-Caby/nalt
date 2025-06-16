const express = require('express');
const db = require('../api-management/bdd_config.js'); // Import database configuration

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


module.exports = {
  findUserByLogin
};