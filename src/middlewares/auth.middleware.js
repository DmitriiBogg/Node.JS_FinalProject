const jwt = require('jsonwebtoken');

module.exports = {
  authenticate: (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Authenticate middleware triggered');
    }

    if (!req.headers.authorization) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('No authorization header provided');
      }
      return res.status(401).json({ error: 'Access denied.' });
    }

    const parts = req.headers.authorization.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Invalid authorization header format');
      }
      return res.status(401).json({ error: 'Access denied.' });
    }

    const token = parts[1];
    if (!token) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('No token provided');
      }
      return res.status(401).json({ error: 'Access denied.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Token has expired or is missing expiration');
        }
        return res.status(401).json({ error: 'Access denied.' });
      }

      req.user = decoded;
      if (process.env.NODE_ENV !== 'production') {
        console.log('Authentication successful:', req.user);
      }
      next();
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Invalid token:', err.message);
      }
      res.status(401).json({ error: 'Access denied.' });
    }
  },

  authorizeRole: (role) => (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Authorization check for role: ${role}`);
    }

    const user = req.user;
    if (!user || user.role !== role) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Access denied for role:', role);
      }
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('Authorization successful for role:', role);
    }
    next();
  },
};
