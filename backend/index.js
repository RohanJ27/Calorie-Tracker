const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path'); // Import the path module for static file serving
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add URL-encoded parser

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');

app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🛑 Server Error:', err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('MONGO_URI is not defined in the environment variables.');
      process.exit(1);
    }

    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const defaultUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      });
      await defaultUser.save();
      console.log('Default user created: test@example.com / password123');
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
