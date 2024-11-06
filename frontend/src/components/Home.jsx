// frontend/src/components/Home.jsx
import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { auth } = useContext(AuthContext);

  if (auth) {
    return <Navigate to="/profile" />;
  }

  return (
    <div style={styles.container}>
      <h2>Welcome to Our App!</h2>
      <div style={styles.buttons}>
        <Link to="/signup" style={styles.button}>
          Sign Up
        </Link>
        <Link to="/login" style={styles.button}>
          Login
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
  },
  buttons: {
    marginTop: '30px',
  },
  button: {
    margin: '0 10px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '3px',
  },
};

export default Home;
