import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { user, setAuth, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendIdentifier, setFriendIdentifier] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      axios.get('/api/users/friend-requests', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(response => setFriendRequests(response.data.friendRequests || []))  // Use default empty array
        .catch(error => console.error('Failed to fetch friend requests:', error));

      axios.get('/api/users/friends', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(response => setFriends(response.data.friends || []))  // Use default empty array
        .catch(error => console.error('Failed to fetch friends:', error));
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    setUser(null);
    navigate('/login');
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`/api/users/friends/${user._id}`);
      setFriends(res.data.friends);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const res = await axios.get(`/api/users/friend-requests`);
      setFriendRequests(res.data.requests);
    } catch (err) {
      console.error(err);
    }
  };

  const sendFriendRequest = async () => {
    if (!friendIdentifier.trim()) {
      setSuccessMessage('Identifier cannot be empty.');
      setTimeout(() => setSuccessMessage(''), 5000);
      return;
    }
  
    try {
      const res = await axios.post(
        '/api/users/send-friend-request',
        { identifier: friendIdentifier },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSuccessMessage(`Friend request sent to ${friendIdentifier}`);
      setFriendIdentifier('');
    } catch (err) {
      console.error('Error sending friend request:', err.response || err);
      if (err.response?.data?.message) {
        setSuccessMessage(err.response.data.message);
      } else {
        setSuccessMessage('Failed to send friend request. Please try again.');
      }
    } finally {
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const acceptFriendRequest = async (id) => {
    try {
      await axios.patch(`/api/users/accept-friend-request/${id}`);
      fetchFriendRequests();
      fetchFriends();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectFriendRequest = async (id) => {
    try {
      await axios.patch(`/api/users/reject-friend-request/${id}`);
      fetchFriendRequests();
    } catch (err) {
      console.error(err);
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
        <h3 style={styles.subtitle}>Send Friend Request</h3>
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
        <input
          type="text"
          placeholder="Enter Username or Email"
          value={friendIdentifier}
          onChange={(e) => setFriendIdentifier(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendFriendRequest} style={styles.button}>Send Request</button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.subtitle}>Friend Requests</h3>
        {friendRequests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          friendRequests.map((request) => (
            <div key={request.userId} style={styles.request}>
              <span>{request.username}</span>
              <button onClick={() => acceptFriendRequest(request.userId)} style={styles.acceptButton}>Accept</button>
              <button onClick={() => rejectFriendRequest(request.userId)} style={styles.rejectButton}>Reject</button>
            </div>
          ))
        )}
      </div>

      <div style={styles.section}>
        <h3 style={styles.subtitle}>Friends</h3>
        {friends.length === 0 ? (
          <p>You have no friends</p>
        ) : (
          friends.map((friend) => (
            <div key={friend._id} style={styles.friend}>
              <Link to={`/profile/${friend._id}`} style={styles.friendLink}>{friend.username}</Link>
            </div>
          ))
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
    color: '#2c3e50',
  },
  request: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  acceptButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
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
};

export default Profile;