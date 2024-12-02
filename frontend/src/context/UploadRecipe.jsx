import React from 'react';
import UploadRecipeForm from './UploadRecipeForm';

const UploadRecipe = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url("https://i.pinimg.com/originals/19/68/b0/1968b06afc1ef281a748c9b307e39f06.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
        padding: '0',
        margin: '0',
      }}
    >
      <UploadRecipeForm />
    </div>
  );
};

export default UploadRecipe;
