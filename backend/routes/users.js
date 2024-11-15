const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');

dotenv.config();

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/signup',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Signup Validation Failed:', errors.array());
      return res.status(400).json({ message: errors.array()[0].msg }); // Send the first error message
    }

    const { username, email, password } = req.body;

    console.log('Signup Attempt:', { username, email });

    try {
      const normalizedEmail = email.toLowerCase();

      let user = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
      if (user) {
        console.log('Signup Failed: User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }

      user = new User({
        username,
        email: normalizedEmail,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      console.log('User Registered:', user);

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }, 
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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
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
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Profile Fetch Error:', err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/send-friend-request/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const recipient = await User.findById(id);
    if (!recipient) return res.status(404).json({ message: "User not found" });

    if (recipient.friendRequests.some((req) => req.userId.equals(userId))) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    recipient.friendRequests.push({ userId });
    await recipient.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch('/accept-friend-request/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const request = user.friendRequests.find((req) => req.userId.equals(id) && req.status === 'pending');

    if (!request) return res.status(404).json({ message: "Friend request not found" });

    request.status = 'accepted';
    user.friends.push(id);

    const sender = await User.findById(id);
    sender.friends.push(userId);

    await user.save();
    await sender.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch('/reject-friend-request/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const request = user.friendRequests.find((req) => req.userId.equals(id) && req.status === 'pending');

    if (!request) return res.status(404).json({ message: "Friend request not found" });

    request.status = 'rejected';
    await user.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/friends/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate('friends', 'username email');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('username email friends');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
