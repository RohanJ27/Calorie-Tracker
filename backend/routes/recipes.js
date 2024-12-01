const express = require('express');
const multer = require('multer');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');
<<<<<<< HEAD
const Recipe = require('../models/uploadRecipe');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Ensure uploads directory exists
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename with timestamp
  },
});

const upload = multer({ storage });

// Parse range helper function (used for filtering calories, protein, etc.)
=======
<<<<<<< HEAD
const User = require('../models/User'); // Import the User model
=======
const Recipe = require('../models/uploadRecipe');
const { body, validationResult } = require('express-validator');
>>>>>>> taytay

dotenv.config();

/**
 * Parses a range string (e.g., "100-500") into [min, max].
 */
>>>>>>> main
const parseRange = (rangeStr) => {
  if (!rangeStr || !rangeStr.includes('-')) return [0, Infinity];
  const [minStr, maxStr] = rangeStr.split('-');
  const min = Number(minStr) || 0;
  const max = Number(maxStr) || Infinity;
  return [min, max];
};

/**
 * @route   GET /api/recipes/search
 * @desc    Search for recipes from Edamam API and user-uploaded recipes
 * @access  Protected
 */
router.get('/search', auth, async (req, res) => {
<<<<<<< HEAD
  const { ingredients, diet, health, calories, protein, fat, carbs } = req.query;

  // Normalize the search terms: ingredients, diet, health to lowercase and trim spaces
  const normalizedIngredients = ingredients
    ? ingredients.split(',').map((i) => i.trim().toLowerCase())
    : [];
  const normalizedDiet = diet ? diet.trim().toLowerCase() : null;
  const normalizedHealth = health ? health.trim().toLowerCase() : null;
=======
<<<<<<< HEAD
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
=======
  const { ingredients, diet, health, calories, protein, fat, carbs } = req.query;
>>>>>>> taytay
>>>>>>> main

  try {
    console.log('Search query received:', req.query);

<<<<<<< HEAD
    // Fetch recipes from Edamam API
=======
    // 1. Fetch recipes from Edamam API
>>>>>>> main
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
<<<<<<< HEAD

=======
>>>>>>> main
      console.log('Edamam API response received:', apiResponse.data.hits.length, 'recipes');

      edamamRecipes = apiResponse.data.hits.map((hit) => ({
        id: hit.recipe.uri,
        label: hit.recipe.label,
        image: hit.recipe.image,
        source: hit.recipe.source,
        url: hit.recipe.url,
<<<<<<< HEAD
        ingredients: hit.recipe.ingredientLines.map(i => i.toLowerCase()),  // Normalize ingredients from Edamam API
        calories: hit.recipe.calories,
        totalNutrients: hit.recipe.totalNutrients,
        dietLabels: hit.recipe.dietLabels.map(d => d.toLowerCase()), // Normalize dietLabels
        healthLabels: hit.recipe.healthLabels.map(h => h.toLowerCase()), // Normalize healthLabels
=======
        ingredients: hit.recipe.ingredientLines,
        calories: hit.recipe.calories,
        totalNutrients: hit.recipe.totalNutrients,
        dietLabels: hit.recipe.dietLabels,
        healthLabels: hit.recipe.healthLabels,
>>>>>>> main
        isExternal: true,
      }));
    } catch (error) {
      console.error('Error fetching from Edamam API:', error.message);
    }

<<<<<<< HEAD
    // Fetch user-uploaded recipes from MongoDB
    const userRecipesQuery = {};
    if (normalizedIngredients.length > 0) {
      userRecipesQuery.ingredients = { $all: normalizedIngredients };  // Compare with normalized ingredients
    }
    if (normalizedDiet) {
      userRecipesQuery.dietLabels = {
        $in: [new RegExp(`^${normalizedDiet}$`, 'i')], // Case-insensitive regex match
      };
    }
    if (normalizedHealth) {
      userRecipesQuery.healthLabels = {
        $in: [new RegExp(`^${normalizedHealth}$`, 'i')],
      };
    }

    const userRecipes = await Recipe.find(userRecipesQuery).lean();
=======
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

>>>>>>> main
    const formattedUserRecipes = userRecipes.map((recipe) => ({
      id: recipe._id,
      label: recipe.label,
      image: recipe.image,
      source: recipe.source || 'User Uploaded',
      url: recipe.url || '',
<<<<<<< HEAD
      ingredients: recipe.ingredients.map(i => i.toLowerCase()), // Normalize ingredients in user recipes
      calories: recipe.calories,
      totalNutrients: recipe.totalNutrients,
      dietLabels: recipe.dietLabels.map(d => d.toLowerCase()), // Normalize dietLabels
      healthLabels: recipe.healthLabels.map(h => h.toLowerCase()), // Normalize healthLabels
      isExternal: false,
    }));

    // Combine results from Edamam and MongoDB
    let combinedRecipes = [...edamamRecipes, ...formattedUserRecipes];
=======
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

>>>>>>> main
    if (protein || fat || carbs) {
      const [minProtein, maxProtein] = parseRange(protein);
      const [minFat, maxFat] = parseRange(fat);
      const [minCarbs, maxCarbs] = parseRange(carbs);

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

<<<<<<< HEAD
    res.json({ success: true, recipes: combinedRecipes.slice(0, 20), total: combinedRecipes.length });
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch recipes' });
=======
<<<<<<< HEAD
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
    res.status(500).json({ msg: 'Error fetching recipes from Edamam API' });
=======
    console.log('Combined recipes:', combinedRecipes.length);
    res.json({ recipes: combinedRecipes.slice(0, 20), total: combinedRecipes.length });
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    res.status(500).json({ error: 'Failed to fetch recipes' });
>>>>>>> main
  }
});

