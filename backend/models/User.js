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
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  score: {
    type: Number,
    default: 0,
  },
  friends: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
    }
  ],
});

module.exports = mongoose.model('User', UserSchema);
