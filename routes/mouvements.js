const express = require('express');
const router = express.Router();

// GET /api/mouvements - Get all movements for the authenticated user
router.get('/', (req, res) => {
  // req.userId comes from the authenticateToken middleware
  res.status(200).json({ message: `Get all movements for user ${req.userId}` });
});

// POST /api/mouvements - Create a new movement for the authenticated user
router.post('/', (req, res) => {
  res.status(201).json({ message: `Create new movement for user ${req.userId}` });
});

// GET /api/mouvements/:idMouvement - Get movement by ID for the authenticated user
router.get('/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Get movement ${req.params.idMouvement} for user ${req.userId}` 
  });
});

// PUT /api/mouvements/:idMouvement - Update movement for the authenticated user
router.put('/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Update movement ${req.params.idMouvement} for user ${req.userId}` 
  });
});

// PATCH /api/mouvements/:idMouvement - Partially update movement
router.patch('/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Partially update movement ${req.params.idMouvement} for user ${req.userId}` 
  });
});

// DELETE /api/mouvements/:idMouvement - Delete movement
router.delete('/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Delete movement ${req.params.idMouvement} for user ${req.userId}` 
  });
});

module.exports = router;