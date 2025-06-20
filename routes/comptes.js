const express = require('express');
const router = express.Router();
const { 
  getAllAccounts,
  addAccount,
  getAccountById,
  updateAccount,
  patchAccount,
  deleteAccount,
  getMouvementsByUserAndCompte,
  createMouvement

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

// GET /utilisateurs/:idUtilisateur/comptes/:idCompte/mouvements - Liste des mouvements d'un compte pour un utilisateur
router.get('/:idCompte/mouvements', async (req, res) => {
  try {
  const idCompte = req.params.idCompte;
  

    if ( isNaN(idCompte)) {
      return res.status(400).json({ message: 'Invalid compte ID' });
    }

    const mouvements = await getMouvementsByUserAndCompte( idCompte);
    res.status(200).json(mouvements);
  } catch (error) {
    console.error('Error fetching mouvements:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /utilisateurs/:idUtilisateur/comptes/:idCompte/mouvements - Créer un mouvement pour un compte d'un utilisateur
router.post('/:idCompte/mouvements', async (req, res) => {
  try {


    const {montant, typeMouvement, dateMouvement, idTiers, idCategorie, idSousCategorie, idVirement,idCompte} = req.body;
    if (montant <= 0) {
      return res.status(400).json({
        message: 'Validation error',
        details: 'montant must be positive'
      });
    }
    if (dateMouvement && new Date(dateMouvement) < new Date()) {
      return res.status(400).json({
        message: 'Validation error',
        details: 'dateMouvement can\'t be in the past'
      });
    }
    // Validation simple
    const errors = [];
    if (!typeMouvement) errors.push('typeMouvement is required');
    if (montant === undefined || montant === null || isNaN(montant)) errors.push('montant is required and must be a number');
    if (!dateMouvement) errors.push('dateMouvement is required');
    if (!idTiers) errors.push('idTiers is required');
    if (!idCategorie) errors.push('idCategorie is required');
    if (!idSousCategorie) errors.push('idSousCategorie is required');
    if (idVirement && isNaN(idVirement)) errors.push('idVirement must be a number if provided');
    if (!idCompte) errors.push('idCompte is required');

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation error', details: errors });
    }

    const mouvementData = {
      typeMouvement,
      montant,
      dateMouvement,
      idCompte,
      idTiers,
      idCategorie,
      idSousCategorie,
      idVirement
          };

    const newMouvement = await createMouvement(mouvementData);
    res.status(201).json({
      message: 'Mouvement created successfully',
      data: newMouvement
    });
  } catch (error) {
    console.error('Error creating mouvement:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
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