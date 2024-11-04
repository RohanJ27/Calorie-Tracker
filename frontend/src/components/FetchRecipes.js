// src/components/FetchRecipes.js
import React, { useEffect } from 'react';
import axios from 'axios';

const FetchRecipes = () => {
  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/recipes');
      // Handle the response data
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div>
      <h1>Recipes</h1>
      {/* You can display the recipes here */}
    </div>
  );
};

export default FetchRecipes;
