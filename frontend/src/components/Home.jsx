import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { auth } = useContext(AuthContext);

  // Separate hover states for each button
  const [signupHovered, setSignupHovered] = useState(false);
  const [loginHovered, setLoginHovered] = useState(false);

  if (auth) {
    return <Navigate to="/profile" />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Welcome to RecipeFit!</h2>
        <p style={styles.subtitle}>Recipes That Fit Your Ingredients, Your Goals, Your Life</p>
      </div>
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
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    fontFamily: 'josefin-sans-100',
    boxSizing: 'border-box',
    overflow: 'hidden',
    backgroundImage: 'url("https://i.pinimg.com/originals/19/68/b0/1968b06afc1ef281a748c9b307e39f06.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '60px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '22px',
    color: '#7f8c8d',
    marginTop: '0',
  },
  buttons: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
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
