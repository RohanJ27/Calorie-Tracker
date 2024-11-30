import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetails = () => {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null); // Store the recipe details

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authorization
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }
        const data = await response.json();
        setRecipe(data); // Set the recipe data
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) return <p>Loading...</p>; // Show loading message if no data

  return (
    <div style={{ padding: '20px' }}>
      <h1>{recipe.label}</h1>
      <img src={recipe.image} alt={recipe.label} style={{ maxWidth: '100%' }} />
      <p><strong>Ingredients:</strong></p>
      <ul>
        {recipe.ingredients.map((ing, index) => (
          <li key={index}>{ing}</li>
        ))}
      </ul>
      <p><strong>Directions:</strong></p>
      <p>{recipe.directions}</p>
    </div>
  );
};

export default RecipeDetails;
