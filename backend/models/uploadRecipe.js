const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label: { type: String, required: true },
    image: { type: String },
    source: { type: String },
    url: { type: String },
    ingredients: { type: [String], required: true },
    calories: { type: Number },
    dietLabels: { type: [String] },
    healthLabels: { type: [String] },
    totalNutrients: { type: Object },
    directions: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);


