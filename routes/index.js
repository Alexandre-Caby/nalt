const express = require('express');
const router = express.Router();

// Import routers
const authRouter = require('./auth');
const usersRouter = require('./users');
const categoriesRouter = require('./categories');
const vuesRouter = require('./vues');

// Mount sub-routers
router.use('/authenticate', authRouter);
router.use('/utilisateurs', usersRouter);
router.use('/categories', categoriesRouter);
router.use('/v_categories', vuesRouter.categories);
router.use('/v_mouvements', vuesRouter.mouvements);

// Home route
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the API' });
});

module.exports = router;