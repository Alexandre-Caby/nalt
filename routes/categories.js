const express = require('express');
const router = express.Router();
const { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory,
} = require('../controllers/categories.js');
const {
  getSubcategoriesByCategoryId, 
  createSubcategory, 
  updateSubcategory, 
  deleteSubcategory, 
  getSubcategoryById 
} = require('../controllers/sousCategories.js');

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/categories - Create a new category
router.post('/', async (req, res) => {
  try {
    const { nomCategorie } = req.body;
    
    // Simple validation
    if (!nomCategorie) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: 'Category name is required' 
      });
    }
    
    const newCategory = await createCategory({ nomCategorie });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/categories/:idCategorie - Get category by ID
router.get('/:idCategorie', async (req, res) => {
  try {
    const idCategorie = parseInt(req.params.idCategorie);
    if (isNaN(idCategorie)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    
    const category = await getCategoryById(idCategorie);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    console.error('Error getting category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/categories/:idCategorie - Update category
router.put('/:idCategorie', async (req, res) => {
  try {
    const idCategorie = parseInt(req.params.idCategorie);
    if (isNaN(idCategorie)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    
    const { nomCategorie } = req.body;
    
    // Simple validation
    if (!nomCategorie) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: 'Category name is required' 
      });
    }
    
    const updatedCategory = await updateCategory(idCategorie, { nomCategorie });
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/categories/:idCategorie - Delete category
router.delete('/:idCategorie', async (req, res) => {
  try {
    const idCategorie = parseInt(req.params.idCategorie);
    if (isNaN(idCategorie)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    
    const result = await deleteCategory(idCategorie);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/categories/:idCategorie/sous-categories - Get all subcategories for a category
router.get('/:idCategorie/sous-categories', async (req, res) => {
  try {
    const idCategorie = parseInt(req.params.idCategorie);
    if (isNaN(idCategorie)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    
    // Check if the category exists
    const category = await getCategoryById(idCategorie);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const subcategories = await getSubcategoriesByCategoryId(idCategorie);
    res.status(200).json(subcategories);
  } catch (error) {
    console.error('Error getting subcategories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/categories/:idCategorie/sous-categories/:idSousCategorie - Get subcategory by ID
router.get('/:idCategorie/sous-categories/:idSousCategorie', async (req, res) => {
  try {
    const idCategorie = parseInt(req.params.idCategorie);
    const idSousCategorie = parseInt(req.params.idSousCategorie);
    
    if (isNaN(idCategorie) || isNaN(idSousCategorie)) {
      return res.status(400).json({ message: 'Invalid category or subcategory ID' });
    }
    
    // Check if the category exists
    const category = await getCategoryById(idCategorie);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Get the subcategory
    const subcategory = await getSubcategoryById(idSousCategorie);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    // Verify that the subcategory belongs to the specified category
    if (subcategory.idCategorie !== idCategorie) {
      return res.status(400).json({ 
        message: 'The specified subcategory does not belong to the specified category' 
      });
    }
    
    res.status(200).json(subcategory);
  } catch (error) {
    console.error('Error getting subcategory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/categories/:idCategorie/sous-categories - Create a new subcategory
router.post('/:idCategorie/sous-categories', async (req, res) => {
  try {
    const idCategorie = parseInt(req.params.idCategorie);
    if (isNaN(idCategorie)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    
    const { nomSousCategorie } = req.body;
    
    // Simple validation
    if (!nomSousCategorie) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: 'Subcategory name is required' 
      });
    }
    
    const newSubcategory = await createSubcategory({ 
      nomSousCategorie, 
      idCategorie 
    });
    
    res.status(201).json(newSubcategory);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/categories/:idCategorie/sous-categories/:idSousCategorie - Update subcategory
router.put('/:idCategorie/sous-categories/:idSousCategorie', async (req, res) => {
  try {
    const idCategorie = parseInt(req.params.idCategorie);
    const idSousCategorie = parseInt(req.params.idSousCategorie);
    
    if (isNaN(idCategorie) || isNaN(idSousCategorie)) {
      return res.status(400).json({ message: 'Invalid category or subcategory ID' });
    }
    
    const { nomSousCategorie } = req.body;
    
    // Simple validation
    if (!nomSousCategorie) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: 'Subcategory name is required' 
      });
    }
    
    // Verify that the subcategory belongs to the specified category
    const subcategory = await getSubcategoryById(idSousCategorie);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    if (subcategory.idCategorie !== idCategorie) {
      return res.status(400).json({ 
        message: 'The specified subcategory does not belong to the specified category' 
      });
    }
    
    const updatedSubcategory = await updateSubcategory(idSousCategorie, { nomSousCategorie });
    res.status(200).json(updatedSubcategory);
  } catch (error) {
    console.error('Error updating subcategory:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/categories/:idCategorie/sous-categories/:idSousCategorie - Delete subcategory
router.delete('/:idCategorie/sous-categories/:idSousCategorie', async (req, res) => {
  try {
    const idCategorie = parseInt(req.params.idCategorie);
    const idSousCategorie = parseInt(req.params.idSousCategorie);
    
    if (isNaN(idCategorie) || isNaN(idSousCategorie)) {
      return res.status(400).json({ message: 'Invalid category or subcategory ID' });
    }
    
    // Verify that the subcategory belongs to the specified category
    const subcategory = await getSubcategoryById(idSousCategorie);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    if (subcategory.idCategorie !== idCategorie) {
      return res.status(400).json({ 
        message: 'The specified subcategory does not belong to the specified category' 
      });
    }
    
    const result = await deleteSubcategory(idSousCategorie);
    res.status(204).json(result);
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;