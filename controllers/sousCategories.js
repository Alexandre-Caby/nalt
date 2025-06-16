const express = require('express');
const db = require('../api-management/bdd_config.js'); // Import database configuration
const { getCategoryById } = require('./categories.js'); // Import category functions

/**
 * Get all subcategories for a category
 * @param {number} idCategorie - Category ID
 * @returns {Promise<Array>} Array of subcategory objects
 */
async function getSubcategoriesByCategoryId(idCategorie) {
  try {
    const [rows] = await db.query(`
      SELECT 
        idSousCategorie,
        nomSousCategorie,
        idCategorie,
        dateHeureCreation,
        dateHeureMAJ
      FROM souscategorie
      WHERE idCategorie = ?
    `, [idCategorie]);
    
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to get subcategories');
  }
}

/**
 * Get subcategory by ID
 * @param {number} idSousCategorie - Subcategory ID
 * @returns {Promise<Object|null>} Subcategory object or null if not found
 */
async function getSubcategoryById(idSousCategorie) {
  try {
    const [rows] = await db.query(`
      SELECT 
        idSousCategorie,
        nomSousCategorie,
        idCategorie,
        dateHeureCreation,
        dateHeureMAJ
      FROM souscategorie
      WHERE idSousCategorie = ?
    `, [idSousCategorie]);
    
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to get subcategory');
  }
}

/**
 * Create a new subcategory
 * @param {Object} subcategoryData - Subcategory data
 * @param {string} subcategoryData.nomSousCategorie - Subcategory name
 * @param {number} subcategoryData.idCategorie - Parent category ID
 * @returns {Promise<Object>} Created subcategory object
 */
async function createSubcategory(subcategoryData) {
  try {
    const { nomSousCategorie, idCategorie } = subcategoryData;
    
    // Validate required fields
    if (!nomSousCategorie) {
      throw new Error('Subcategory name is required');
    }
    
    if (!idCategorie) {
      throw new Error('Category ID is required');
    }
    
    // Check if the parent category exists
    const category = await getCategoryById(idCategorie);
    if (!category) {
      throw new Error('Parent category not found');
    }
    
    // Insert subcategory
    const [result] = await db.query(
      'INSERT INTO souscategorie (nomSousCategorie, idCategorie) VALUES (?, ?)', 
      [nomSousCategorie, idCategorie]
    );
    
    // Get the new subcategory
    const newSubcategory = await getSubcategoryById(result.insertId);
    return newSubcategory;
  } catch (error) {
    console.error('Database insert error:', error);
    throw new Error('Failed to create subcategory: ' + error.message);
  }
}

/**
 * Update a subcategory
 * @param {number} idSousCategorie - Subcategory ID
 * @param {Object} subcategoryData - Subcategory data
 * @param {string} subcategoryData.nomSousCategorie - Subcategory name
 * @returns {Promise<Object>} Updated subcategory object
 */
async function updateSubcategory(idSousCategorie, subcategoryData) {
  try {
    const { nomSousCategorie } = subcategoryData;
    
    // Validate required fields
    if (!nomSousCategorie) {
      throw new Error('Subcategory name is required');
    }
    
    // Update the subcategory
    await db.query(
      'UPDATE souscategorie SET nomSousCategorie = ?, dateHeureMAJ = NOW() WHERE idSousCategorie = ?',
      [nomSousCategorie, idSousCategorie]
    );
    
    // Get the updated subcategory
    const updatedSubcategory = await getSubcategoryById(idSousCategorie);
    if (!updatedSubcategory) {
      throw new Error('Subcategory not found after update');
    }
    
    return updatedSubcategory;
  } catch (error) {
    console.error('Database update error:', error);
    throw new Error('Failed to update subcategory: ' + error.message);
  }
}

/**
 * Delete a subcategory
 * @param {number} idSousCategorie - Subcategory ID
 * @returns {Promise<Object>} Success message
 */
async function deleteSubcategory(idSousCategorie) {
  try {
    // Check if the subcategory exists
    const subcategory = await getSubcategoryById(idSousCategorie);
    if (!subcategory) {
      throw new Error('Subcategory not found');
    }
    
    // Delete the subcategory
    await db.query('DELETE FROM souscategorie WHERE idSousCategorie = ?', [idSousCategorie]);
    
    return { message: 'Subcategory deleted successfully', nomSousCategorie: subcategory.nomSousCategorie };
  } catch (error) {
    console.error('Database delete error:', error);
    throw new Error('Failed to delete subcategory: ' + error.message);
  }
}

module.exports = {
    getSubcategoriesByCategoryId,
    getSubcategoryById,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory
};