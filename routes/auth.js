const express = require('express');
const router = express.Router();
const { generateTokens, verifyPassword, authenticateToken } = require('../api-management/utils.js');
const bcrypt = require('bcrypt');
const { findUserByLogin } = require('../controllers/utilisateurs.js'); // Import the function to find user by login

/**
 * POST /api/authenticate - User login endpoint
 * @route POST /api/authenticate
 * @group Authentication - Operations for user authentication
 * @param {string} login.body.required - User's login or userlogin
 * @param {string} password.body.required - User's password
 * @returns {object} 200 - Authentication successful with token and user info
 * @returns {object} 401 - Authentication failed
 * @returns {object} 500 - Server error
 */
router.post('/', async (req, res) => {
  try {
    const { login, password } = req.body;
    
    // Validate request
    if (!login || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: 'Both login and password are required'
      });
    }
    
    // Find the user by login
    // console.log('Searching for user:', login);
    const user = await findUserByLogin(login);
    // console.log('User in db:', user);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Authentication failed',
        details: 'User not found' 
      });
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.motDePasse);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Authentication failed',
        details: 'Invalid password' 
      });
    }
    
    // Generate token
    const token = generateTokens(user);
    
    // Return token and user data to client
    res.status(200).json({ 
      message: 'Authentication successful',
      token,
      expiresIn: 86400, // 24 hours in seconds
      user: {
        id: user.id,
        login: user.login,
        ville: user.ville,
        postalCode: user.codePostal,
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      message: 'Server error during authentication',
      error: error.message 
    });
  }
});

/**
 * GET /api/authenticate/verify - Verify if a token is valid
 * @route GET /api/authenticate/verify
 * @returns {object} 200 - Token is valid with user ID
 * @returns {object} 401/403 - Token is invalid or expired
 */
router.get('/verify', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Token is valid',
    userId: req.userId
  });
});

module.exports = router;