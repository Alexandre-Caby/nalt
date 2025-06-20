const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');
const { authenticateToken } = require('../api-management/utils.js');

// Load Swagger documentation from absolute path
const swaggerSpec = YAML.load(path.join(__dirname, '../api-management/api-documentation.yaml'));

// Enable CORS
router.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept']
}));

// Import routers
const authRouter = require('./auth');
const usersRouter = require('./utilisateurs.js');
const categoriesRouter = require('./categories');
const comptesRouter = require('./comptes');
const tiersRouter = require('./tiers');
const mouvementsRouter = require('./mouvements');
const virementsRouter = require('./virements');

// Public routes (no authentication required)
router.use('/authenticate', authRouter);

// Protected routes (authentication required)
// Users routes
router.use('/utilisateurs', authenticateToken, usersRouter);

// Simplified routes without user ID in URL
router.use('/comptes', authenticateToken, comptesRouter);
router.use('/tiers', authenticateToken, tiersRouter);
router.use('/mouvements', authenticateToken, mouvementsRouter);
router.use('/virements', authenticateToken, virementsRouter);
router.use('/categories', authenticateToken, categoriesRouter);

// Home route
router.get('/', function(req, res) {
  res.json({ 
    message: 'Welcome to the Banking API',
    version: '1.0.0',
    documentation: '/api/api-docs'
  });
});

// API docs
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: "Banking API Documentation"
}));

module.exports = router;