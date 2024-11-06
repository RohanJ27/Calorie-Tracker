import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';

const SearchResults = () => {
  const { recipes, total } = useContext(RecipeContext);
  const navigate = useNavigate();

  // If no recipes are available, redirect to search
  if (!recipes || recipes.length === 0) {
    navigate('/search');
    return null;
  }

  return (
    <div style={styles.container}>
      <h2>Search Results</h2>
      <p>Total Recipes Found: {total}</p>
      <div style={styles.recipesContainer}>
        {recipes.map((recipe, index) => (
          <div key={index} style={styles.card}>
            <img src={recipe.image} alt={recipe.label} style={styles.image} />
            <div style={styles.content}>
              <h3>{recipe.label}</h3>
              <p><strong>Source:</strong> {recipe.source}</p>
              <p><strong>Calories:</strong> {Math.round(recipe.calories)}</p>
              <p><strong>Diet Labels:</strong> {recipe.dietLabels.join(', ') || 'N/A'}</p>
              <p><strong>Health Labels:</strong> {recipe.healthLabels.join(', ') || 'N/A'}</p>
              <a href={recipe.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                View Recipe
              </a>
              {/* Optionally, add a button to save to favorites */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '2px 2px 12px #aaa',
  },
  recipesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '280px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    overflow: 'hidden',
    boxShadow: '2px 2px 12px #aaa',
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  content: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  link: {
    marginTop: 'auto',
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '3px',
    alignSelf: 'flex-start',
  },
};

export default SearchResults;
