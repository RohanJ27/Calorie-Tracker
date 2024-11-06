// backend/routes/recipes.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');

dotenv.config();

// @route   GET /api/recipes/search
// @desc    Search for recipes based on user criteria
// @access  Private
router.get('/search', auth, async (req, res) => {
  const { ingredients, diet, health, calories, protein, fat, carbs, from, to } = req.query;
  console.log('EDAMAM_APP_ID:', process.env.EDAMAM_APP_ID);
  console.log('EDAMAM_APP_KEY:', process.env.EDAMAM_APP_KEY);
  // Construct query parameters for Edamam API
  const params = {
    app_id: process.env.EDAMAM_APP_ID,
    app_key: process.env.EDAMAM_APP_KEY,
    q: ingredients || '', // Ingredients input
    diet: diet || '', // Dietary restrictions
    health: health || '', // Health labels
    calories: calories || '', // Calorie range
    from: parseInt(from) || 0, // Pagination start
    to: parseInt(to) || 20, // Pagination end
  };

  console.log('🔍 Recipe Search Request Params:', params);

  try {
    // Make request to Edamam Recipe Search API
    const response = await axios.get('https://api.edamam.com/search', { params });

    console.log('🟢 Edamam API Response Status:', response.status);
    console.log('🟢 Number of Recipes Received:', response.data.hits.length);

    // Extract and filter recipes based on macronutrient goals
    let recipes = response.data.hits.map(hit => ({
      id: hit.recipe.uri, // Unique identifier
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

    // Apply macronutrient filters if provided
    if (protein || fat || carbs) {
      recipes = recipes.filter(recipe => {
        let meetsProtein = true;
        let meetsFat = true;
        let meetsCarbs = true;

        if (protein) {
          const [minProtein, maxProtein] = protein.split('-').map(Number);
          const recipeProtein = recipe.totalNutrients.PROCNT
            ? recipe.totalNutrients.PROCNT.quantity
            : 0;
          meetsProtein = recipeProtein >= minProtein && recipeProtein <= maxProtein;
        }

        if (fat) {
          const [minFat, maxFat] = fat.split('-').map(Number);
          const recipeFat = recipe.totalNutrients.FAT
            ? recipe.totalNutrients.FAT.quantity
            : 0;
          meetsFat = recipeFat >= minFat && recipeFat <= maxFat;
        }

        if (carbs) {
          const [minCarbs, maxCarbs] = carbs.split('-').map(Number);
          const recipeCarbs = recipe.totalNutrients.CHOCDF
            ? recipe.totalNutrients.CHOCDF.quantity
            : 0;
          meetsCarbs = recipeCarbs >= minCarbs && recipeCarbs <= maxCarbs;
        }

        return meetsProtein && meetsFat && meetsCarbs;
      });
    }

    res.json({ recipes, total: response.data.count });
  } catch (error) {
    console.error('🛑 Edamam API Error:', error.message);
    if (error.response) {
      // The request was made, and the server responded with a status code
      console.error('🛑 Edamam API Response Data:', error.response.data);
      console.error('🛑 Edamam API Response Status:', error.response.status);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('🛑 No response received from Edamam API:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('🛑 Error setting up Edamam API request:', error.message);
    }
    res.status(500).json({ message: 'Error fetching recipes from Edamam API' });
  }
});

module.exports = router;
