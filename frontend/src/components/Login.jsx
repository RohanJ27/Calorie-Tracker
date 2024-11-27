// src/components/Login.jsx

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth, setUser, auth, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  useEffect(() => {
    if (auth && user) {
      navigate('/profile');
    }
  }, [auth, user, navigate]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      console.log('Login successful:', res.data);

      localStorage.setItem('token', res.data.token);
      setAuth(true);
      setUser(res.data.user);

      // Navigate to profile
      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Google Sign-In
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Login to RecipeFit</h2>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div style={styles.googleSignInContainer}>
        <p style={styles.orText}>Or</p>
        <button style={styles.googleButton} onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

const styles = {
  // Existing styles...
  googleSignInContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  orText: {
    marginBottom: '10px',
    color: '#2c3e50',
  },
  googleButton: {
    padding: '12px',
    backgroundColor: '#db4437',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
};

export default Login;
