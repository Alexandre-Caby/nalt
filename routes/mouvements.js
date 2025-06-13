const express = require('express');
const router = express.Router({ mergeParams: true });

// GET /api/utilisateurs/:idUtilisateur/mouvements - Get all movements
router.get('/', (req, res) => {
  res.status(200).json({ message: `Get all movements for user ${req.params.idUtilisateur}` });
});

// POST /api/utilisateurs/:idUtilisateur/mouvements - Create a new movement
router.post('/', (req, res) => {
  res.status(201).json({ message: `Create new movement for user ${req.params.idUtilisateur}` });
});

// GET /api/utilisateurs/:idUtilisateur/mouvements/:idMouvement - Get movement by ID
router.get('/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Get movement ${req.params.idMouvement} for user ${req.params.idUtilisateur}` 
  });
});

// PUT /api/utilisateurs/:idUtilisateur/mouvements/:idMouvement - Update movement
router.put('/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Update movement ${req.params.idMouvement} for user ${req.params.idUtilisateur}` 
  });
});

// PATCH /api/utilisateurs/:idUtilisateur/mouvements/:idMouvement - Partially update movement
router.patch('/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Partially update movement ${req.params.idMouvement} for user ${req.params.idUtilisateur}` 
  });
});

// DELETE /api/utilisateurs/:idUtilisateur/mouvements/:idMouvement - Delete movement
router.delete('/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Delete movement ${req.params.idMouvement} for user ${req.params.idUtilisateur}` 
  });
});

module.exports = router;