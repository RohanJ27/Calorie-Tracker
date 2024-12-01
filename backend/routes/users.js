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
      return res.status(400).json({ message: errors.array()[0].msg }); 
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
          email: user.email,
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
          res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
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
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    if (user.googleId) {
      return res.status(400).json({ message: 'Please use Google Sign-In' });
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
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
      }
    );
  } catch (err) {
    console.error('🛑 Login Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -googleId');
    res.json(user);
  } catch (err) {
    console.error('Profile Fetch Error:', err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/add-friend', auth, async (req, res) => {
  const { friendEmail } = req.body;
  const senderId = req.user.id;

  try {
    const normalizedEmail = friendEmail.toLowerCase();

    const recipient = await User.findOne({ email: normalizedEmail });

    if (!recipient) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (recipient._id.equals(senderId)) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
    }

    const alreadyFriend = recipient.friends.includes(senderId);
    if (alreadyFriend) {
      return res.status(400).json({ message: 'You are already friends.' });
    }    

    await User.findByIdAndUpdate(
      recipient._id,
      { $addToSet: { friends: senderId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      senderId,
      { $addToSet: { friends: recipient._id } },
      { new: true }
    );

    res.status(200).json({ message: 'You are now friends.' });
  } catch (err) {
    console.error('Send Friend Request Error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/friends/:id', auth, async (req, res) => {
  const { id } = req.params;

  if (id !== req.user.id) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  try {
    const user = await User.findById(id).populate('friends', 'username email').exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.error('Friends Fetch Error:', error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('username email score friends');
    if (!user) return res.status(404).json({ message: "User not found" });

    const friendsList = await User.find({ _id: { $in: user.friends } }).select('username email score');

    res.status(200).json({
      username: user.username,
      email: user.email,
      score: user.score,
      friends: friendsList.map(friend => ({
        username: friend.username,
        email: friend.email,
        score: friend.score,
      })),
    });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
