import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';
import './searchResults.css';

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

  if (loading) {
    return <div className="search-results-loading">Loading recipes...</div>;
  }

  return (
    <div className="search-results-container">
      <h2 className="search-results-title">Search Results</h2>
      <p className="search-results-total">Total Recipes Found: {total}</p>
      <div className="search-results-recipes-container">
        {recipes.map((recipe, index) => (
          <div key={index} className="search-results-card">
            <img
              src={recipe.image}
              alt={recipe.label}
              className="search-results-image"
            />
            <div className="search-results-content">
              <h3 className="search-results-recipe-title">{recipe.label}</h3>
              <p className="search-results-text">
                <strong>Source:</strong> {recipe.source || 'User Uploaded'}
              </p>
              <p className="search-results-text">
                <strong>Calories:</strong> {Math.round(recipe.calories)}
              </p>
              <p className="search-results-text">
                <strong>Diet Labels:</strong> {recipe.dietLabels.join(', ') || 'N/A'}
              </p>
              <p className="search-results-text">
                <strong>Health Labels:</strong> {recipe.healthLabels.join(', ') || 'N/A'}
              </p>
              {/* Check if recipe has a URL (Edamam recipe) or an ID (user-uploaded recipe) */}
              {recipe.url ? (
                <a
                  href={recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="search-results-link"
                >
                  View Recipe
                </a>
              ) : (
                <Link
                  to={`/recipe/${recipe.id}`}
                  className="search-results-link"
                >
                  View Recipe
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
