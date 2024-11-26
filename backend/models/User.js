const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Email is invalid'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long'],
    // Removed 'required' to make password optional for Google-authenticated users
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple documents to have null for this field
    index: true,  // Improves query performance on this field
  },
  avatar: {
    type: String, // URL to the user's profile picture from Google
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
