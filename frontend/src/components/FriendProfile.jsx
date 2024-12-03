import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

  if (isLoading) return <p style={styles.loading}>Loading profile...</p>;
  if (error) return <p style={styles.errorMessage}>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{profile.username}'s Profile</h2>
        <p style={styles.email}>Email: {profile.email}</p>
      </div>
      <div style={styles.buttons}>
        <Link to="/profile" style={styles.button}>
          Back to My Profile
        </Link>
        <Link to="/search" style={styles.button}>
          Search Recipes
        </Link>
        <button onClick={() => navigate(-1)} style={styles.logoutButton}>
          Go Back
        </button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.subtitle}>Friends List</h3>
        {profile.friends.length > 0 ? (
          profile.friends.map((friend, index) => (
            <div key={index} style={styles.friend}>
              <p style={styles.friendText}>
                {friend.username} - {friend.email} (Score: {friend.score})
              </p>
            </div>
          ))
        ) : (
          <p style={styles.noFriends}>This user has no friends.</p>
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
  friend: {
    marginBottom: '10px',
  },
  friendText: {
    fontSize: '16px',
    color: '#2c3e50',
  },
  noFriends: {
    fontSize: '16px',
    color: '#555',
  },
  loading: {
    fontSize: '24px',
    color: '#999',
  },
  errorMessage: {
    color: '#dc3545',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};

export default FriendProfile;
