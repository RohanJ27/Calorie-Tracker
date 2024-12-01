import React, { useState } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
import { useNavigate } from 'react-router-dom'; 
>>>>>>> main

const UploadRecipeForm = () => {
  const [formData, setFormData] = useState({
    label: '',
    ingredients: '',
    calories: '',
    dietLabels: '',
    healthLabels: '',
<<<<<<< HEAD
    image: null, // Store file object
    directions: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] }); // Ensure file is stored
    } else {
      setFormData({ ...formData, [name]: value });
    }
=======
    image: '',
    directions: '', // Add directions to state
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
>>>>>>> main
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

    const form = new FormData();
    form.append('label', formData.label);

    // Append ingredients as JSON string
    form.append(
      'ingredients',
      JSON.stringify(formData.ingredients.split(',').map(item => item.trim()))
    );

    form.append('calories', formData.calories);

    // Append each diet label separately
    if (formData.dietLabels.trim()) {
      formData.dietLabels
        .split(',')
        .map(item => item.trim())
        .forEach(label => {
          form.append('dietLabels', label);
        });
    }

    // Append each health label separately
    if (formData.healthLabels.trim()) {
      formData.healthLabels
        .split(',')
        .map(item => item.trim())
        .forEach(label => {
          form.append('healthLabels', label);
        });
    }

    form.append('directions', formData.directions);

    if (formData.image) form.append('image', formData.image); // Append image if selected

    // Debugging: Log FormData entries
    for (let pair of form.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debugging: Check if token is retrieved

      if (!token) {
        alert('You must be logged in to upload a recipe.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/recipes/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the token is sent in the headers
          // **Important:** Do NOT set 'Content-Type' header when sending FormData
        },
        body: form, // FormData will automatically handle multipart form data
      });

      if (response.ok) {
        alert('Recipe uploaded successfully!');
        // Redirect or show success message here
        navigate('/profile'); // Example: redirect to profile page
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          const errorMessages = errorData.errors.map(err => err.msg).join(', ');
          alert(`Error: ${errorMessages}`);
        } else {
          alert(`Error: ${errorData.error || 'Failed to upload recipe'}`);
        }
=======
  
    // Format the data before sending it to the backend
    const formattedData = {
      ...formData,
      ingredients: formData.ingredients.split(',').map((item) => item.trim()),
      dietLabels: formData.dietLabels.split(',').map((item) => item.trim()),
      healthLabels: formData.healthLabels.split(',').map((item) => item.trim()),
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/recipes/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is present
        },
        body: JSON.stringify(formattedData),
      });
  
      if (response.ok) {
        alert('Recipe uploaded successfully!');
        navigate('/profile'); // Redirect to profile after successful upload
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to upload recipe'}`);
>>>>>>> main
      }
    } catch (error) {
      console.error('Error uploading recipe:', error);
      alert('An error occurred while uploading the recipe.');
    }
  };
<<<<<<< HEAD

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      style={{ maxWidth: '500px', margin: '0 auto' }}
    >
=======
  
  

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
>>>>>>> main
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
<<<<<<< HEAD
        type="file"
        name="image"
        onChange={handleChange}
        required
=======
        type="text"
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
>>>>>>> main
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
