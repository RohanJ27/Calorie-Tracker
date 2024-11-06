// frontend/src/components/Search.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Search = () => {
  const { user } = useContext(AuthContext); // Access user data if needed
  const [searchParams, setSearchParams] = useState({
    filename: '',
    fileType: '',
    startDate: '',
    endDate: '',
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/upload/search', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: searchParams,
      });
      setResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Search failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Search Files</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Filename:</label>
          <input
            type="text"
            name="filename"
            value={searchParams.filename}
            onChange={onChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>File Type:</label>
          <input
            type="text"
            name="fileType"
            value={searchParams.fileType}
            onChange={onChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={searchParams.startDate}
            onChange={onChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={searchParams.endDate}
            onChange={onChange}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Search
        </button>
      </form>

      <div style={styles.results}>
        <h3>Search Results:</h3>
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul>
            {results.map((file) => (
              <li key={file._id}>
                <a href={`http://localhost:5000/${file.filePath}`} target="_blank" rel="noopener noreferrer">
                  {file.filename}
                </a>{' '}
                - {file.fileType} - Uploaded on {new Date(file.uploadDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '2px 2px 12px #aaa',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    padding: '8px',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
  },
  results: {
    marginTop: '30px',
  },
};

export default Search;
