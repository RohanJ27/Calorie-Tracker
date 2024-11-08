// frontend/src/components/Login.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // We'll create this context shortly

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext); // Access setAuth from context

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  // Handle input changes
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
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
      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
      // Update auth state
      setAuth(true);
      // Redirect to Profile or Dashboard
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
    padding: '20px',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Funnel Sans',
    boxSizing: 'border-box',
    overflow: 'hidden',
    backgroundImage: 'url("https://i.pinimg.com/originals/19/68/b0/1968b06afc1ef281a748c9b307e39f06.jpg")',
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
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    display: 'block',
    color: '#2c3e50',
  },
  input: {
    padding: '10px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px',
    backgroundColor: '#033500',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default Login;
