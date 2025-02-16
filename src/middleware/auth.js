const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

/**
 * Middleware to authenticate users using JWT.
 * - Extracts the token from the `Authorization` header.
 * - Verifies the token using the secret key.
 * - Attaches the decoded user information (e.g., userId, role) to the request object.
 */
const auth = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // If no token is provided, deny access
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If the token is invalid, deny access
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = auth;