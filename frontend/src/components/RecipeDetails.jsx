import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './recipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recipe. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Recipe:', data.recipe);
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

  const capitalizeWords = (text) => {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) return <p>Loading...</p>;
  if (error || !recipe)
    return (
      <div className="recipe-details-container">
        <h1 className="recipe-details-title">Recipe Not Found</h1>
        <p className="recipe-details-text">The recipe you're looking for doesn't exist.</p>
      </div>
    );

  return (
    <div className="recipe-details-container">
      <div className="recipe-details-card">
        <h1 className="recipe-details-title">
          {recipe.label ? capitalizeWords(recipe.label) : 'Recipe Name Not Available'}
        </h1>
        <div className="recipe-details-image-container">
          {recipe.image ? (
            <img
              src={
                recipe.image.startsWith('http')
                  ? recipe.image
                  : `http://localhost:5000${recipe.image}`
              }
              alt={recipe.label}
              className="recipe-details-image"
            />
          ) : (
            <p className="recipe-details-text">No image available.</p>
          )}
        </div>
        <div className="recipe-details">
          <h2 className="recipe-details-subtitle">Ingredients:</h2>
          {recipe.ingredients?.length > 0 ? (
            <ul className="recipe-details-list">
              {recipe.ingredients.map((ing, index) => (
                <li key={index} className="recipe-details-list-item">
                  {capitalizeWords(ing)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="recipe-details-text">No ingredients available.</p>
          )}

          <h2 className="recipe-details-subtitle">Directions:</h2>
          {recipe.directions ? (
            <p className="recipe-details-text">{recipe.directions}</p>
          ) : (
            <p className="recipe-details-text">No directions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
