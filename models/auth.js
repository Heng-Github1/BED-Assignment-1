const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
require('dotenv').config(); // Load environment variables from a .env file

/**
 * Middleware function to verify JWT tokens in incoming requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyJWT = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
  // If no token is found, respond with an unauthorized status
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token using the secret key from environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // If the token verification fails, respond with a forbidden status
      return res.status(403).json({ message: "Forbidden" });
    }
    // If verification is successful, attach the decoded token to the request object
    req.user = decoded; 
    // Proceed to the next middleware function
    next();
  });
};

module.exports = verifyJWT; // Export the verifyJWT middleware function
