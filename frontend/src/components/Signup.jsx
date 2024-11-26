// signup.jsx

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin

const Signup = () => {
  const navigate = useNavigate();
  const { setAuth, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { username, email, password, password2 } = formData;

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
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/signup`, {
        username,
        email,
        password,
        authMethod: 'traditional', // Indicate traditional signup
      });

      console.log('Signup successful:', res.data);

      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
      setAuth(true);

      // Set user data
      setUser(res.data.user);

      // Navigate to profile
      navigate('/profile');
    } catch (err) {
      console.error('Signup error:', err.response || err.message);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // **Google OAuth Response Handlers**
  const responseMessage = async (response) => {
    console.log('Google signup success:', response);
    const { credential } = response;

    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/signup`, {
        token: credential,
        authMethod: 'google', // Indicate Google signup
      });

      console.log('Google Signup successful:', res.data);

      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
      setAuth(true);

      // Set user data
      setUser(res.data.user);

      // Navigate to profile
      navigate('/profile');
    } catch (err) {
      console.error('Google signup error:', err.response || err.message);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Google signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const errorMessage = (error) => {
    console.log('Google signup error:', error);
    setError('Google signup failed. Please try again.');
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
            required={true} // Ensure this is conditionally required based on authMethod
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
            required={true} // Ensure this is conditionally required based on authMethod
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
            required={true} // Ensure this is conditionally required based on authMethod
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
            required={true} // Ensure this is conditionally required based on authMethod
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {/* Divider or spacing before GoogleLogin */}
        <div style={styles.orDivider}>OR</div>
        {/* GoogleLogin Component */}
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </form>
    </div>
  );
};

// **Styles for the Signup Component**
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Funnel Sans, sans-serif',
    boxSizing: 'border-box',
    overflow: 'hidden',
    backgroundImage:
      'url("https://i.pinimg.com/originals/19/68/b0/1968b06afc1ef281a748c9b307e39f06.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  header: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: '10px',
    borderRadius: '5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    display: 'block',
    color: '#2c3e50',
    fontSize: '16px',
  },
  input: {
    padding: '12px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '14px',
    backgroundColor: '#033500',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  orDivider: {
    textAlign: 'center',
    margin: '20px 0',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
};

export default Signup;