/**
 * @route   POST /api/recipes/upload
<<<<<<< HEAD
 * @desc    Upload a new recipe with image
 * @access  Protected
 */
// POST /upload route
router.post(
  '/upload',
  auth,
  upload.single('image'), // Handle image upload
  (req, res, next) => {
    console.log('Request Body:', req.body);  // Log request body
    console.log('Uploaded File:', req.file);  // Log the uploaded file 
    next();  // Proceed to the next middleware or route handler
  },
  [
    body('label').notEmpty().withMessage('Label is required'),
    body('ingredients').notEmpty().withMessage('Ingredients are required'),
    body('calories').optional().isNumeric().withMessage('Calories must be a number'),
    body('dietLabels').optional().isArray().withMessage('Diet labels must be an array'),
    body('healthLabels').optional().isArray().withMessage('Health labels must be an array'),
    body('directions').optional().isString().withMessage('Directions must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors:', errors.array());  // Log validation errors
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { label, ingredients, calories, dietLabels, healthLabels, directions } = req.body;

      // Save the new recipe to the database
      const newRecipe = new Recipe({
        userId: req.user.id,
        label,
        image: req.file ? `/uploads/${req.file.filename}` : null, // Save image file path
        ingredients: JSON.parse(ingredients),
        calories,
        dietLabels: JSON.parse(dietLabels),  // Diet labels should be an array
        healthLabels: JSON.parse(healthLabels),  // Health labels should be an array
        directions,
      });

      await newRecipe.save();
      res.status(201).json({ success: true, message: 'Recipe uploaded successfully!', recipe: newRecipe });
    } catch (error) {
      console.error('Error uploading recipe:', error.message);
      res.status(500).json({ success: false, error: 'Failed to upload recipe', details: error.message });
=======
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
>>>>>>> main
    }
  }
);

<<<<<<< HEAD


=======
>>>>>>> main
/**
 * @route   GET /api/recipes/:id
 * @desc    Get a specific recipe by ID
 * @access  Protected
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).lean();

    if (!recipe) {
<<<<<<< HEAD
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }

    res.json({ success: true, recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch recipe' });
=======
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe); // Send full recipe, including directions
  } catch (error) {
    console.error('Error fetching recipe:', error.message);
    res.status(500).json({ error: 'Failed to fetch recipe' });
>>>>>>> taytay
>>>>>>> main
  }
});

module.exports = router;
