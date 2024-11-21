const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');
const User = require('../models/User'); // Import the User model

dotenv.config();

const parseRange = (rangeStr) => {
  if (!rangeStr || !rangeStr.includes('-')) return [0, Infinity];
  const [minStr, maxStr] = rangeStr.split('-');
  const min = Number(minStr) || 0;
  const max = Number(maxStr) || Infinity;
  return [min, max];
};

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

  let params = {
    app_id: process.env.EDAMAM_APP_ID,
    app_key: process.env.EDAMAM_APP_KEY,
    q: ingredients || '',
    from: parseInt(from) || 0,
    to: parseInt(to) || 100, 
  };

  if (diet) params.diet = diet;
  if (health) params.health = health;
  if (calories) params.calories = calories;

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined || params[key] === null) {
      delete params[key];
    }
  });

  try {
    const response = await axios.get('https://api.edamam.com/search', {
      params,
    });

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

    const total = recipes.length;

    recipes = recipes.slice(0, 20); 

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { score: 1 } },
      { new: true } // Returns the updated document
    );

    console.log(`User ${req.user.id} new score: ${updatedUser.score}`);

    res.json({ recipes, total });
  } catch (error) {
    console.error('🛑 Edamam API Error:', error.message);
    res.status(500).json({ msg: 'Error fetching recipes from Edamam API' });
  }
});

module.exports = router;
