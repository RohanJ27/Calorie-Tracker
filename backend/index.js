const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

dotenv.config();

const app = express();


const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
};

app.use(cors(corsOptions));


app.use(express.json());


app.use(passport.initialize());


require('./middleware/passport');


const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./routes/auth'); 


app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes); 


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.use((err, req, res, next) => {
  console.error('🛑 Server Error:', err.stack);
  res.status(500).json({ message: 'Server Error' });
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
