
import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { auth } = useContext(AuthContext);

  if (auth) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="home-container">
      <div className="home-overlay">
        <div className="home-content">
          <h2 className="home-title">Welcome to RecipeFit</h2>
          <p className="home-subtitle">Recipes That Fit Your Ingredients, Your Goals, Your Life</p>
          <div className="home-buttons">
            <Link to="/signup" className="home-button signup">
              Sign Up
            </Link>
            <Link to="/login" className="home-button login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
