const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

<<<<<<< HEAD
module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
=======
  module.exports = function(req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader); // Log the raw header
  const token = req.header('Authorization')?.split(' ')[1]; 
>>>>>>> 8d63dc7 (Editing token decoding and connecting upload recipe to search)

  if (!token) {
    console.log('No token found in the request header');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
<<<<<<< HEAD
    req.user = decoded.user;
=======
    console.log('Decoded Token:', decoded); // Log the decoded token
    req.user = decoded.user; // Attach the user object to req
    console.log('User from token:', req.user);
>>>>>>> 8d63dc7 (Editing token decoding and connecting upload recipe to search)
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

