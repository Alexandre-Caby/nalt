const express = require('express');
const router = express.Router();
const { getTiersByUser, createTiersByUser, getTiersById, updateTiers, deleteTiers } = require('../controllers/tiers.js'); // Import the function to find user by login

// GET /api/tiers - Get all tiers for authenticated user
router.get('/', async (req, res) => {
  try {
    const tiers = await getTiersByUser(req.userId);
    res.status(200).json(tiers);
  } catch (error) {
    console.error('Error getting tiers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/tiers - Create a new tiers for authenticated user
router.post('/', async(req, res) => {
  try {
    const { nomTiers } = req.body;

    // Simple validation
    if (!nomTiers) {
      return res.status(400).json({
        message: 'Validation error',
        details: 'Tiers name is required'
      });
    }

    const idUtilisateur = req.userId;

    const newTiers = await createTiersByUser({
      nomTiers,
      idUtilisateur
    });

    res.status(201).json(newTiers);
  } catch (error) {
    console.error('Error creating tiers:', error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/tiers/:idTiers - Get tiers by ID
router.get('/:idTiers', async(req, res) => {
  try {
    const idTiers = parseInt(req.params.idTiers);
    if (isNaN(idTiers)) {
      return res.status(400).json({ message: 'Invalid tiers ID' });
    }

    const tiers = await getTiersById(idTiers);
    res.status(200).json(tiers);
  } catch (error) {
    console.error('Error getting tiers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/tiers/:idTiers - Update tiers
router.put('/:idTiers', async(req, res) => {
  try {
    const idTiers = parseInt(req.params.idTiers);
    if (isNaN(idTiers)) {
      return res.status(400).json({ message: 'Invalid tiers ID' });
    }

    const { nomTiers } = req.body;

    // Simple validation
    if (!nomTiers) {
      return res.status(400).json({
        message: 'Validation error',
        details: 'Tiers name is required'
      });
    }

    const updatedTiers = await updateTiers(idTiers, { nomTiers });
    res.status(200).json({
      message: 'Tiers updated successfully',
      data: updatedTiers
    });
  } catch (error) {
    console.error('Error updating tiers:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/tiers/:idTiers - Delete third party
router.delete('/:idTiers', async(req, res) => {
  try {
    const idTiers = parseInt(req.params.idTiers);
    if (isNaN(idTiers)) {
      return res.status(400).json({ message: 'Invalid tiers ID' });
    }

    const result = await deleteTiers(idTiers);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting tiers:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;