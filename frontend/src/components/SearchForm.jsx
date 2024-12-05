import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import RecipeContext from '../context/RecipeContext';
import BounceLoader from "react-spinners/BounceLoader";

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
    <div style={styles.container}>
      {loading && (
        <div style={styles.spinnerOverlay}>
          <BounceLoader color="#033500" size={200} />
        </div>
      )}

      <h2 style={styles.title}>Find Your Perfect Recipe</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="ingredients" style={styles.label}>Ingredients (comma-separated):</label>
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

        <div style={styles.formGroup}>
          <label htmlFor="diet" style={styles.label}>Dietary Restrictions:</label>
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
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="health" style={styles.label}>Health Labels:</label>
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
          </select>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Loading...' : 'Search Recipes'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Funnel Sans, sans-serif',
    boxSizing: 'border-box',
    backgroundImage: 'url("https://i.pinimg.com/originals/19/68/b0/1968b06afc1ef281a748c9b307e39f06.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  title: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
    textShadow: '1px 1px 2px #fff',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: '10px',
    borderRadius: '5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    display: 'block',
    color: '#2c3e50',
    fontSize: '16px',
  },
  input: {
    padding: '12px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: '16px',
  },
  select: {
    padding: '12px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    color: '#333',
    backgroundColor: '#fff',
  },
  button: {
    position: 'relative',
    padding: '14px',
    backgroundColor: '#033500',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  spinnerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
     
  },
};

export default SearchForm;
