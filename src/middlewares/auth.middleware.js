const jwt = require('jsonwebtoken');

module.exports = {
  authenticate: (req, res, next) => {
    console.log('Authenticate called');

    // Проверяем наличие заголовка авторизации
    if (!req.headers.authorization) {
      console.log('No authorization header provided');
      return res
        .status(401)
        .json({ error: 'Access denied. No token provided.' });
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      console.log('No token provided');
      return res
        .status(401)
        .json({ error: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('Authentication successful:', req.user);
      next();
    } catch (err) {
      console.log('Invalid token');
      res.status(401).json({ error: 'Invalid token.' });
    }
  },
  authorizeRole: (role) => (req, res, next) => {
    console.log('AuthorizeRole called with role:', role);

    try {
      const user = req.user;
      if (!user || user.role !== role) {
        console.log('Access denied for role:', role);
        return res
          .status(403)
          .json({ error: 'Access denied. Insufficient permissions.' });
      }
      console.log('Authorization successful for role:', role);
      next();
    } catch (err) {
      next(err);
    }
  },
};
