import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Signup.css'; 

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

      localStorage.setItem('token', res.data.token);
      setAuth(true);
      setUser(res.data.user);

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

  // Google Sign-Up Handler
  const handleGoogleSignUp = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h2 className="signup-title">Create an Account</h2>
      </div>
      {error && <p className="signup-error">{error}</p>}
      <form onSubmit={onSubmit} className="signup-form">
        <div className="signup-form-group">
          <label htmlFor="username" className="signup-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={onChange}
            required
            className="signup-input"
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="email" className="signup-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="signup-input"
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="password" className="signup-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="signup-input"
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="password2" className="signup-label">
            Confirm Password:
          </label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            className="signup-input"
          />
        </div>
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <div className="signup-google-signin-container">
        <p className="signup-or-text">Or</p>
        <button className="signup-google-button" onClick={handleGoogleSignUp}>
          Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
