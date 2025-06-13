const express = require('express');
const router = express.Router({ mergeParams: true });

// GET /api/utilisateurs/:idUtilisateur/tiers - Get all third parties
router.get('/', (req, res) => {
  res.status(200).json({ message: `Get all third parties for user ${req.params.idUtilisateur}` });
});

// POST /api/utilisateurs/:idUtilisateur/tiers - Create a new third party
router.post('/', (req, res) => {
  res.status(201).json({ message: `Create new third party for user ${req.params.idUtilisateur}` });
});

// GET /api/utilisateurs/:idUtilisateur/tiers/:idTiers - Get third party by ID
router.get('/:idTiers', (req, res) => {
  res.status(200).json({ 
    message: `Get third party ${req.params.idTiers} for user ${req.params.idUtilisateur}` 
  });
});

// PUT /api/utilisateurs/:idUtilisateur/tiers/:idTiers - Update third party
router.put('/:idTiers', (req, res) => {
  res.status(200).json({ 
    message: `Update third party ${req.params.idTiers} for user ${req.params.idUtilisateur}` 
  });
});

// PATCH /api/utilisateurs/:idUtilisateur/tiers/:idTiers - Partially update third party
router.patch('/:idTiers', (req, res) => {
  res.status(200).json({ 
    message: `Partially update third party ${req.params.idTiers} for user ${req.params.idUtilisateur}` 
  });
});

// DELETE /api/utilisateurs/:idUtilisateur/tiers/:idTiers - Delete third party
router.delete('/:idTiers', (req, res) => {
  res.status(200).json({ 
    message: `Delete third party ${req.params.idTiers} for user ${req.params.idUtilisateur}` 
  });
});

module.exports = router;