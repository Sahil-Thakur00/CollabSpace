const express = require('express');
const User = require('../models/User');
const { verifyPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ detail: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.password) {
      return res.status(401).json({ detail: 'User does not exist' });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ detail: 'User does not exist' });
    }

    const token = generateToken(user._id.toString());
    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

module.exports = router;
