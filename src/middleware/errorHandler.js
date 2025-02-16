const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  };

const tokenBlacklist = new Set();

  // Middleware to check blacklisted tokens
const checkBlacklist = (req, res, next) => {
  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ message: 'Token is invalid' });
    }
    next();
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
  };

  module.exports = { errorHandler, checkBlacklist };