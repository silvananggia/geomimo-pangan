// backend/middleware/role.js
const { authenticateToken } = require('./auth');

const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    // Call the authentication middleware
    authenticateToken(req, res, () => {
      // Check if user has the required role
      if (allowedRoles.includes(req.user.role)) {
        return next();
      }
      res.sendStatus(403); // Forbidden
    });
  };
};

module.exports = { authorizeRole };
