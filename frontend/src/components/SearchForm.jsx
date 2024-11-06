import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import RecipeContext from '../context/RecipeContext'; // Import RecipeContext

const SearchForm = () => {
  const { auth } = useContext(AuthContext);
  const { setRecipes, setTotal } = useContext(RecipeContext); // Destructure set functions
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ingredients: '',
    diet: '',
    health: '',
    calories: '',
    protein: '',
    fat: '',
    carbs: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { ingredients, diet, health, calories, protein, fat, carbs } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const params = {};

      if (ingredients) params.ingredients = ingredients;
      if (diet) params.diet = diet;
      if (health) params.health = health;
      if (calories) params.calories = calories;
      if (protein) params.protein = protein;
      if (fat) params.fat = fat;
      if (carbs) params.carbs = carbs;

      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:5000/api/recipes/search', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { recipes, total } = res.data;

      // Update context
      setRecipes(recipes);
      setTotal(total);

      // Navigate to the results page
      navigate('/results');
    } catch (err) {
      console.error('🛑 Recipe Search Error:', err);
      setError(
        err.response?.data?.message || 'An error occurred while searching for recipes.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Find Your Perfect Recipe</h2>
      <form onSubmit={onSubmit} style={styles.form}>
        {/* Ingredients Input */}
        <div style={styles.formGroup}>
          <label htmlFor="ingredients">Ingredients (comma-separated):</label>
          <input
            type="text"
            id="ingredients"
            name="ingredients"
            value={ingredients}
            onChange={onChange}
            placeholder="e.g., chicken, rice, broccoli"
            style={styles.input}
          />
        </div>

        {/* Dietary Restrictions */}
        <div style={styles.formGroup}>
          <label htmlFor="diet">Dietary Restrictions:</label>
          <select
            id="diet"
            name="diet"
            value={diet}
            onChange={onChange}
            style={styles.select}
          >
            <option value="">-- Select Diet --</option>
            <option value="balanced">Balanced</option>
            <option value="high-protein">High-Protein</option>
            <option value="low-fat">Low-Fat</option>
            <option value="low-carb">Low-Carb</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            {/* Add more diet options as needed */}
          </select>
        </div>

        {/* Health Labels */}
        <div style={styles.formGroup}>
          <label htmlFor="health">Health Labels:</label>
          <select
            id="health"
            name="health"
            value={health}
            onChange={onChange}
            style={styles.select}
          >
            <option value="">-- Select Health Labels --</option>
            <option value="peanut-free">Peanut-Free</option>
            <option value="tree-nut-free">Tree-Nut-Free</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="dairy-free">Dairy-Free</option>
            <option value="egg-free">Egg-Free</option>
            {/* Add more health labels as needed */}
          </select>
        </div>

        {/* Calorie Range */}
        <div style={styles.formGroup}>
          <label htmlFor="calories">Calorie Range:</label>
          <input
            type="text"
            id="calories"
            name="calories"
            value={calories}
            onChange={onChange}
            placeholder="e.g., 200-500"
            style={styles.input}
          />
        </div>

        {/* Protein Range */}
        <div style={styles.formGroup}>
          <label htmlFor="protein">Protein (g) Range:</label>
          <input
            type="text"
            id="protein"
            name="protein"
            value={protein}
            onChange={onChange}
            placeholder="e.g., 10-20"
            style={styles.input}
          />
        </div>

        {/* Fat Range */}
        <div style={styles.formGroup}>
          <label htmlFor="fat">Fat (g) Range:</label>
          <input
            type="text"
            id="fat"
            name="fat"
            value={fat}
            onChange={onChange}
            placeholder="e.g., 5-15"
            style={styles.input}
          />
        </div>

        {/* Carbs Range */}
        <div style={styles.formGroup}>
          <label htmlFor="carbs">Carbohydrates (g) Range:</label>
          <input
            type="text"
            id="carbs"
            name="carbs"
            value={carbs}
            onChange={onChange}
            placeholder="e.g., 20-40"
            style={styles.input}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Searching...' : 'Search Recipes'}
        </button>
      </form>

      {/* Error Message */}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};
  // Inline styles for simplicity; consider using CSS or styled-components for larger projects
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '2px 2px 12px #aaa',
      backgroundColor: '#fff',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    formGroup: {
      marginBottom: '15px',
    },
    input: {
      padding: '8px',
      width: '100%',
      boxSizing: 'border-box',
    },
    select: {
      padding: '8px',
      width: '100%',
      boxSizing: 'border-box',
    },
    button: {
      padding: '10px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    error: {
      color: 'red',
      marginTop: '15px',
    },
  };

  export default SearchForm;
