const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // The token is expected to be in the format "Bearer <token>"
  const tokenString = token.split(' ')[1];

  if (!tokenString) {
    return res.status(401).json({ error: 'Token format is invalid, expected "Bearer <token>"' });
  }

  try {
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ error: 'Token is not valid' });
  }
}

function admin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
}

module.exports = { auth, admin };
