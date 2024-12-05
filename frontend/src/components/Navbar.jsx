import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { auth, user, setAuth, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    setUser(null);
    navigate('/login');
  };

  const handleDarkModeToggle = () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    document.getElementById('togTex').innerText = isDarkMode ? 'Dark' : 'Light';
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-text">RecipeFit</Link>
      </div>
      <div className="toggle-container">
        <label className="switch">
          <input
            type="checkbox"
            className="colorTrans"
            onClick={handleDarkModeToggle}
          />
          <span className="slider round"></span>
        </label>
        <p className="toggleText" id="togTex">Light</p>
      </div>

      <div className="nav-links">
        <Link to="/search" className="nav-link">Search Recipes</Link>
        {auth ? (
          <>
            <Link to="/profile" className="nav-link">Account Details</Link>
            {user && (
              <span className="user-score">
                Score: {user.score}
                <span className="tooltip-text">
                  Your score increases when you search for recipes!
                </span>
              </span>
            )}
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
