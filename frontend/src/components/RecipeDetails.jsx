import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetails = () => {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null); // Store the recipe details
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(false); // Track error state

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authorization
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recipe. Status: ${response.status}`);
        }

        const data = await response.json();
        setRecipe(data.recipe); 
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>; // Show loading message
  if (error || !recipe)
    return (
      <div style={{ padding: '20px' }}>
        <h1>Recipe Name Not Available</h1>
        <p>No image available.</p>
        <p><strong>Ingredients:</strong></p>
        <p>No ingredients available.</p>
        <p><strong>Directions:</strong></p>
        <p>No directions available.</p>
      </div>
    );

  return (
    <div style={{ padding: '20px' }}>
      <h1>{recipe.label || 'Recipe Name Not Available'}</h1>
      {recipe.image ? (
        <img src={recipe.image} alt={recipe.label} style={{ maxWidth: '100%' }} />
      ) : (
        <p>No image available.</p>
      )}
      <p><strong>Ingredients:</strong></p>
      {recipe.ingredients?.length > 0 ? (
        <ul>
          {recipe.ingredients.map((ing, index) => (
            <li key={index}>{ing}</li>
          ))}
        </ul>
      ) : (
        <p>No ingredients available.</p>
      )}
      <p><strong>Directions:</strong></p>
      {recipe.directions ? <p>{recipe.directions}</p> : <p>No directions available.</p>}
    </div>
  );
};

export default RecipeDetails;
