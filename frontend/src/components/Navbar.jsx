// frontend/src/components/Navbar.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { auth, setAuth, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-text">RecipeFit</Link>
      </div>
      <div className="nav-links">
        <Link to="/search" className="nav-link">Search Recipes</Link>
        {auth ? (
          <>
            <Link to="/profile" className="nav-link">Account Details</Link>
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
