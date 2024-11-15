const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  recipeUri: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  label: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  source: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  ingredients: [{
    type: String,
  }],
  calories: {
    type: Number,
  },
  totalNutrients: {
    type: Map,
    of: Object,
  },
  dietLabels: [{
    type: String,
  }],
  healthLabels: [{
    type: String,
  }],
  dateFavorited: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recipe', RecipeSchema);