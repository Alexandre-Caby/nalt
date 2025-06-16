const express = require('express');
const router = express.Router();

// GET /api/virements - Get all transfers for authenticated user
router.get('/', (req, res) => {
  res.status(200).json({ message: `Get all transfers for user ${req.userId}` });
});

// POST /api/virements - Create a new transfer for authenticated user
router.post('/', (req, res) => {
  res.status(201).json({ message: `Create new transfer for user ${req.userId}` });
});

// GET /api/virements/:idVirement - Get transfer by ID
router.get('/:idVirement', (req, res) => {
  res.status(200).json({ 
    message: `Get transfer ${req.params.idVirement} for user ${req.userId}` 
  });
});

// PUT /api/virements/:idVirement - Update transfer
router.put('/:idVirement', (req, res) => {
  res.status(200).json({ 
    message: `Update transfer ${req.params.idVirement} for user ${req.userId}` 
  });
});

// PATCH /api/virements/:idVirement - Partially update transfer
router.patch('/:idVirement', (req, res) => {
  res.status(200).json({ 
    message: `Partially update transfer ${req.params.idVirement} for user ${req.userId}` 
  });
});

// DELETE /api/virements/:idVirement - Delete transfer
router.delete('/:idVirement', (req, res) => {
  res.status(200).json({ 
    message: `Delete transfer ${req.params.idVirement} for user ${req.userId}` 
  });
});

module.exports = router;