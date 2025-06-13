const express = require('express');
const router = express.Router({ mergeParams: true });

// GET /api/utilisateurs/:idUtilisateur/comptes - Get all accounts for a user
router.get('/', (req, res) => {
  res.status(200).json({ message: `Get all accounts for user ${req.params.idUtilisateur}` });
});

// POST /api/utilisateurs/:idUtilisateur/comptes - Create a new account for a user
router.post('/', (req, res) => {
  res.status(201).json({ message: `Create new account for user ${req.params.idUtilisateur}` });
});

// GET /api/utilisateurs/:idUtilisateur/comptes/:idCompte - Get account by ID
router.get('/:idCompte', (req, res) => {
  res.status(200).json({ 
    message: `Get account ${req.params.idCompte} for user ${req.params.idUtilisateur}` 
  });
});

// PUT /api/utilisateurs/:idUtilisateur/comptes/:idCompte - Update account by ID
router.put('/:idCompte', (req, res) => {
  res.status(200).json({ 
    message: `Update account ${req.params.idCompte} for user ${req.params.idUtilisateur}` 
  });
});

// PATCH /api/utilisateurs/:idUtilisateur/comptes/:idCompte - Partially update account
router.patch('/:idCompte', (req, res) => {
  res.status(200).json({ 
    message: `Partially update account ${req.params.idCompte} for user ${req.params.idUtilisateur}` 
  });
});

// DELETE /api/utilisateurs/:idUtilisateur/comptes/:idCompte - Delete account
router.delete('/:idCompte', (req, res) => {
  res.status(200).json({ 
    message: `Delete account ${req.params.idCompte} for user ${req.params.idUtilisateur}` 
  });
});

// Compte mouvements routes
router.get('/:idCompte/mouvements', (req, res) => {
  res.status(200).json({ 
    message: `Get all movements for account ${req.params.idCompte}` 
  });
});

router.post('/:idCompte/mouvements', (req, res) => {
  res.status(201).json({ 
    message: `Create new movement for account ${req.params.idCompte}` 
  });
});

router.get('/:idCompte/mouvements/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Get movement ${req.params.idMouvement} for account ${req.params.idCompte}` 
  });
});

router.put('/:idCompte/mouvements/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Update movement ${req.params.idMouvement} for account ${req.params.idCompte}` 
  });
});

router.patch('/:idCompte/mouvements/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Partially update movement ${req.params.idMouvement} for account ${req.params.idCompte}` 
  });
});

router.delete('/:idCompte/mouvements/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Delete movement ${req.params.idMouvement} for account ${req.params.idCompte}` 
  });
});

module.exports = router;