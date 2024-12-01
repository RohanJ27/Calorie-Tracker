import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { auth } = useContext(AuthContext);
  const [signupHovered, setSignupHovered] = useState(false);
  const [loginHovered, setLoginHovered] = useState(false);

  if (auth) {
    return <Navigate to="/profile" />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.content}>
          <h2 style={styles.title}>Welcome to RecipeFit</h2>
          <p style={styles.subtitle}>Recipes That Fit Your Ingredients, Your Goals, Your Life</p>
          <div style={styles.buttons}>
            <Link
              to="/signup"
              style={{
                ...styles.button,
                backgroundColor: signupHovered ? '#4CAF50' : '#66bb6a',
              }}
              onMouseEnter={() => setSignupHovered(true)}
              onMouseLeave={() => setSignupHovered(false)}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              style={{
                ...styles.button,
                backgroundColor: loginHovered ? '#022400' : '#033500',
              }}
              onMouseEnter={() => setLoginHovered(true)}
              onMouseLeave={() => setLoginHovered(false)}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100vw',
    height: '100vh',
    fontFamily: 'Funnel Sans',
    backgroundImage: 'url("https://i.pinimg.com/originals/19/68/b0/1968b06afc1ef281a748c9b307e39f06.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 30%, rgba(255, 255, 255, 0) 70%)',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '50px',
    boxSizing: 'border-box',
  },
  content: {
    maxWidth: '500px',
    color: '#2c3e50',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '20px',
    color: '#5a6465',
    marginBottom: '20px',
  },
  buttons: {
    display: 'flex',
    gap: '20px',
  },
  button: {
    padding: '12px 24px',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default Home;