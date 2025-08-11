const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(401).send('Unauthorized');

});
router.get('/api', (req, res) => {
  res.status(401).send('Unauthorized');

});

module.exports = router;