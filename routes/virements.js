const express = require('express');
const router = express.Router();
const { getVirementsByUser, createVirementByUser, getVirementById, patchVirement, deleteVirement } = require('../controllers/virements.js'); // Import the function to find user by login

// GET /api/virements - Get all virements for authenticated user
router.get('/', async (req, res) => {
  try {
    const virements = await getVirementsByUser(req.userId);
    res.status(200).json(virements);
  } catch (error) {
    console.error('Error getting virements:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/virements - Create a new virement for authenticated user
router.post('/', async(req, res) => {
  try {
    const { idCompteDebit,
              idCompteCredit,
              montant,
              dateVirement,
              idCategorie
          } = req.body;

    // Simple validation
    if (!idCompteDebit || !idCompteCredit || !montant || !idCategorie) {
      return res.status(400).json({
        message: 'Validation error',
        details: 'idCompteDebit, idCompteCredit, montant and idCategorie are required'
      });
    }
    if (montant <= 0) {
      return res.status(400).json({
        message: 'Validation error',
        details: 'montant must be positive'
      });
    }
    const date = new Date(); // maintenant
    date.setHours(0, 0, 0, 0); // aujourd'hui à 00:00:00

    if (dateVirement && new Date(dateVirement) < date) {
      return res.status(400).json({
        message: 'Validation error',
        details: 'dateVirement can\'t be in the past'
      });
    }

    const newVirement = await createVirementByUser(req.body);

    res.status(201).json(newVirement);
  } catch (error) {
    console.error('Error creating virement :', error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/virements/:idVirement - Get virement by ID
router.get('/:idVirement', async(req, res) => {
  try {
    const idVirement = parseInt(req.params.idVirement);
    if (isNaN(idVirement)) {
      return res.status(400).json({ message: 'Invalid virement ID' });
    }

    const virement = await getVirementById(idVirement);
    if (!virement) {
      return res.status(404).json({ message: 'Virement not found' });
    }
    res.status(200).json(virement);
  } catch (error) {
    console.error('Error getting virement:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/virements/:idVirement - Update virement
router.patch('/:idVirement', async(req, res) => {
  try {
    const idVirement = parseInt(req.params.idVirement);
    if (isNaN(idVirement)) {
      return res.status(400).json({ message: 'Invalid virement ID' });
    }

    const { dateVirement, idCategorie } = req.body;

    // Simple validation
    if (!dateVirement && !idCategorie) {
      return res.status(400).json({
        message: 'Validation error',
        details: 'dateVirement or idCategorie is required'
      });
    }

    const date = new Date(); // maintenant
    date.setHours(0, 0, 0, 0); // aujourd'hui à 00:00:00

    if (dateVirement && new Date(dateVirement) < date) {
      return res.status(400).json({
        message: 'Validation error',
        details: 'dateVirement can\'t be in the past'
      });
    }

    const updatedVirement = await patchVirement(idVirement, { dateVirement, idCategorie });
    res.status(200).json(updatedVirement);
  } catch (error) {
    console.error('Error updating virement:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/virements/:idVirement - Delete third party
router.delete('/:idVirement', async(req, res) => {
  try {
    const idVirement = parseInt(req.params.idVirement);
    if (isNaN(idVirement)) {
      return res.status(400).json({ message: 'Invalid virement ID' });
    }

    const result = await deleteVirement(idVirement);
    res.status(204).json(result);
  } catch (error) {
    console.error('Error deleting virement:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;