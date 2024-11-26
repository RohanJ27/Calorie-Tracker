// users.js

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure User model has googleId and avatar fields
const auth = require('../middleware/auth');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors');

dotenv.config();

// Initialize Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Enable CORS for all routes (Adjust origin as needed)
router.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL in production
  credentials: true,
}));

/**
 * @route   GET /api/users/me
 * @desc    Get current user information
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -googleId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/users/signup
 * @desc    Register a new user (Traditional and Google Signup)
 * @access  Public
 */
router.post(
  '/signup',
  [
    // Conditionally require fields based on authMethod
    check('username')
      .if((value, { req }) => req.body.authMethod === 'traditional')
      .not()
      .isEmpty()
      .withMessage('Username is required'),
    check('email')
      .if((value, { req }) => req.body.authMethod === 'traditional')
      .isEmail()
      .withMessage('Please include a valid email'),
    check('password')
      .if((value, { req }) => req.body.authMethod === 'traditional')
      .isLength({ min: 6 })
      .withMessage('Password must be 6 or more characters'),
    check('token')
      .if((value, { req }) => req.body.authMethod === 'google')
      .not()
      .isEmpty()
      .withMessage('Google token is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Signup Validation Failed:', errors.array());
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { username, email, password, token, authMethod } = req.body;

    console.log('Signup Attempt:', { username, email, authMethod });

    try {
      let user;

      if (authMethod === 'traditional') {
        // Traditional signup logic
        const normalizedEmail = email.toLowerCase();

        // Check if user already exists
        user = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
        if (user) {
          console.log('Signup Failed: User already exists');
          return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
          username,
          email: normalizedEmail,
          password,
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user
        await user.save();
        console.log('User Registered:', user);
      } else if (authMethod === 'google') {
        // Google signup/login logic
        if (!token) {
          return res.status(400).json({ message: 'Google token is required' });
        }

        // Verify the token with Google
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payloadGoogle = ticket.getPayload();

        const { sub: googleId, email: emailGoogle, name, picture } = payloadGoogle;

        if (!emailGoogle) {
          return res.status(400).json({ message: 'Email not available from Google' });
        }

        // Check if a user with this Google ID already exists
        user = await User.findOne({ googleId });

        if (!user) {
          // If not, check if a user with the same email exists
          user = await User.findOne({ email: emailGoogle.toLowerCase() });
          if (user) {
            // If a user with the same email exists but doesn't have a Google ID, link them
            user.googleId = googleId;
            user.avatar = picture || user.avatar;
            await user.save();
            console.log('User Linked with Google:', user);
          } else {
            // If no user with the email exists, create a new user
            user = new User({
              username: name,
              email: emailGoogle.toLowerCase(),
              googleId,
              avatar: picture,
            });
            await user.save();
            console.log('Google User Created:', user);
          }
        } else {
          console.log('Existing Google User Found:', user);
        }
      } else {
        return res.status(400).json({ message: 'Invalid auth method' });
      }

      // Generate JWT token
      const payloadJwt = {
        user: {
          id: user.id,
          email: user.email,
        },
      };

      jwt.sign(
        payloadJwt,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, jwtToken) => {
          if (err) {
            console.error('JWT Sign Error:', err);
            return res.status(500).json({ message: 'Token generation failed' });
          }

          console.log('Signup/Login Successful: Token generated');
          res.json({
            token: jwtToken,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              avatar: user.avatar,
            },
          });
        }
      );
    } catch (err) {
      console.error('Signup/Login Error:', err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and get token (Traditional Login)
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Login Validation Failed:', errors.array());
      return res.status(400).json({ message: errors.array()[0].msg }); // Send the first error message
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      // If the user signed up via Google, ensure they can log in via Google only
      if (user.googleId && !password) {
        return res.status(400).json({ message: 'Please login using Google Sign-In' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          email: user.email,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }, 
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('🛑 Login Error:', err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -googleId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Profile Fetch Error:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/users/google-login
 * @desc    Authenticate user via Google OAuth and get token
 * @access  Public
 */
router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Extract necessary information from payload
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email not available from Google' });
    }

    // Check if a user with this Google ID already exists
    let user = await User.findOne({ googleId });

    if (!user) {
      // If not, check if a user with the same email exists
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        // If a user with the same email exists but doesn't have a Google ID, link them
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
        await user.save();
        console.log('User Linked with Google:', user);
      } else {
        // If no user with the email exists, create a new user
        user = new User({
          username: name,
          email: email.toLowerCase(),
          googleId,
          avatar: picture,
        });
        await user.save();
        console.log('Google User Created:', user);
      }
    } else {
      console.log('Existing Google User Found:', user);
    }

    // Generate JWT token
    const payloadJwt = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    jwt.sign(
      payloadJwt,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, jwtToken) => {
        if (err) {
          console.error('JWT Sign Error:', err);
          return res.status(500).json({ message: 'Token generation failed' });
        }

        console.log('Google Login Successful: Token generated');
        res.json({
          token: jwtToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
          },
        });
      }
    );
  } catch (err) {
    console.error('Google Login Error:', err.message);
    res.status(400).json({ message: 'Google authentication failed' });
  }
});

module.exports = router;
