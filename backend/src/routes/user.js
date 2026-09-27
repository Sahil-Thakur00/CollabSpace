const express = require('express');
const User = require('../models/User');
const { hashPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /users  — register (regular or guest)
router.post('/', async (req, res) => {
  const { name, email, password, is_guest } = req.body;

  try {
    if (is_guest) {
      // Guest: no email or password needed
      const guestName = name || `Guest_${Math.random().toString(36).slice(2, 7)}`;
      const user = await User.create({ name: guestName, is_guest: true });
      const jwt_token = generateToken(user._id.toString());
      return res.status(201).json({ user, jwt_token });
    }

    // Regular user validation
    if (!email) return res.status(400).json({ detail: 'Email is required for non-guest users' });
    if (!password) return res.status(400).json({ detail: 'Password is required for non-guest users' });
    if (!name) return res.status(400).json({ detail: 'Name is required' });

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, is_guest: false });
    const jwt_token = generateToken(user._id.toString());

    return res.status(201).json({ user, jwt_token });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ detail: 'Email already exists' });
    }
    console.error('Create user error:', err);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// GET /users/me — get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ detail: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// PATCH /users/me — update name or avatar
router.patch('/me', authMiddleware, async (req, res) => {
  const { name, avatar_seed } = req.body;

  try {
    const update = {};
    if (name !== undefined) update.name = name;
    if (avatar_seed !== undefined) update.avatar_seed = avatar_seed;

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ detail: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// DELETE /users/me — only guests can delete themselves
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ detail: 'User not found' });
    if (!user.is_guest) return res.status(403).json({ detail: 'Only guest users can be deleted' });

    await user.deleteOne();
    return res.status(204).send();
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

module.exports = router;
