const express = require('express');
const db = require('../api-management/bdd_config.js');


/**
 * Get all categories
 * @returns {Promise<Array>} Array of category objects
 */
async function getAllCategories() {
  try {
    const [rows] = await db.query(`
      SELECT 
        idCategorie,
        nomCategorie,
        dateHeureCreation,
        dateHeureMAJ
      FROM categorie
    `);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to get categories');
  }
}

/**
 * Get category by ID
 * @param {number} idCategorie - Category ID to get
 * @returns {Promise<Object|null>} Category object or null if not found
 */
async function getCategoryById(idCategorie) {
  try {
    const [rows] = await db.query(`
      SELECT 
        idCategorie,
        nomCategorie,
        dateHeureCreation,
        dateHeureMAJ
      FROM categorie
      WHERE idCategorie = ?
    `, [idCategorie]);
    
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to get category');
  }
}

/**
 * Create a new category
 * @param {Object} categoryData - Category data to insert
 * @param {string} categoryData.nomCategorie - Category name
 * @returns {Promise<Object>} Created category object with ID
 */
async function createCategory(categoryData) {
  try {
    const { nomCategorie } = categoryData;
    
    // Validate required fields
    if (!nomCategorie) {
      throw new Error('Category name is required');
    }
    
    // Insert category
    const [result] = await db.query(
      'INSERT INTO categorie (nomCategorie) VALUES (?)', 
      [nomCategorie]
    );
    
    // Get the new category with all fields
    const newCategory = await getCategoryById(result.insertId);
    return newCategory;
  } catch (error) {
    console.error('Database insert error:', error);
    throw new Error('Failed to create category: ' + error.message);
  }
}

/**
 * Update a category
 * @param {number} idCategorie - Category ID to update
 * @param {Object} categoryData - Category data to update
 * @param {string} categoryData.nomCategorie - Category name
 * @returns {Promise<Object>} Updated category object
 */
async function updateCategory(idCategorie, categoryData) {
  try {
    const { nomCategorie } = categoryData;
    
    // Validate required fields
    if (!nomCategorie) {
      throw new Error('Category name is required');
    }
    
    // Update the category
    await db.query(
      'UPDATE categorie SET nomCategorie = ?, dateHeureMAJ = NOW() WHERE idCategorie = ?',
      [nomCategorie, idCategorie]
    );
    
    // Get the updated category
    const updatedCategory = await getCategoryById(idCategorie);
    if (!updatedCategory) {
      throw new Error('Category not found after update');
    }
    
    return updatedCategory;
  } catch (error) {
    console.error('Database update error:', error);
    throw new Error('Failed to update category: ' + error.message);
  }
}

/**
 * Delete a category
 * @param {number} idCategorie - Category ID to delete
 * @returns {Promise<Object>} Success message
 */
async function deleteCategory(idCategorie) {
  try {
    // Check if the category exists first
    const category = await getCategoryById(idCategorie);
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Delete the category
    await db.query('DELETE FROM categorie WHERE idCategorie = ?', [idCategorie]);
    
    // category name 
    return { message: 'Category deleted successfully', nomCategorie: category.nomCategorie };
  } catch (error) {
    console.error('Database delete error:', error);
    throw new Error('Failed to delete category: ' + error.message);
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};