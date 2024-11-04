const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Route to handle ingredient input
app.post('/ingredients', (req, res) => {
    const ingredients = req.body.ingredients;
    // Process ingredients
    res.send('Ingredients received');
  });
  
  // Route to search for recipes
  app.get('/recipes', (req, res) => {
    // Fetch recipes based on criteria
    res.send('Recipes fetched');
  });
  