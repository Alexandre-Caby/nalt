const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Creates a deterministic secret key that remains consistent between server restarts
 * @returns {string} Secret key for JWT signing
 */
function getSecretKey() {
  try {
    // Based on the package.json file to create a unique secret
    const packagePath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = fs.readFileSync(packagePath, 'utf8');
      const hash = crypto.createHash('sha256').update(packageJson).digest('hex');
      
      // Create the secret file for future use
      fs.writeFileSync(secretPath, hash);
      
      return hash;
    }
    
    return 'a1d5f121ds54ger512dsc56zf4g5h6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3'; // Fallback secret
  } catch (error) {
    console.warn('Warning: Using fallback JWT secret key. This is less secure.', error);
    return 'a1d5f121ds54ger512dsc56zf4g5h6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3'; // Fallback secret
  }
}

// Use a deterministic secret key that remains consistent
const JWT_SECRET = getSecretKey();

/**
 * Generates authentication token for a user
 * @param {Object} user - User object with id and other properties
 * @returns {string} JWT token valid for 24 hours
 */
const generateTokens = (user) => {
  // Add timestamp information
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + (24 * 60 * 60); // 24 hours in seconds
  
  const token = jwt.sign(
    { 
      userId: user.id,
      iat: now,
      exp: expiresAt
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return token;
};

/**
 * Middleware to authenticate token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    return res.status(403).json({ 
      message: 'Invalid or expired token',
      error: error.message 
    });
  }
};

/**
 * Verify password against hashed version
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if password matches
 */
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Hash a password for storage
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

module.exports = {
  generateTokens,
  authenticateToken,
  verifyPassword,
  hashPassword,
  JWT_SECRET,
};