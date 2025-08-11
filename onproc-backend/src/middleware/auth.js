// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get the token from "Bearer <token>"

  if (token == null) return res.sendStatus(401); // If no token, return 401 (Unauthorized)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid, return 403 (Forbidden)
    req.user = user; // Attach user info to the request
    next();
  });
};

module.exports = { authenticateToken };
