// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.RANDOM_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token non valide' });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
