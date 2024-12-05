import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css'; 

const Profile = () => {
  const { user, setAuth, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      fetchFriends();
    }
  }, [user]);

  useEffect(() => {
    setIsLoading(false);
  }, [friends]);

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found.');
        setErrorMessage('No authentication token found.');
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/users/friends/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.friends) {
        setFriends(response.data.friends);
      } else {
        console.warn('No friends data received.');
        setFriends([]);
      }

      setIsLoading(false);
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
    setErrorMessage('');
    setSuccessMessage('');

    if (!friendEmail.trim()) {
      setErrorMessage('Email cannot be empty.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const url = 'http://localhost:5000/api/users/add-friend';

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        url,
        { friendEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
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
    return <p className="profile-loading">Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="profile-title">Welcome, {user.username}!</h2>
        <p className="profile-email">Email: {user.email}</p>
        <p className="profile-score">Score: {user.score || 'N/A'}</p>
      </div>
      <div className="profile-buttons">
        <Link to="/upload" className="profile-button">Upload Recipe</Link>
        <Link to="/search" className="profile-button">Search Recipes</Link>
        <button onClick={handleLogout} className="profile-logout-button">Logout</button>
      </div>

      <div className="profile-section">
        <h3 className="profile-subtitle">Add Friend</h3>
        {successMessage && <p className="profile-success-message">{successMessage}</p>}
        {errorMessage && <p className="profile-error-message">{errorMessage}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addFriend();
          }}
          className="profile-form"
        >
          <input
            type="email"
            placeholder="Enter Email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            className="profile-input"
          />
          <button type="submit" className="profile-button-submit">
            Add Friend
          </button>
        </form>
      </div>

      <div className="profile-section">
        <h3 className="profile-subtitle">Friends List</h3>
        {friends.length > 0 ? (
          friends.map((friend) => {
            if (!friend._id || !friend.username || !friend.email) {
              console.warn('Incomplete friend data:', friend);
              return null;
            }
            return (
              <div key={friend._id} className="profile-friend">
                <Link to={`/profile/${friend._id}`} className="profile-friend-link">
                  {friend.username}
                </Link>
                <span className="profile-friend-email"> - {friend.email}</span>
              </div>
            );
          })
        ) : (
          <p className="profile-no-friends">You have no friends yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
