import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import RecipeContext from '../context/RecipeContext';
import BounceLoader from "react-spinners/BounceLoader";
import './SearchForm.css'; 

const SearchForm = () => {
  const { auth } = useContext(AuthContext);
  const { setRecipes, setTotal } = useContext(RecipeContext);
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

  const isValidRange = (value) => {
    return /^\d+-\d+$/.test(value);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const allFieldsEmpty = !ingredients && !diet && !health && !calories && !protein && !fat && !carbs;
    if (allFieldsEmpty) {
      setError('No recipes found. Try adjusting your search criteria.');
      setLoading(false);
      return;
    }
  
    if (
      (protein && !isValidRange(protein)) ||
      (fat && !isValidRange(fat)) ||
      (carbs && !isValidRange(carbs))
    ) {
      setError('Please enter macronutrient ranges in the format "min-max".');
      setLoading(false);
      return;
    }
  
    try {
      const params = {};
  
      if (ingredients) {
        params.ingredients = ingredients.split(',').map(i => i.trim().toLowerCase()).join(',');
      }
      if (diet) params.diet = diet.trim().toLowerCase();
      if (health) params.health = health.trim().toLowerCase();
      if (calories) params.calories = calories;
      if (protein) params.protein = protein;
      if (fat) params.fat = fat;
      if (carbs) params.carbs = carbs;
  
      console.log('Submitting Search with Params:', params);
  
      const token = localStorage.getItem('token');
  
      const res = await axios.get('http://localhost:5000/api/recipes/search', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const { recipes, total } = res.data;

      if (!recipes || recipes.length === 0) {
        setError('No recipes found. Try adjusting your search criteria.');
      } else {
        setRecipes(recipes);
        setTotal(total);
        navigate('/results');
      }
       
      
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
    <div className="search-form-container">
      {loading && (
        <div className="search-form-spinner-overlay">
          <BounceLoader color="#033500" size={200} />
        </div>
      )}

      <h2 className="search-form-title">Find Your Perfect Recipe</h2>
      {error && <p className="search-form-error">{error}</p>}
      <form onSubmit={onSubmit} className="search-form-form">
        <div className="search-form-form-group">
          <label htmlFor="ingredients" className="search-form-label">Ingredients (comma-separated):</label>
          <input
            type="text"
            id="ingredients"
            name="ingredients"
            value={ingredients}
            onChange={onChange}
            placeholder="e.g., chicken, rice, broccoli"
            className="search-form-input"
          />
        </div>

        <div className="search-form-form-group">
          <label htmlFor="diet" className="search-form-label">Dietary Restrictions:</label>
          <select
            id="diet"
            name="diet"
            value={diet}
            onChange={onChange}
            className="search-form-select"
          >
            <option value="">-- Select Diet --</option>
            <option value="balanced">Balanced</option>
            <option value="high-protein">High-Protein</option>
            <option value="low-fat">Low-Fat</option>
            <option value="low-carb">Low-Carb</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        <div className="search-form-form-group">
          <label htmlFor="health" className="search-form-label">Health Labels:</label>
          <select
            id="health"
            name="health"
            value={health}
            onChange={onChange}
            className="search-form-select"
          >
            <option value="">-- Select Health Labels --</option>
            <option value="peanut-free">Peanut-Free</option>
            <option value="tree-nut-free">Tree-Nut-Free</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="dairy-free">Dairy-Free</option>
            <option value="egg-free">Egg-Free</option>
          </select>
        </div>

        <button type="submit" className="search-form-button" disabled={loading}>
          {loading ? 'Loading...' : 'Search Recipes'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
