// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const axios = require('axios');
const { body, validationResult } = require('express-validator');

dotenv.config();

const router = express.Router();




// Login handler
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Step 1: Get OAuth access token
    const tokenResponse = await axios.post(process.env.OAUTH_ACCESS_TOKEN_URL, {
      grant_type: 'password',
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      username,
      password,
      scope: '',
    });

    const accessToken = tokenResponse.data.access_token;

    // Step 2: Get user information
    const userResponse = await axios.get(`${process.env.API_AUTH}/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;
    console.log(userData);
    
    // Step 3: Get user roles with error handling
    let roleName = 'public';
    try {
      const rolesResponse = await axios.get(`${process.env.API_INTRA}/user/role`, {
        params: {
          usernameintra: userData.userData.username,
          modul_id: 152,
        },
      });

      const roleData = rolesResponse.data;
      console.log(roleData);
      if (roleData?.data?.role?.length > 0) {
        roleName = roleData.data.role[0].nama.replace(/\s+/g, '').toLowerCase();
      }
    } catch (error) {
      console.log('Role API error, defaulting to public role:', error.message);
      // Silently continue with public role
    }

    // Step 4: Generate application token (if using JWT)
    const appToken = jwt.sign(
      { username: userData.userData.username, role: roleName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Example expiry time
    );

    // Step 5: Respond with tokens and user info
    res.status(200).json({
      accessToken: appToken,
      ssoToken: accessToken,
      role: roleName,
      username: userData.userData.username,
      name: userData.pegawaiData.name,
    });
  } catch (error) {
    console.error('Error during login:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data || 'Authentication failed' });
    }

    res.status(500).json({ error: 'An internal server error occurred' });
  }
});


// Get user info
router.get('/user-info', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const userResponse = await axios.get(`${process.env.API_AUTH}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.status(200).json(userResponse.data);
  } catch (error) {
    console.error('Error fetching user info:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data || 'Failed to fetch user info' });
    }

    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

// Logout handler
router.post('/logout', (req, res) => {
  try {
    // Example logout handling (depends on session management strategy)
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error.message);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

module.exports = router;
