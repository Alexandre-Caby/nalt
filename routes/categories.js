const express = require('express');
const router = express.Router();

// GET /api/categories - Get all categories (public)
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all categories' });
});

// POST /api/categories - Create a new category (admin only)
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create new category' });
});

// GET /api/categories/:idCategorie - Get category by ID (public)
router.get('/:idCategorie', (req, res) => {
  res.status(200).json({ message: `Get category ${req.params.idCategorie}` });
});

// PUT /api/categories/:idCategorie - Update category (admin only)
router.put('/:idCategorie', (req, res) => {
  res.status(200).json({ message: `Update category ${req.params.idCategorie}` });
});

// DELETE /api/categories/:idCategorie - Delete category (admin only)
router.delete('/:idCategorie', (req, res) => {
  res.status(200).json({ message: `Delete category ${req.params.idCategorie}` });
});

// GET /api/categories/:idCategorie/sous-categories - Get all subcategories
router.get('/:idCategorie/sous-categories', (req, res) => {
  res.status(200).json({ message: `Get all subcategories for category ${req.params.idCategorie}` });
});

// POST /api/categories/:idCategorie/sous-categories - Create a new subcategory
router.post('/:idCategorie/sous-categories', (req, res) => {
  res.status(201).json({ message: `Create new subcategory for category ${req.params.idCategorie}` });
});

// GET /api/categories/:idCategorie/sous-categories/:idSousCategorie - Get subcategory by ID
router.get('/:idCategorie/sous-categories/:idSousCategorie', (req, res) => {
  res.status(200).json({ 
    message: `Get subcategory ${req.params.idSousCategorie} for category ${req.params.idCategorie}` 
  });
});

// PUT /api/categories/:idCategorie/sous-categories/:idSousCategorie - Update subcategory
router.put('/:idCategorie/sous-categories/:idSousCategorie', (req, res) => {  
  res.status(200).json({ 
    message: `Update subcategory ${req.params.idSousCategorie} for category ${req.params.idCategorie}` 
  });
});

// DELETE /api/categories/:idCategorie/sous-categories/:idSousCategorie - Delete subcategory
router.delete('/:idCategorie/sous-categories/:idSousCategorie', (req, res) => {
  res.status(200).json({ 
    message: `Delete subcategory ${req.params.idSousCategorie} for category ${req.params.idCategorie}` 
  });
});

module.exports = router;