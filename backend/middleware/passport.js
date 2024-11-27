// passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Adjust the path if necessary
const dotenv = require('dotenv');

dotenv.config();

// Configure Passport to use Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract necessary profile information
        const googleId = profile.id;
        const email = profile.emails[0].value.toLowerCase();
        const username = profile.displayName;
        const avatar = profile.photos[0].value;

        // Check if user with this Google ID already exists
        let user = await User.findOne({ googleId });

        if (user) {
          // Existing Google user
          return done(null, user);
        } else {
          // Check if a user with the same email exists
          user = await User.findOne({ email });

          if (user) {
            // Link Google account to existing user
            user.googleId = googleId;
            user.avatar = avatar || user.avatar;
            await user.save();
            return done(null, user);
          } else {
            // Create a new user
            const newUser = new User({
              username,
              email,
              googleId,
              avatar,
            });

            await newUser.save();
            return done(null, newUser);
          }
        }
      } catch (err) {
        console.error('Error in Google Strategy:', err);
        return done(err, null);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password -googleId');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
