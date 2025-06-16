const express = require('express');
const router = express.Router();

// GET /api/tiers - Get all third parties for authenticated user
router.get('/', (req, res) => {
  res.status(200).json({ message: `Get all third parties for user ${req.userId}` });
});

// POST /api/tiers - Create a new third party for authenticated user
router.post('/', (req, res) => {
  res.status(201).json({ message: `Create new third party for user ${req.userId}` });
});

// GET /api/tiers/:idTiers - Get third party by ID
router.get('/:idTiers', (req, res) => {
  res.status(200).json({ 
    message: `Get third party ${req.params.idTiers} for user ${req.userId}` 
  });
});

// PUT /api/tiers/:idTiers - Update third party
router.put('/:idTiers', (req, res) => {
  res.status(200).json({ 
    message: `Update third party ${req.params.idTiers} for user ${req.userId}` 
  });
});

// PATCH /api/tiers/:idTiers - Partially update third party
router.patch('/:idTiers', (req, res) => {
  res.status(200).json({ 
    message: `Partially update third party ${req.params.idTiers} for user ${req.userId}` 
  });
});

// DELETE /api/tiers/:idTiers - Delete third party
router.delete('/:idTiers', (req, res) => {
  res.status(200).json({ 
    message: `Delete third party ${req.params.idTiers} for user ${req.userId}` 
  });
});

module.exports = router;