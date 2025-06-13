const express = require('express');
const categoriesRouter = express.Router();
const mouvementsRouter = express.Router();

// GET /api/v_categories - Get all categories view
categoriesRouter.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all categories view' });
});

// GET /api/v_mouvements - Get all movements view
mouvementsRouter.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all movements view' });
});

module.exports = {
  categories: categoriesRouter,
  mouvements: mouvementsRouter
};