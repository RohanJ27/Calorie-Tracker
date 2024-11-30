const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');
<<<<<<< HEAD
const Recipe = require('../models/Recipe'); 

dotenv.config();

=======
const Recipe = require('../models/uploadRecipe');
const { body, validationResult } = require('express-validator');

dotenv.config();

/**
 * Parses a range string (e.g., "100-500") into [min, max].
 */
>>>>>>> 8d63dc7 (Editing token decoding and connecting upload recipe to search)
const parseRange = (rangeStr) => {
  if (!rangeStr || !rangeStr.includes('-')) return [0, Infinity];
  const [minStr, maxStr] = rangeStr.split('-');
  const min = Number(minStr) || 0;
  const max = Number(maxStr) || Infinity;
  return [min, max];
};

<<<<<<< HEAD


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

=======
/**
 * @route   GET /api/recipes/search
 * @desc    Search for recipes from Edamam API and user-uploaded recipes
 * @access  Protected
 */
router.get('/search', auth, async (req, res) => {
  const { ingredients, diet, health, calories, protein, fat, carbs } = req.query;

  try {
    console.log('Search query received:', req.query);

    // 1. Fetch recipes from Edamam API
    let edamamRecipes = [];
    try {
      const apiResponse = await axios.get('https://api.edamam.com/search', {
        params: {
          app_id: process.env.EDAMAM_APP_ID,
          app_key: process.env.EDAMAM_APP_KEY,
          q: ingredients || '',
          diet,
          health,
          calories,
        },
      });
      console.log('Edamam API response received:', apiResponse.data.hits.length, 'recipes');

      edamamRecipes = apiResponse.data.hits.map((hit) => ({
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
        isExternal: true,
      }));
    } catch (error) {
      console.error('Error fetching from Edamam API:', error.message);
    }

    // 2. Fetch user-uploaded recipes from MongoDB
    const userRecipesQuery = {};
    if (ingredients) {
      userRecipesQuery.ingredients = { $all: ingredients.split(',').map((i) => i.trim()) };
    }
    if (diet) userRecipesQuery.dietLabels = { $in: [diet] };
    if (health) userRecipesQuery.healthLabels = { $in: [health] };

    console.log('MongoDB query for user recipes:', userRecipesQuery);

    const userRecipes = await Recipe.find(userRecipesQuery).lean();
    console.log('User recipes fetched:', userRecipes.length);

    const formattedUserRecipes = userRecipes.map((recipe) => ({
      id: recipe._id,
      label: recipe.label,
      image: recipe.image,
      source: recipe.source || 'User Uploaded',
      url: recipe.url || '',
      ingredients: recipe.ingredients,
      calories: recipe.calories,
      totalNutrients: recipe.totalNutrients,
      dietLabels: recipe.dietLabels,
      healthLabels: recipe.healthLabels,
      isExternal: false,
      // Exclude directions
    }));

    // 3. Combine results
    let combinedRecipes = [...edamamRecipes, ...formattedUserRecipes];

>>>>>>> 8d63dc7 (Editing token decoding and connecting upload recipe to search)
    if (protein || fat || carbs) {
      const [minProtein, maxProtein] = parseRange(protein);
      const [minFat, maxFat] = parseRange(fat);
      const [minCarbs, maxCarbs] = parseRange(carbs);

<<<<<<< HEAD
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
      { new: true }
    );

    console.log(`User ${req.user.id} new score: ${updatedUser.score}`);

    res.json({ recipes, total, score: updatedUser.score });
  } catch (error) {
    console.error('🛑 Edamam API Error:', error.message);
<<<<<<< HEAD
    res.status(500).json({ msg: 'Error fetching recipes from Edamam API' });
=======
=======
      combinedRecipes = combinedRecipes.filter((recipe) => {
        const recipeProtein = recipe.totalNutrients?.PROCNT?.quantity || 0;
        const recipeFat = recipe.totalNutrients?.FAT?.quantity || 0;
        const recipeCarbs = recipe.totalNutrients?.CHOCDF?.quantity || 0;

        return (
          (!protein || (recipeProtein >= minProtein && recipeProtein <= maxProtein)) &&
          (!fat || (recipeFat >= minFat && recipeFat <= maxFat)) &&
          (!carbs || (recipeCarbs >= minCarbs && recipeCarbs <= maxCarbs))
        );
      });
    }

    console.log('Combined recipes:', combinedRecipes.length);
    res.json({ recipes: combinedRecipes.slice(0, 20), total: combinedRecipes.length });
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
>>>>>>> 8d63dc7 (Editing token decoding and connecting upload recipe to search)
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

<<<<<<< HEAD

router.post('/upload', auth, async (req, res) => {
  const { label, image, source, url, ingredients, calories, dietLabels, healthLabels, totalNutrients } = req.body;

  try {
    const newRecipe = new Recipe({
      userId: req.user._id, 
      label,
      image,
      source,
      url,
      ingredients,
      calories,
      dietLabels,
      healthLabels,
      totalNutrients,
    });

    await newRecipe.save();

    res.status(201).json({ message: 'Recipe uploaded successfully!', recipe: newRecipe });
  } catch (error) {
    console.error('🛑 Error uploading recipe:', error.message);
    res.status(500).json({ error: 'Failed to upload recipe' });
>>>>>>> c9898b1 (I added the form and started adding it to the search)
=======
/**
 * @route   POST /api/recipes/upload
 * @desc    Upload a new recipe
 * @access  Protected
 */
router.post(
  '/upload',
  auth,
  [
    body('label').notEmpty().withMessage('Label is required'),
    body('ingredients').isArray({ min: 1 }).withMessage('Ingredients must be an array'),
    body('calories').optional().isNumeric().withMessage('Calories must be a number'),
    body('dietLabels').optional().isArray().withMessage('Diet labels must be an array'),
    body('healthLabels').optional().isArray().withMessage('Health labels must be an array'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
    body('directions').optional().isString().withMessage('Directions must be a string'),
  ],
  async (req, res) => {
    console.log('Incoming request body:', req.body);
    console.log('Authenticated user:', req.user);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        label,
        image,
        source,
        url,
        ingredients,
        calories,
        dietLabels,
        healthLabels,
        totalNutrients,
        directions, // Include directions
      } = req.body;

      console.log('Saving the following recipe to the database:', {
        label,
        ingredients,
        calories,
        userId: req.user.id,
        directions,
      });

      const newRecipe = new Recipe({
        userId: req.user.id,
        label,
        image,
        source,
        url,
        ingredients,
        calories,
        dietLabels,
        healthLabels,
        totalNutrients,
        directions, // Save directions
      });

      await newRecipe.save();
      console.log('Recipe saved successfully:', newRecipe);

      res.status(201).json({ message: 'Recipe uploaded successfully!', recipe: newRecipe });
    } catch (error) {
      console.error('Error saving recipe:', error);
      res.status(500).json({ error: 'Failed to upload recipe', details: error.message });
    }
>>>>>>> 8d63dc7 (Editing token decoding and connecting upload recipe to search)
  }
});

/**
 * @route   GET /api/recipes/:id
 * @desc    Get a specific recipe by ID
 * @access  Protected
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).lean();

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe); // Send full recipe, including directions
  } catch (error) {
    console.error('Error fetching recipe:', error.message);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

module.exports = router;
