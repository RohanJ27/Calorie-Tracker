const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader); 
  const token = authHeader?.split(' ')[1]; 

  if (!token) {
    console.log('No token found in the request header');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log('Decoded Token:', decoded); 
    console.log('User from token:', req.user);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

