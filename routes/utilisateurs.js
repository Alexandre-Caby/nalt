const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/utilisateurs.js');

// GET /api/utilisateurs - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/utilisateurs - Create a new user
router.post('/', async (req, res) => {
  try {
    const { login, motDePasse, nomUtilisateur, prenomUtilisateur, ville, codePostal } = req.body;

    // Simple validation
    const errors = [];
    if (!motDePasse) errors.push('Password is required');
    if (motDePasse && motDePasse.length < 6) errors.push('Password must be at least 6 characters');
    if (!nomUtilisateur) errors.push('Last name is required');
    if (!prenomUtilisateur) errors.push('First name is required');
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: errors
      });
    }
    
    const newUser = await createUser({
      login, 
      motDePasse, 
      nomUtilisateur, 
      prenomUtilisateur, 
      ville, 
      codePostal
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/utilisateurs/:idUtilisateur - Get user by ID
router.get('/:idUtilisateur', async (req, res) => {
  try {
    // Validate ID parameter
    const idUtilisateur = parseInt(req.params.idUtilisateur);
    if (isNaN(idUtilisateur)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await getUserById(idUtilisateur);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/utilisateurs/:idUtilisateur - Update user (current user)
router.put('/:idUtilisateur', async (req, res) => {
  try {
    const { nomUtilisateur, prenomUtilisateur, motDePasse, ville, codePostal } = req.body;
    
    // Simple validation
    const errors = [];
    if (motDePasse && motDePasse.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    // Ensure at least one field is provided
    if (!nomUtilisateur && !prenomUtilisateur && !motDePasse && 
        ville === undefined && codePostal === undefined) {
      errors.push('At least one field must be provided for update');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: errors
      });
    }
    
    // Always use the current user's ID from the token
    const updatedUser = await updateUser(req.userId, {
      nomUtilisateur, 
      prenomUtilisateur, 
      motDePasse, 
      ville, 
      codePostal
    });
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/utilisateurs/:idUtilisateur - Partially update user (current user)
router.patch('/:idUtilisateur', async (req, res) => {
  try {
    const { nomUtilisateur, prenomUtilisateur, motDePasse, ville, codePostal } = req.body;
    
    // Simple validation
    const errors = [];
    if (motDePasse && motDePasse.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: errors
      });
    }
    
    // Always use the current user's ID from the token
    const updatedUser = await updateUser(req.userId, {
      nomUtilisateur, 
      prenomUtilisateur, 
      motDePasse, 
      ville, 
      codePostal
    });
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/utilisateurs/:idUtilisateur - Delete user (current user)
router.delete('/:idUtilisateur', async (req, res) => {
  try {
    // Always use the current user's ID from the token
    const result = await deleteUser(req.userId);
    res.status(204).json(result);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
