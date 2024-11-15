const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

router.post('/', authMiddleware, async (req, res) => {
  const { recipe } = req.body;

  if (!recipe || !recipe.uri) {
    return res.status(400).json({ msg: 'Invalid recipe data' });
  }

  try {
    let existingRecipe = await Recipe.findOne({ recipeUri: recipe.uri });
    if (!existingRecipe) {
      existingRecipe = new Recipe({
        recipeUri: recipe.uri,
        label: recipe.label,
        image: recipe.image,
        source: recipe.source,
        url: recipe.url,
        ingredients: recipe.ingredientLines,
        calories: recipe.calories,
        totalNutrients: recipe.totalNutrients,
        dietLabels: recipe.dietLabels,
        healthLabels: recipe.healthLabels,
      });
      await existingRecipe.save();
    }

    const user = await User.findById(req.user.id);
    if (user.favorites.includes(existingRecipe._id)) {
      return res.status(400).json({ msg: 'Recipe already in favorites' });
    }

    user.favorites.push(existingRecipe._id);
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:recipeId', authMiddleware, async (req, res) => {
  const { recipeId } = req.params;

  try {
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(recipeId)) {
      return res.status(400).json({ msg: 'Recipe not in favorites' });
    }

    user.favorites = user.favorites.filter(fav => fav.toString() !== recipeId);
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;