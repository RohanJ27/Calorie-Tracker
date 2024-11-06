import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, setAuth, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    setUser(null);
    navigate('/login');
  };

  // If user is null, display a loading message or redirect
  if (!user) {
    return <p>Loading profile...</p>; // Or redirect to login
  }

  return (
    <div style={styles.container}>
      <h2>Welcome, {user.username}!</h2>
      <p>Email: {user.email}</p>
      {/* Add more user-specific data here */}
      <div style={styles.buttons}>
        <Link to="/upload" style={styles.button}>
          Upload Recipe
        </Link>
        <Link to="/search" style={styles.button}>
          Search Recipes
        </Link>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
    container: {
      maxWidth: '500px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '2px 2px 12px #aaa',
      textAlign: 'center',
    },
    buttons: {
      marginTop: '30px',
      display: 'flex',
      justifyContent: 'space-around',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#17a2b8',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
    },
    logoutButton: {
      padding: '10px 20px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
    },
    loading: {
      textAlign: 'center',
      marginTop: '50px',
      fontSize: '18px',
    },
  };
  
  export default Profile;