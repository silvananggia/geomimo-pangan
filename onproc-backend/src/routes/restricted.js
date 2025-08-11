// backend/routes/restricted.js
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/role');

router.get('/dashboard', authorizeRole(['user', 'admin']), (req, res) => {
  res.send('Welcome to the dashboard!');
});

router.get('/admin', authorizeRole(['admin']), (req, res) => {
  res.send('Welcome to the admin panel!');
});

module.exports = router;
