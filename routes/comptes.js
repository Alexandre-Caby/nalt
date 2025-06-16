const express = require('express');
const router = express.Router();

// GET /api/comptes - Get all accounts for authenticated user
router.get('/', (req, res) => {
  res.status(200).json({ message: `Get all accounts for user ${req.userId}` });
});

// POST /api/comptes - Create a new account for authenticated user
router.post('/', (req, res) => {
  res.status(201).json({ message: `Create new account for user ${req.userId}` });
});

// GET /api/comptes/:idCompte - Get account by ID
router.get('/:idCompte', (req, res) => {
  res.status(200).json({ 
    message: `Get account ${req.params.idCompte} for user ${req.userId}` 
  });
});

// PUT /api/comptes/:idCompte - Update account by ID
router.put('/:idCompte', (req, res) => {
  res.status(200).json({ 
    message: `Update account ${req.params.idCompte} for user ${req.userId}` 
  });
});

// PATCH /api/comptes/:idCompte - Partially update account
router.patch('/:idCompte', (req, res) => {
  res.status(200).json({ 
    message: `Partially update account ${req.params.idCompte} for user ${req.userId}` 
  });
});

// DELETE /api/comptes/:idCompte - Delete account
router.delete('/:idCompte', (req, res) => {
  res.status(200).json({ 
    message: `Delete account ${req.params.idCompte} for user ${req.userId}` 
  });
});

// Compte mouvements routes
router.get('/:idCompte/mouvements', (req, res) => {
  res.status(200).json({ 
    message: `Get all movements for account ${req.params.idCompte} of user ${req.userId}` 
  });
});

router.post('/:idCompte/mouvements', (req, res) => {
  res.status(201).json({ 
    message: `Create new movement for account ${req.params.idCompte} of user ${req.userId}` 
  });
});

router.get('/:idCompte/mouvements/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Get movement ${req.params.idMouvement} for account ${req.params.idCompte} of user ${req.userId}` 
  });
});

router.put('/:idCompte/mouvements/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Update movement ${req.params.idMouvement} for account ${req.params.idCompte} of user ${req.userId}` 
  });
});

router.patch('/:idCompte/mouvements/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Partially update movement ${req.params.idMouvement} for account ${req.params.idCompte} of user ${req.userId}` 
  });
});

router.delete('/:idCompte/mouvements/:idMouvement', (req, res) => {
  res.status(200).json({ 
    message: `Delete movement ${req.params.idMouvement} for account ${req.params.idCompte} of user ${req.userId}` 
  });
});

module.exports = router;