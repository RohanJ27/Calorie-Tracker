import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth, setUser, setToken } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      
      localStorage.setItem('token', token);
      setToken(token);
      setAuth(true);

      
      fetchUser(token);
    } else {
     
      navigate('/login');
    }
   
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        navigate('/profile');
      } else {
       
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
