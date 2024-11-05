// backend/routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const { check, validationResult } = require('express-validator');

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

      // Check for existing user
      let user = await User.findOne({ email: normalizedEmail });
      if (user) {
        console.log('Signup Failed: User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user instance
      user = new User({
        username, // Ensure this matches the User model
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

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Login Validation Failed:', errors.array());
      return res.status(400).json({ message: errors.array()[0].msg }); // Send the first error message
    }

    const { email, password } = req.body;

    console.log('Login Attempt:', { email, password });

    try {
      // Normalize email
      const normalizedEmail = email.toLowerCase();

      // Check for existing user
      let user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        console.log('Login Failed: User does not exist');
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Login Failed: Incorrect password');
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

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
          console.log('Login Successful: Token generated');
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Login Error:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// ... Login Route remains unchanged

module.exports = router;
