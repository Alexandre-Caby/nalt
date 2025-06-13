const express = require('express');
const router = express.Router();
const { generateTokens, verifyPassword, authenticateToken } = require('../utils.js');
const bcrypt = require('bcrypt');

/**
 * POST /api/authenticate - User login endpoint
 * @route POST /api/authenticate
 * @group Authentication - Operations for user authentication
 * @param {string} name.body.required - User's name or username
 * @param {string} password.body.required - User's password
 * @returns {object} 200 - Authentication successful with token and user info
 * @returns {object} 401 - Authentication failed
 * @returns {object} 500 - Server error
 */
router.post('/', async (req, res) => {
  try {
    const { name, password } = req.body;
    
    // Validate request
    if (!name || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: 'Both name and password are required'
      });
    }
    
    // Find the user by name
    const user = await findUserByName(name);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Authentication failed',
        details: 'User not found' 
      });
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
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
        name: user.name,
        ville: user.ville,
        postalCode: user.postalCode,
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

/**
 * Find user by name in the database
 * @param {string} name - User's name to search for
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findUserByName(name) {
  // TODO: Replace with actual database query
  // This is just a mock example for testing
  if (name === 'test') {
    return {
      id: 1,
      name: 'test',
      password: await bcrypt.hash('password', 10)
    };
  }
  return null;
}

module.exports = router;