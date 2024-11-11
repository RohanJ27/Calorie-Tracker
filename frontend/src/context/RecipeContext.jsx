import React, { createContext, useState } from 'react';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);

  return (
    <RecipeContext.Provider value={{ recipes, setRecipes, total, setTotal }}>
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContext;
