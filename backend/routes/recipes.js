// backend/routes/recipes.js
const express = require('express');
const router = express.Router();

// Sample data - replace this with actual data fetching logic
const sampleRecipes = [
  { id: 1, title: 'Spaghetti Bolognese', ingredients: ['spaghetti', 'beef', 'tomato sauce'], instructions: 'Cook spaghetti and mix with sauce.' },
  { id: 2, title: 'Chicken Curry', ingredients: ['chicken', 'curry powder', 'coconut milk'], instructions: 'Cook chicken with spices and coconut milk.' },
  // Add more recipes as needed
];

// @route   GET /api/recipes
// @desc    Get all recipes
// @access  Public
router.get('/', (req, res) => {
  res.json(sampleRecipes);
});

module.exports = router;
