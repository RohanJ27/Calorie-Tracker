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
  friends: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      unique: true,
    }
  ],
});

UserSchema.pre('save', function (next) {
  this.friends = [...new Set(this.friends.map(friend => friend.toString()))];
  next();
});

module.exports = mongoose.model('User', UserSchema);
