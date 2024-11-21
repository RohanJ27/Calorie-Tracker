import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { user, setAuth, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');  // Changed to friendEmail
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`/api/users/friends/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFriends(response.data.friends || []);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
      setErrorMessage('Unable to load friends list.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    setUser(null);
    navigate('/login');
  };

  const addFriend = async () => {
    if (!friendEmail.trim()) {
      setErrorMessage('Email cannot be empty.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const url = 'http://localhost:5000/api/users/add-friend';
    const senderId = user._id;

    try {
      const response = await axios.post(
        url,
        { senderId, friendEmail },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSuccessMessage(response.data.message);
      setFriendEmail('');
      fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error.response || error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to add friend. Please try again.'
      );
    } finally {
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
    }
  };

  if (!user) {
    return <p style={styles.loading}>Loading profile...</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Welcome, {user.username}!</h2>
        <p style={styles.email}>Email: {user.email}</p>
      </div>
      <div style={styles.buttons}>
        <Link to="/upload" style={styles.button}>Upload Recipe</Link>
        <Link to="/search" style={styles.button}>Search Recipes</Link>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.subtitle}>Add Friend</h3>
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        <input
          type="email"
          placeholder="Enter Email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          style={styles.input}
        />
        <button onClick={addFriend} style={styles.button}>Add Friend</button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.subtitle}>Friends List</h3>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend._id} style={styles.friend}>
              <Link to={`/profile/${friend._id}`} style={styles.friendLink}>
                {friend.username}
              </Link>
            </div>
          ))
        ) : (
          <p style={styles.noFriends}>You have no friends yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100vw',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Funnel Sans, sans-serif',
    boxSizing: 'border-box',
    overflowY: 'auto',
    backgroundImage: 'url("https://i.pinimg.com/originals/19/68/b0/1968b06afc1ef281a748c9b307e39f06.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  email: {
    fontSize: '18px',
    color: '#2c3e50',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
    maxWidth: '300px',
    alignItems: 'center',
  },
  button: {
    padding: '14px',
    backgroundColor: '#033500',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '18px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  logoutButton: {
    padding: '14px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  section: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    color: '#2c3e50',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  subtitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontFamily: 'Funnel Sans, sans-serif',
  },
  friend: {
    marginBottom: '10px',
  },
  friendLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
  loading: {
    fontSize: '24px',
    color: '#999',
  },
  successMessage: {
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  errorMessage: {
    color: '#dc3545',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};

export default Profile;
