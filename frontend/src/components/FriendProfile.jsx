import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './FriendProfile.css';

const FriendProfile = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/profile/${friendId}`);
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching friend profile:', err);
        setError('Unable to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [friendId]);

  if (isLoading) return <p className="friend-profile-loading">Loading profile...</p>;
  if (error) return <p className="friend-profile-error-message">{error}</p>;

  return (
    <div className="friend-profile-container">
      <div className="friend-profile-header">
        <h2 className="friend-profile-title">{profile.username}'s Profile</h2>
        <p className="friend-profile-email">Email: {profile.email}</p>
        <p className="friend-profile-email">Score: {profile.score}</p>
      </div>
      <div className="friend-profile-buttons">
        <Link to="/profile" className="friend-profile-button">
          Back to My Profile
        </Link>
        <Link to="/search" className="friend-profile-button">
          Search Recipes
        </Link>
        <button onClick={() => navigate(-1)} className="friend-profile-logout-button">
          Go Back
        </button>
      </div>

      <div className="friend-profile-section">
        <h3 className="friend-profile-subtitle">Friends List</h3>
        {profile.friends.length > 0 ? (
          profile.friends.map((friend, index) => (
            <div key={index} className="friend-profile-friend">
              <p className="friend-profile-friend-text">
                {friend.username} - {friend.email} (Score: {friend.score})
              </p>
            </div>
          ))
        ) : (
          <p className="friend-profile-no-friends">This user has no friends.</p>
        )}
      </div>
    </div>
  );
};

export default FriendProfile;
