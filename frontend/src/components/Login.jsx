import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Login.css'; 

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

      const userRes = await axios.get('http://localhost:5000/api/users/me', {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
        },
      });

      const userData = userRes.data;
      setUser(userData);

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

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2 className="login-title">Login to RecipeFit</h2>
      </div>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={onSubmit} className="login-form">
        <div className="login-form-group">
          <label htmlFor="email" className="login-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="login-input"
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password" className="login-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="login-input"
          />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="login-google-signin-container">
        <p className="login-or-text">Or</p>
        <button className="login-google-button" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
