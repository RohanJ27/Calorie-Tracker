// backend/routes/recipes.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');

dotenv.config();

// Helper function to parse ranges
const parseRange = (rangeStr) => {
  if (!rangeStr || !rangeStr.includes('-')) return [0, Infinity];
  const [minStr, maxStr] = rangeStr.split('-');
  const min = Number(minStr) || 0;
  const max = Number(maxStr) || Infinity;
  return [min, max];
};

// @route   GET /api/recipes/search
// @desc    Search for recipes based on user criteria
// @access  Private
router.get('/search', auth, async (req, res) => {
  const {
    ingredients,
    diet,
    health,
    calories,
    protein,
    fat,
    carbs,
    from,
    to,
  } = req.query;

  // Construct query parameters for Edamam API
  let params = {
    app_id: process.env.EDAMAM_APP_ID,
    app_key: process.env.EDAMAM_APP_KEY,
    q: ingredients || '',
    from: parseInt(from) || 0,
    to: parseInt(to) || 100, // Fetch more recipes to have more data for filtering
  };

  // Add optional parameters if they exist
  if (diet) params.diet = diet;
  if (health) params.health = health;
  if (calories) params.calories = calories;

  // Remove nutrient parameters from API request
  // We'll apply nutrient filtering in the backend after fetching recipes

  // Remove empty parameters
  Object.keys(params).forEach((key) => {
    if (!params[key]) {
      delete params[key];
    }
  });

  console.log('🔍 Cleaned Edamam API Request Params:', params);

  try {
    // Make request to Edamam Recipe Search API
    const response = await axios.get('https://api.edamam.com/search', {
      params,
    });

    console.log('🟢 Edamam API Response Status:', response.status);
    console.log('🟢 Number of Recipes Received:', response.data.hits.length);

    // Map the recipes
    let recipes = response.data.hits.map((hit) => ({
      id: hit.recipe.uri,
      label: hit.recipe.label,
      image: hit.recipe.image,
      source: hit.recipe.source,
      url: hit.recipe.url,
      ingredients: hit.recipe.ingredientLines,
      calories: hit.recipe.calories,
      totalNutrients: hit.recipe.totalNutrients,
      dietLabels: hit.recipe.dietLabels,
      healthLabels: hit.recipe.healthLabels,
    }));

    console.log('📝 Recipes Before Filtering:', recipes.length);

    // Apply nutrient filtering if nutrient ranges are provided
    if (protein || fat || carbs) {
      const [minProtein, maxProtein] = parseRange(protein);
      const [minFat, maxFat] = parseRange(fat);
      const [minCarbs, maxCarbs] = parseRange(carbs);

      recipes = recipes.filter((recipe) => {
        const recipeProtein = recipe.totalNutrients.PROCNT?.quantity || 0;
        const recipeFat = recipe.totalNutrients.FAT?.quantity || 0;
        const recipeCarbs = recipe.totalNutrients.CHOCDF?.quantity || 0;

        const meetsProtein =
          !protein || (recipeProtein >= minProtein && recipeProtein <= maxProtein);
        const meetsFat =
          !fat || (recipeFat >= minFat && recipeFat <= maxFat);
        const meetsCarbs =
          !carbs || (recipeCarbs >= minCarbs && recipeCarbs <= maxCarbs);

        return meetsProtein && meetsFat && meetsCarbs;
      });
    }

    console.log('📝 Recipes After Filtering:', recipes.length);

    // Update the total count after filtering
    const total = recipes.length;

    // Limit the number of recipes sent back to the frontend
    recipes = recipes.slice(0, 20); // Adjust as needed

    res.json({ recipes, total });
  } catch (error) {
    console.error('🛑 Edamam API Error:', error.message);
    if (error.response) {
      console.error('🛑 Edamam API Response Data:', error.response.data);
      console.error('🛑 Edamam API Response Status:', error.response.status);
    } else if (error.request) {
      console.error('🛑 No response received from Edamam API:', error.request);
    } else {
      console.error('🛑 Error setting up Edamam API request:', error.message);
    }
    res.status(500).json({ message: 'Error fetching recipes from Edamam API' });
  }
});

module.exports = router;
