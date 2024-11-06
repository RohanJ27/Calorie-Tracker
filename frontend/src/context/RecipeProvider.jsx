// frontend/src/context/RecipeProvider.jsx

import React, { useState } from 'react';
import RecipeContext from './RecipeContext';

const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);

  return (
    <RecipeContext.Provider value={{ recipes, setRecipes, total, setTotal }}>
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeProvider;
