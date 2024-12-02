import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadRecipeForm = () => {
  const [formData, setFormData] = useState({
    label: '',
    ingredients: '',
    calories: '',
    dietLabels: '',
    healthLabels: '',
    image: null, // For file upload
    directions: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, image: files[0] })); // Store file
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert('Recipe uploaded successfully!');
        navigate('/profile');
      } else {
        const errorData = await response.json();
        console.error('Upload Error:', errorData);
        alert(`Error: ${errorData.error || 'Failed to upload recipe'}`);
      }
    } catch (error) {
      console.error('Error uploading recipe:', error);
      alert('An error occurred while uploading the recipe.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      style={{ maxWidth: '500px', margin: '0 auto' }}
    >
      <h1>Upload Recipe</h1>
      <input
        type="text"
        name="label"
        placeholder="Recipe Name"
        value={formData.label}
        onChange={handleChange}
        required
      />
      <textarea
        name="ingredients"
        placeholder="Ingredients (comma-separated)"
        value={formData.ingredients}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="calories"
        placeholder="Calories"
        value={formData.calories}
        onChange={handleChange}
      />
      <input
        type="text"
        name="dietLabels"
        placeholder="Diet Labels (comma-separated)"
        value={formData.dietLabels}
        onChange={handleChange}
      />
      <input
        type="text"
        name="healthLabels"
        placeholder="Health Labels (comma-separated)"
        value={formData.healthLabels}
        onChange={handleChange}
      />
      <input
        type="file"
        name="image"
        onChange={handleChange}
      />
      <textarea
        name="directions"
        placeholder="Write the directions for preparing the recipe"
        value={formData.directions}
        onChange={handleChange}
      />
      <button type="submit" style={{ marginTop: '10px' }}>Upload Recipe</button>
    </form>
  );
};

export default UploadRecipeForm;
