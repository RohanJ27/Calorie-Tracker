import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import axios from 'axios';

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.data) {
            setAuth(true);
            setUser(res.data);
          }
        } catch (err) {
          console.error('Auth check failed:', err);
          setAuth(false);
          localStorage.removeItem('token');
        }
      }
      setLoadingAuth(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, setUser }}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
