import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadRecipeForm = () => {
  const [formData, setFormData] = useState({
    label: '',
    ingredients: '',
    calories: '',
    dietLabels: '',
    healthLabels: '',
    image: null,
    directions: '',
  });

  const [message, setMessage] = useState(null); // For success or error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { label, ingredients, calories, dietLabels, healthLabels, directions } = formData;
    if (
      !label.trim() ||
      !ingredients.trim() ||
      !calories.trim() ||
      !dietLabels.trim() ||
      !healthLabels.trim() ||
      !directions.trim()
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fill out all fields before submitting.' });
      return;
    }

    const form = new FormData();
    form.append('label', formData.label);
    form.append('ingredients', JSON.stringify(formData.ingredients.split(',').map((item) => item.trim())));
    form.append('calories', formData.calories);
    form.append('dietLabels', JSON.stringify(formData.dietLabels.split(',').map((item) => item.trim())));
    form.append('healthLabels', JSON.stringify(formData.healthLabels.split(',').map((item) => item.trim())));
    form.append('directions', formData.directions);

    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const response = await fetch('http://localhost:5000/api/recipes/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: form,
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Recipe uploaded successfully!' });
        setTimeout(() => {
          navigate('/'); // Redirect to home after 1 second
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error('Upload Error:', errorData);
        setMessage({ type: 'error', text: 'Error uploading recipe, please try again.' });
      }
    } catch (error) {
      console.error('Error uploading recipe:', error);
      setMessage({ type: 'error', text: 'An error occurred while uploading the recipe.' });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Upload Recipe</h1>
        {message && (
          <div
            style={{
              ...styles.message,
              ...(message.type === 'success' ? styles.successMessage : styles.errorMessage),
            }}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data" style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="label" style={styles.label}>
              Recipe Name
            </label>
            <input
              type="text"
              id="label"
              name="label"
              placeholder="Enter the recipe name"
              value={formData.label}
              onChange={handleChange}
              style={styles.inputGray}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="ingredients" style={styles.label}>
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              placeholder="Enter ingredients, comma-separated"
              value={formData.ingredients}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="calories" style={styles.label}>
              Calories
            </label>
            <input
              type="number"
              id="calories"
              name="calories"
              placeholder="Enter calories"
              value={formData.calories}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="dietLabels" style={styles.label}>
              Diet Labels
            </label>
            <input
              type="text"
              id="dietLabels"
              name="dietLabels"
              placeholder="Enter diet labels, comma-separated"
              value={formData.dietLabels}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="healthLabels" style={styles.label}>
              Health Labels
            </label>
            <input
              type="text"
              id="healthLabels"
              name="healthLabels"
              placeholder="Enter health labels, comma-separated"
              value={formData.healthLabels}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="image" style={styles.label}>
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="directions" style={styles.label}>
              Directions
            </label>
            <textarea
              id="directions"
              name="directions"
              placeholder="Enter the directions"
              value={formData.directions}
              onChange={handleChange}
              style={styles.textareaDarker}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Upload Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundImage: 'url("https://i.pinimg.com/originals/19/68/b0/1968b06afc1ef281a748c9b307e39f06.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    color: 'rgba(255, 255, 255, 0.87)',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  message: {
    padding: '12px 20px',
    margin: '20px 0',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  successMessage: {
    backgroundColor: '#033500', // Green for success
  },
  errorMessage: {
    backgroundColor: '#d9534f', // Red for error
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#2c3e50',
  },
  input: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: '#fff', // Enforce white background
    color: '#2c3e50', // Enforce black text
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    appearance: 'none', // Disable browser autofill styles
    boxShadow: 'none', // Remove autofill yellow highlight
  },
  
  inputGray: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: '#f7f7f7', // Light gray background
    color: '#2c3e50', // Enforce black text
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    appearance: 'none', // Disable browser autofill styles
    boxShadow: 'none', // Remove autofill yellow highlight
  },
  
  textarea: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#2c3e50',
    minHeight: '80px',
  },
  textareaDarker: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: '#f7f7f7',
    color: '#2c3e50',
    minHeight: '120px',
  },
  button: {
    padding: '14px',
    backgroundColor: '#033500',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default UploadRecipeForm;
