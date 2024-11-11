import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAuth(true);
          setUser(res.data);
        })
        .catch(() => {
          setAuth(false);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        });
    } else {
      setAuth(false);
      setUser(null);
    }
  }, [token]); 

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
