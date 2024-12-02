import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';

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
      window.open(recipe.url, '_blank'); // Open Edamam recipe in a new tab
    } else {
      navigate(`/recipes/${recipe.id}`); // Navigate to user-uploaded recipe details
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading recipes...</div>;
  }

  if (!loading && recipes.length === 0) {
    return (
      <div style={styles.loading}>
        <p>No recipes found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Search Results</h2>
      <p style={styles.total}>Total Recipes Found: {total}</p>
      <div style={styles.recipesContainer}>
        {recipes.map((recipe, index) => (
          <div key={index} style={styles.card}>
            <img
              src={recipe.isExternal ? recipe.image : `http://localhost:5000${recipe.image}`}
              alt={recipe.label}
              style={styles.image}
            />
            <div style={styles.content}>
              <h3 style={styles.recipeTitle}>
                {recipe.label
                  ? recipe.label
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                  : 'Untitled Recipe'}
              </h3>
              <p style={styles.text}>
                <strong>Source:</strong> {recipe.source || 'Unknown'}
              </p>
              <p style={styles.text}>
                <strong>Calories:</strong> {recipe.calories ? Math.round(recipe.calories) : 'N/A'}
              </p>
              <p style={styles.text}>
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
              <p style={styles.text}>
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
                style={styles.link} // Keep the button styled as a link
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

const styles = {
  container: {
    padding: '40px 20px',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Funnel Sans, sans-serif',
    backgroundImage: 'url("https://i.pinimg.com/originals/19/68/b0/1968b06afc1ef281a748c9b307e39f06.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '20px',
    textShadow: '1px 1px 2px #fff',
  },
  total: {
    fontSize: '18px',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '30px',
  },
  recipesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    color: '#2c3e50',
  },
  recipeTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  text: {
    fontSize: '16px',
    marginBottom: '8px',
  },
  link: {
    marginTop: 'auto',
    padding: '12px',
    backgroundColor: '#033500',
    color: '#fff',
    textDecoration: 'none',
    border: 'none',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '18px',
    color: '#fff',
  },
};

export default SearchResults;
