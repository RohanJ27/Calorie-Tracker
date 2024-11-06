// backend/routes/users.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');

dotenv.config();

// @route   POST /api/users/signup
// @desc    Register a new user
// @access  Public
router.post(
  '/signup',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Signup Validation Failed:', errors.array());
      return res.status(400).json({ message: errors.array()[0].msg }); // Send the first error message
    }

    const { username, email, password } = req.body;

    console.log('Signup Attempt:', { username, email });

    try {
      // Normalize email
      const normalizedEmail = email.toLowerCase();

      // Check for existing user by email or username
      let user = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
      if (user) {
        console.log('Signup Failed: User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user instance
      user = new User({
        username,
        email: normalizedEmail,
        password,
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user to DB
      await user.save();
      console.log('User Registered:', user);

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }, // Token expires in 1 hour
        (err, token) => {
          if (err) {
            console.error('JWT Sign Error:', err);
            throw err;
          }
          console.log('Signup Successful: Token generated');
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Signup Error:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST /api/users/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    // Sign JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('🛑 Login Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Profile Fetch Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
