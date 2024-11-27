// src/components/Signup.jsx

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { setAuth, setUser, auth, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { username, email, password, password2 } = formData;

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

    // Simple validation
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/users/signup', {
        username,
        email,
        password,
      });

      console.log('Signup successful:', res.data);

      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
      setAuth(true);
      setUser(res.data.user);

      // Navigate to profile
      navigate('/profile');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Google Sign-Up
  const handleGoogleSignUp = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Create an Account</h2>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="username" style={styles.label}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={onChange}
            required
            style={styles.input}
          />
        </div>
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
        <div style={styles.formGroup}>
          <label htmlFor="password2" style={styles.label}>
            Confirm Password:
          </label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <div style={styles.googleSignInContainer}>
        <p style={styles.orText}>Or</p>
        <button style={styles.googleButton} onClick={handleGoogleSignUp}>
          Sign up with Google
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

export default Signup;
