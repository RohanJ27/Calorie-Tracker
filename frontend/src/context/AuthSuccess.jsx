// components/AuthSuccess.jsx

import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth, setUser } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      setAuth(true);

      // Optionally, fetch user data using the token
      fetchUser(token);
    } else {
      // Handle error if token is not present
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        navigate('/profile');
      } else {
        // Handle error, e.g., invalid token
        navigate('/login');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      navigate('/login');
    }
  };

  return (
    <div>
      <h2>Authenticating...</h2>
    </div>
  );
};

export default AuthSuccess;
