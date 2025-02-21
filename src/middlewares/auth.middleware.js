const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = {
  authenticate: async (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Authenticate middleware triggered');
    }

    // Проверяем токен в cookies или в заголовке Authorization
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      console.log('No token provided');
      req.flash('error', 'Access denied. Please log in.');
      return res.redirect('/');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
        console.log('Token has expired or is missing expiration');
        req.flash('error', 'Session expired. Please log in again.');
        return res.redirect('/');
      }

      // Загружаем пользователя из базы
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('User not found in database');
        req.flash('error', 'User not found. Please log in again.');
        return res.redirect('/');
      }

      req.user = user; // Теперь req.user содержит все данные пользователя
      console.log('Authentication successful:', req.user);
      next();
    } catch (err) {
      console.log('Invalid token:', err.message);
      req.flash('error', 'Invalid session. Please log in again.');
      return res.redirect('/');
    }
  },

  authorizeRole: (role) => (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Authorization check for role: ${role}`);
    }

    const user = req.user;
    if (!user || user.role !== role) {
      console.log('Access denied for role:', role);
      req.flash('error', 'Access denied. Insufficient permissions.');
      return res.redirect('/');
    }

    console.log('Authorization successful for role:', role);
    next();
  },

  authorizeRole: (role) => (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Authorization check for role: ${role}`);
    }

    const user = req.user;
    if (!user || user.role !== role) {
      console.log('Access denied for role:', role);
      req.flash('error', 'Access denied. Insufficient permissions.');
      return res.redirect('/');
    }

    console.log('Authorization successful for role:', role);
    next();
  },
};
