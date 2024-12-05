import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';
import './SearchResults.css'; 

const SearchResults = () => {
  const { recipes, total } = useContext(RecipeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (recipes && recipes.length > 0) {
      setLoading(false);
    } else {
      const timeout = setTimeout(() => {
        if (!recipes || recipes.length === 0) {
          navigate('/search');
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [recipes, total, navigate]);

  const handleViewRecipe = (recipe) => {
    if (recipe.isExternal) {
      window.open(recipe.url, '_blank');
    } else {
      navigate(`/recipes/${recipe.id}`);
    }
  };

  return (
    <div className="search-results-container">
      <h2 className="search-results-title">Search Results</h2>
      <p className="search-results-total">Total Recipes Found: {total}</p>
      <div className="search-results-recipes-container">
        {recipes.map((recipe, index) => (
          <div key={index} className="search-results-card">
            <img
              src={recipe.isExternal ? recipe.image : `http://localhost:5000${recipe.image}`}
              alt={recipe.label}
              className="search-results-image"
            />
            <div className="search-results-content">
              <h3 className="search-results-recipe-title">
                {recipe.label
                  ? recipe.label
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                  : 'Untitled Recipe'}
              </h3>
              <p className="search-results-text">
                <strong>Source:</strong> {recipe.source || 'Unknown'}
              </p>
              <p className="search-results-text">
                <strong>Calories:</strong> {recipe.calories ? Math.round(recipe.calories) : 'N/A'}
              </p>
              <p className="search-results-text">
                <strong>Diet Labels:</strong>{' '}
                {recipe.dietLabels?.length > 0
                  ? recipe.dietLabels
                      .map((label) =>
                        label
                          .split(' ')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')
                      )
                      .join(', ')
                  : 'N/A'}
              </p>
              <p className="search-results-text">
                <strong>Health Labels:</strong>{' '}
                {recipe.healthLabels?.length > 0
                  ? recipe.healthLabels
                      .map((label) =>
                        label
                          .split(' ')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')
                      )
                      .join(', ')
                  : 'N/A'}
              </p>
              <button
                onClick={() => handleViewRecipe(recipe)}
                className="search-results-link"
              >
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
