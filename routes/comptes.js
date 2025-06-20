const express = require('express');
const router = express.Router();
const { 
  getAllAccounts,
  addAccount,
  getAccountById,
  updateAccount,
  patchAccount,
  deleteAccount

} = require('../controllers/comptes.js');

// GET /api/comptes - Get all accounts for authenticated user
router.get('/', async (req, res) => {
  const userId = req.userId; // récupération de l'ID utilisateur connecté
  try{
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const comptes = await getAllAccounts(userId);
    res.status(200).json(comptes);
  }
  catch (error) {
    console.error('Error getting accounts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/comptes - Create a new account for authenticated user
router.post('/', async (req, res) => {
  const userId = req.userId; // récupération de l'ID utilisateur connecté
  try
  {
    if( !userId)
      return res.status(401).json({ message: 'Unauthorized' });
    const { descriptionCompte, nomBanque, soldeInitial} = req.body;
    if(!descriptionCompte)
      return res.status(400).json({ message: 'DescriptionCompte is required' });
    if(!nomBanque)
      return res.status(400).json({ message: 'NomBanque is required' });
    if(soldeInitial === undefined || soldeInitial === null)
      return res.status(400).json({ message: 'SoldeInitial is required' });
  
    const newCompte = await addAccount({
      descriptionCompte, 
      nomBanque, 
      IdUtilisateur: userId, 
      soldeInitial
    });
    res.status(201).json(newCompte);
  } catch (error) {
    console.error('Error creating account:', error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/comptes/:idCompte - Get account by ID
router.get('/:idCompte', async (req, res) => {
  const userId = req.userId; // récupération de l'ID utilisateur connecté
  const idCompte = req.params.idCompte; // récupération de l'ID du compte depuis les paramètres de la requête
  try{
    if(!userId)
      return res.status(401).json({ message: 'Unauthorized' });
  
  const compte = await getAccountById(userId, idCompte);
  if (!compte) {
    return res.status(404).json({ message: 'Compte non trouvé' });
  }
  res.status(200).json(compte);

  } catch (error) {
    console.error('Error getting account:', error);
    if (error.message.includes('Compte non trouvé')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }    
});


// PUT /api/comptes/:idCompte - Update account by ID
router.put('/:idCompte', async (req, res) => {
  userId = req.userId; // récupération de l'ID utilisateur connecté
  const idCompte = req.params.idCompte; // récupération de l'ID du compte depuis les paramètres de la requête
  try
  {
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { descriptionCompte, nomBanque, soldeInitial } = req.body;
    if (!descriptionCompte) {
      return res.status(400).json({ message: 'DescriptionCompte is required' });
    }
    if (!nomBanque) {
      return res.status(400).json({ message: 'NomBanque is required' });
    }
    if (soldeInitial === undefined || soldeInitial === null) {
      return res.status(400).json({ message: 'SoldeInitial is required' });
    }

    const updatedCompte = await updateAccount(idCompte, {
      descriptionCompte,
      nomBanque,
      IdUtilisateur: userId,
      soldeInitial
    });

    res.status(200).json(updatedCompte);
  } catch (error) {
    console.error('Error updating account:', error);
    if (error.message.includes('Compte non trouvé')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/comptes/:idCompte - Partially update account
router.patch('/:idCompte', (req, res) => {
  const userId = req.userId; // récupération de l'ID utilisateur connecté
  const idCompte = req.params.idCompte; // récupération de l'ID du compte depuis les paramètres de la requête
  try
  {
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { descriptionCompte, nomBanque, soldeInitial } = req.body;
    if (!descriptionCompte && !nomBanque && soldeInitial === undefined) {
      return res.status(400).json({ message: 'au minimum, l\'un des trois champs doit être definit : descriptionCompte, nomBanque, soldeInitial ' });
    }

    const updatedCompte = patchAccount(idCompte, {
      descriptionCompte,
      nomBanque,
      IdUtilisateur: userId,
      soldeInitial
    });

    res.status(200).json(updatedCompte);
  }
  catch (error) {
    console.error('Error partially updating account:', error);
    if (error.message.includes('Compte non trouvé')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/comptes/:idCompte - Delete account
router.delete('/:idCompte', (req, res) => {
  const userId = req.userId; // récupération de l'ID utilisateur connecté
  const idCompte = req.params.idCompte; // récupération de l'ID du compte depuis les paramètres de la requête
  try
  {
    if(!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const CompteSuprime = deleteAccount(idCompte, userId);
    if (!CompteSuprime) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    res.status(200).json({ CompteSuprime});
  } catch (error) {
    console.error('Error deleting account:', error);
    if (error.message.includes('Compte non trouvé')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }

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