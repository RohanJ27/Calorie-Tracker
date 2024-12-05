import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadRecipeForm.css'; 

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
          navigate('/'); 
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
    <div className="upload-recipe-form-container">
      <div className="upload-recipe-form-card">
        <h1 className="upload-recipe-form-title">Upload Recipe</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="upload-recipe-form-form">
          <div className="upload-recipe-form-form-group">
            <label htmlFor="label" className="upload-recipe-form-label">
              Recipe Name
            </label>
            <input
              type="text"
              id="label"
              name="label"
              placeholder="Enter the recipe name"
              value={formData.label}
              onChange={handleChange}
              className="upload-recipe-form-input"
              required
            />
          </div>

          <div className="upload-recipe-form-form-group">
            <label htmlFor="ingredients" className="upload-recipe-form-label">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              placeholder="Enter ingredients, comma-separated"
              value={formData.ingredients}
              onChange={handleChange}
              className="upload-recipe-form-textarea"
              required
            />
          </div>

          <div className="upload-recipe-form-form-group">
            <label htmlFor="calories" className="upload-recipe-form-label">
              Calories
            </label>
            <input
              type="number"
              id="calories"
              name="calories"
              placeholder="Enter calories"
              value={formData.calories}
              onChange={handleChange}
              className="upload-recipe-form-input"
              required
            />
          </div>

          <div className="upload-recipe-form-form-group">
            <label htmlFor="dietLabels" className="upload-recipe-form-label">
              Diet Labels
            </label>
            <input
              type="text"
              id="dietLabels"
              name="dietLabels"
              placeholder="Enter diet labels, comma-separated"
              value={formData.dietLabels}
              onChange={handleChange}
              className="upload-recipe-form-input"
              required
            />
          </div>

          <div className="upload-recipe-form-form-group">
            <label htmlFor="healthLabels" className="upload-recipe-form-label">
              Health Labels
            </label>
            <input
              type="text"
              id="healthLabels"
              name="healthLabels"
              placeholder="Enter health labels, comma-separated"
              value={formData.healthLabels}
              onChange={handleChange}
              className="upload-recipe-form-input"
              required
            />
          </div>

          <div className="upload-recipe-form-form-group">
            <label htmlFor="image" className="upload-recipe-form-label">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="upload-recipe-form-input"
              required
            />
          </div>

          <div className="upload-recipe-form-form-group">
            <label htmlFor="directions" className="upload-recipe-form-label">
              Directions
            </label>
            <textarea
              id="directions"
              name="directions"
              placeholder="Enter the directions"
              value={formData.directions}
              onChange={handleChange}
              className="upload-recipe-form-textarea-darker"
              required
            />
          </div>

          <button type="submit" className="upload-recipe-form-button">
            Upload Recipe
          </button>
        </form>
      </div>
      {message && (
        <div
          className={`upload-recipe-form-message ${
            message.type === 'success' ? 'upload-recipe-form-success-message' : 'upload-recipe-form-error-message'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default UploadRecipeForm;
