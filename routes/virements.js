const express = require('express');
const router = express.Router({ mergeParams: true });

// GET /api/utilisateurs/:idUtilisateur/virements - Get all transfers
router.get('/', (req, res) => {
  res.status(200).json({ message: `Get all transfers for user ${req.params.idUtilisateur}` });
});

// POST /api/utilisateurs/:idUtilisateur/virements - Create a new transfer
router.post('/', (req, res) => {
  res.status(201).json({ message: `Create new transfer for user ${req.params.idUtilisateur}` });
});

// GET /api/utilisateurs/:idUtilisateur/virements/:idVirement - Get transfer by ID
router.get('/:idVirement', (req, res) => {
  res.status(200).json({ 
    message: `Get transfer ${req.params.idVirement} for user ${req.params.idUtilisateur}` 
  });
});

// PUT /api/utilisateurs/:idUtilisateur/virements/:idVirement - Update transfer
router.put('/:idVirement', (req, res) => {
  res.status(200).json({ 
    message: `Update transfer ${req.params.idVirement} for user ${req.params.idUtilisateur}` 
  });
});

// PATCH /api/utilisateurs/:idUtilisateur/virements/:idVirement - Partially update transfer
router.patch('/:idVirement', (req, res) => {
  res.status(200).json({ 
    message: `Partially update transfer ${req.params.idVirement} for user ${req.params.idUtilisateur}` 
  });
});

// DELETE /api/utilisateurs/:idUtilisateur/virements/:idVirement - Delete transfer
router.delete('/:idVirement', (req, res) => {
  res.status(200).json({ 
    message: `Delete transfer ${req.params.idVirement} for user ${req.params.idUtilisateur}` 
  });
});

module.exports = router;