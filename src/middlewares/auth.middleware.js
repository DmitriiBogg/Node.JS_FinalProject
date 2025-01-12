const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Проверка токена
exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Проверка роли
exports.authorizeRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || user.role !== role) {
        return res
          .status(403)
          .json({ error: 'Access denied. Insufficient permissions.' });
      }
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};
