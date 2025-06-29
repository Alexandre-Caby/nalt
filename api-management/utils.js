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
  // Define the secretPath variable first
  const secretPath = path.join(__dirname, '../secret.key');
  
  try {
    // Check if we already have a secret key file
    if (fs.existsSync(secretPath)) {
      return fs.readFileSync(secretPath, 'utf8');
    }
    
    // Generate from package.json if possible
    const packagePath = path.join(__dirname, 'package.json');
    // console.log(`Using package.json at: ${packagePath}`);
    
    if (fs.existsSync(packagePath)) {
      const packageJson = fs.readFileSync(packagePath, 'utf8');
      const hash = crypto.createHash('sha256').update(packageJson).digest('hex');
      
      // Create the secret file for future use
      try {
        fs.writeFileSync(secretPath, hash);
      } catch (writeError) {
        console.warn('Could not write secret key file:', writeError.message);
        // Continue execution even if we can't write the file
      }
      
      return hash;
    }
    
    // If we get here, use the fallback
    const fallbackSecret = 'a1d5f121ds54ger512dsc56zf4g5h6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3';
    console.warn('Warning: Using fallback JWT secret key. This is less secure.');
    return fallbackSecret;
    
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
  const token = jwt.sign(
    { 
      userId: user.idUtilisateur,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    },
    JWT_SECRET
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
    
    // Set the userId on the request object
    req.userId = decoded.userId;
    
    if (!req.userId) {
      return res.status(401).json({ 
        message: 'Invalid token format', 
        details: 'Token does not contain user ID'
      });
    }
    
    next();
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