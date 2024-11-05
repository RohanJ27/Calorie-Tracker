// frontend/src/components/FetchRecipes.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FetchRecipes = () => {
  const [recipes, setRecipes] = useState([]); // Initialize as empty array
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    try {
      console.log('Fetching recipes...');
      const response = await axios.get('http://localhost:5000/api/recipes');
      console.log('API response data:', response.data);

      // Verify that response.data is an array
      if (Array.isArray(response.data)) {
        setRecipes(response.data);
      } else {
        console.error('Unexpected data format:', response.data);
        setError('Unexpected data format received from API.');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to fetch recipes.');
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div>
      <h1>Recipes</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div key={recipe.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h2>{recipe.title}</h2>
            <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
          </div>
        ))
      ) : (
        <p>Loading recipes...</p>
      )}
    </div>
  );
};

export default FetchRecipes;
