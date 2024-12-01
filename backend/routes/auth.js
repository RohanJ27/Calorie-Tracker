const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google` }),
  (req, res) => {
    
    const payloadJwt = {
      user: {
        id: req.user.id,
        email: req.user.email,
      },
    };

    
    const token = jwt.sign(payloadJwt, process.env.JWT_SECRET, { expiresIn: '1h' });

  
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

module.exports = router;
