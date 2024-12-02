import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './uploadRecipeForm.css'; 

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

  const [message, setMessage] = useState(null); 
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
    form.append(
      'ingredients',
      JSON.stringify(formData.ingredients.split(',').map((item) => item.trim()))
    );
    form.append('calories', formData.calories);
    form.append(
      'dietLabels',
      JSON.stringify(formData.dietLabels.split(',').map((item) => item.trim()))
    );
    form.append(
      'healthLabels',
      JSON.stringify(formData.healthLabels.split(',').map((item) => item.trim()))
    );
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
<<<<<<< HEAD
    <div className="upload-recipe-container">
      <div className="upload-recipe-card">
        <h1 className="upload-recipe-title">Upload Recipe</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="upload-recipe-form">
          <div className="upload-recipe-form-group">
            <label htmlFor="label" className="upload-recipe-label">
=======
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Upload Recipe</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="label" style={styles.label}>
>>>>>>> b097114 (Add upload recipe ingredients field and other fixes)
              Recipe Name
            </label>
            <input
              type="text"
              id="label"
              name="label"
              placeholder="Enter the recipe name"
              value={formData.label}
              onChange={handleChange}
<<<<<<< HEAD
              className="upload-recipe-input"
=======
              style={styles.input}
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
>>>>>>> b097114 (Add upload recipe ingredients field and other fixes)
              required
            />
          </div>

          <div className="upload-recipe-form-group">
            <label htmlFor="calories" className="upload-recipe-label">
              Calories
            </label>
            <input
              type="number"
              id="calories"
              name="calories"
              placeholder="Enter calories"
              value={formData.calories}
              onChange={handleChange}
              className="upload-recipe-input"
              required
            />
          </div>
<<<<<<< HEAD
          <div className="upload-recipe-form-group">
            <label htmlFor="dietLabels" className="upload-recipe-label">
=======

          <div style={styles.formGroup}>
            <label htmlFor="dietLabels" style={styles.label}>
>>>>>>> b097114 (Add upload recipe ingredients field and other fixes)
              Diet Labels
            </label>
            <input
              type="text"
              id="dietLabels"
              name="dietLabels"
              placeholder="Enter diet labels, comma-separated"
              value={formData.dietLabels}
              onChange={handleChange}
              className="upload-recipe-input"
              required
            />
          </div>
<<<<<<< HEAD
          <div className="upload-recipe-form-group">
            <label htmlFor="healthLabels" className="upload-recipe-label">
=======

          <div style={styles.formGroup}>
            <label htmlFor="healthLabels" style={styles.label}>
>>>>>>> b097114 (Add upload recipe ingredients field and other fixes)
              Health Labels
            </label>
            <input
              type="text"
              id="healthLabels"
              name="healthLabels"
              placeholder="Enter health labels, comma-separated"
              value={formData.healthLabels}
              onChange={handleChange}
              className="upload-recipe-input"
              required
            />
          </div>
<<<<<<< HEAD
          <div className="upload-recipe-form-group">
            <label htmlFor="image" className="upload-recipe-label">
=======

          <div style={styles.formGroup}>
            <label htmlFor="image" style={styles.label}>
>>>>>>> b097114 (Add upload recipe ingredients field and other fixes)
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="upload-recipe-input"
              required
            />
          </div>
<<<<<<< HEAD
          <div className="upload-recipe-form-group">
            <label htmlFor="directions" className="upload-recipe-label">
=======

          <div style={styles.formGroup}>
            <label htmlFor="directions" style={styles.label}>
>>>>>>> b097114 (Add upload recipe ingredients field and other fixes)
              Directions
            </label>
            <textarea
              id="directions"
              name="directions"
              placeholder="Enter the directions"
              value={formData.directions}
              onChange={handleChange}
              className="upload-recipe-textarea-darker"
              required
            />
          </div>
<<<<<<< HEAD
          <button type="submit" className="upload-recipe-button">
=======

          <button type="submit" style={styles.button}>
>>>>>>> b097114 (Add upload recipe ingredients field and other fixes)
            Upload Recipe
          </button>
        </form>
      </div>
      {message && (
        <div
          className={`upload-recipe-message ${
            message.type === 'success'
              ? 'upload-recipe-success-message'
              : 'upload-recipe-error-message'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default UploadRecipeForm;
