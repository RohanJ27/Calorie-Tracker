// middleware/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); 
const dotenv = require('dotenv');

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
       
        const googleId = profile.id;
        const email = profile.emails[0].value.toLowerCase();
        const username = profile.displayName;
        const avatar = profile.photos[0]?.value;

       
        let user = await User.findOne({ googleId });

        if (user) {
          
          return done(null, user);
        } else {
          
          user = await User.findOne({ email });

          if (user) {
            
            user.googleId = googleId;
            user.avatar = avatar || user.avatar;
            await user.save();
            return done(null, user);
          } else {
            
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



module.exports = passport;
