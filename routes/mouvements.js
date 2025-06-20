const express = require('express');
const router = express.Router();
const { getMouvementsByUser, createMouvement, getMouvementById, patchMouvement, deleteMouvement } = require('../controllers/mouvements.js'); // Import controller function
// GET /api/mouvements/:idMouvement - Get movement by ID for the authenticated user
router.get('/', async(req, res) => {
  try {
    const mouvements = await getMouvementsByUser(req.userId);
    res.status(200).json(mouvements);
  } catch (error) {
    console.error('Error getting mouvement:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/mouvements - Create a new movement for the authenticated user
router.post('/', async (req, res) => {
  try {
    const { typeMouvement, montant, dateMouvement, idCompte, idTiers, idCategorie, idSousCategorie,idVirement } = req.body;
    if (montant <= 0) {
      return res.status(400).json({
        message: 'Validation error',
        details: 'montant must be positive'
      });
    }

    const date = new Date(); // maintenant
    date.setHours(0, 0, 0, 0); // aujourd'hui à 00:00:00

    if (dateMouvement && new Date(dateMouvement) < date) {
      return res.status(400).json({
        message: 'Validation error',
        details: 'dateMouvement can\'t be in the past'
      });
    }
    // Validation complète
    const errors = [];
    if (!typeMouvement) errors.push('typeMouvement is required');
    if (montant === undefined || montant === null || isNaN(montant)) errors.push('montant is required and must be a number');
    if (!dateMouvement) errors.push('dateMouvement is required');
    if (!idCompte) errors.push('idCompte is required');
    if (!idTiers) errors.push('idTiers is required');
    if (!idCategorie) errors.push('idCategorie is required');
    if(!idVirement) errors.push('idVirement is required');

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation error',
        details: errors
      });
    }

    const mouvementData = {
      montant,
      typeMouvement,
      dateMouvement,
      idCompte,
      idTiers,
      idCategorie,
      idSousCategorie,
      idVirement,
    };

    const newMouvement = await createMouvement(mouvementData);
    res.status(201).json(newMouvement);
  } catch (error) {
    console.error('Error creating mouvement:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/mouvements/:idMouvement - Get movement by ID for the authenticated user
router.get('/:idMouvement', async (req, res) => {
  try {
    const mouvement = await getMouvementById(req.params.idMouvement);
    if (!mouvement) {
      return res.status(404).json({ error: 'Mouvement not found' });
    }
    res.status(200).json(mouvement);
  } catch (error) {
    console.error('Error getting mouvement:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH /api/mouvements/:idMouvement - Partially update movement
router.patch('/:idMouvement', async (req, res) => {
  try {
    const idMouvement = parseInt(req.params.idMouvement);
    if (isNaN(idMouvement)) {
      return res.status(400).json({ message: 'Invalid Mouvement ID' });
    }

    const {  dateMouvement, idCategorie, idSousCategorie } = req.body;

    const date = new Date(); // maintenant
    date.setHours(0, 0, 0, 0); // aujourd'hui à 00:00:00

    if (dateMouvement && new Date(dateMouvement) < date)  {
      return res.status(400).json({
        message: 'Validation error',
        details: 'dateMouvement can\'t be in the past'
      });
    }

    // Ici, on ne valide que si les champs sont présents (partiel)
    const mouvementData = {};
    if (dateMouvement !== undefined) mouvementData.dateMouvement = dateMouvement;
    if (idCategorie !== undefined) mouvementData.idCategorie = idCategorie;
    if (idSousCategorie !== undefined) mouvementData.idSousCategorie = idSousCategorie;

    if (Object.keys(mouvementData).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updatedMouvement = await patchMouvement(idMouvement, mouvementData);
    res.status(200).json(updatedMouvement);
  } catch (error) {
    console.error('Error updating Mouvement:', error);
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/mouvements/:idMouvement - Delete movement
router.delete('/:idMouvement', async(req, res) => {
    try {
    // Always use the current user's ID from the token
    const result = await deleteMouvement(req.params.idMouvement);
    res.status(204).json(result);
  } catch (error) {
    console.error('Error deleting mouvement:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;