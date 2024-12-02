import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
      <div style={styles.container}>
        <h1 style={styles.title}>Recipe Not Found</h1>
        <p style={styles.text}>The recipe you're looking for doesn't exist.</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {recipe.label ? capitalizeWords(recipe.label) : 'Recipe Name Not Available'}
        </h1>
        <div style={styles.imageContainer}>
          {recipe.image ? (
            <img
              src={recipe.image.startsWith('http') ? recipe.image : `http://localhost:5000${recipe.image}`}
              alt={recipe.label}
              style={styles.image}
            />
          ) : (
            <p style={styles.text}>No image available.</p>
          )}
        </div>
        <div style={styles.details}>
          <h2 style={styles.subTitle}>Ingredients:</h2>
          {recipe.ingredients?.length > 0 ? (
            <ul style={styles.list}>
              {recipe.ingredients.map((ing, index) => (
                <li key={index} style={styles.listItem}>
                  {capitalizeWords(ing)}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.text}>No ingredients available.</p>
          )}

          <h2 style={styles.subTitle}>Directions:</h2>
          {recipe.directions ? (
            <p style={styles.text}>{recipe.directions}</p>
          ) : (
            <p style={styles.text}>No directions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Funnel Sans, sans-serif',
    backgroundImage: 'url("https://i.pinimg.com/originals/19/68/b0/1968b06afc1ef281a748c9b307e39f06.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    width: '100vw',
  },
  card: {
    width: '90%',
    maxWidth: '800px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  imageContainer: {
    width: '100%',
    height: '300px',
    overflow: 'hidden',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  subTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#2c3e50',
  },
  list: {
    paddingLeft: '20px',
  },
  listItem: {
    marginBottom: '8px',
    color: '#2c3e50',
    fontWeight: 'bold',
  },
};

export default RecipeDetails;
