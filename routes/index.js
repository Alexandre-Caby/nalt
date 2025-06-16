const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');

// Load Swagger documentation from absolute path
const swaggerSpec = YAML.load(path.join(__dirname, '../api-documentation.yaml'));

// Enable CORS for all routes
router.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept']
}));

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
  res.json({ 
    message: 'Welcome to the Banking API',
    version: '1.0.0',
    documentation: '/api/api-docs'
  });
});

// Swagger documentation route
router.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Banking API Documentation"
  })
);

module.exports = router;