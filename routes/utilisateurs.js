const express = require('express');
const router = express.Router();

// GET /api/utilisateurs - Get all users
router.get('/', validate(schemas.user), (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  res.status(200).json({ message: 'Get all users' });
});

// POST /api/utilisateurs - Create a new user
router.post('/', (req, res) => {
  res.status(201).json({ message: 'User created successfully' });
});

// GET /api/utilisateurs/:idUtilisateur - Get user by ID
router.get('/:idUtilisateur', (req, res) => {
  res.status(200).json({ message: `Get user with ID ${req.params.idUtilisateur}` });
});

// PUT /api/utilisateurs/:idUtilisateur - Update user by ID
router.put('/:idUtilisateur', (req, res) => {
  res.status(200).json({ message: `Update user with ID ${req.params.idUtilisateur}` });
});

// PATCH /api/utilisateurs/:idUtilisateur - Partially update user by ID
router.patch('/:idUtilisateur', (req, res) => {
  res.status(200).json({ message: `Partially update user with ID ${req.params.idUtilisateur}` });
});

// DELETE /api/utilisateurs/:idUtilisateur - Delete user by ID
router.delete('/:idUtilisateur', (req, res) => {
  res.status(200).json({ message: `Delete user with ID ${req.params.idUtilisateur}` });
});

module.exports = router;
