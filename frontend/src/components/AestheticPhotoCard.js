// src/components/AestheticPhotoCard.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Import photos dynamically. You'll need to adjust the paths based on your file names.
// A more robust way would be to create a simple index file for assets.
const photoContext = require.context('../assets/images/brinda', false, /\.(png|jpe?g|svg)$/);
const photoKeys = photoContext.keys();

const PhotoWrapper = styled.div`
  width: 100%;
  padding-top: 100%; /* Creates a perfect square container */
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  
  /* Aesthetic touch: soft border */
  border: 3px solid var(--secondary-color); 
`;

const StyledImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the photo covers the square without distortion */
  opacity: 0.9; /* Subtle transparency for minimalism */
  transition: opacity 0.3s ease;
`;

const AestheticPhotoCard = () => {
    const [currentPhoto, setCurrentPhoto] = useState('');

    useEffect(() => {
        if (photoKeys.length > 0) {
            // Pick a random photo key
            const randomKey = photoKeys[Math.floor(Math.random() * photoKeys.length)];
            // Load the image path
            const imagePath = photoContext(randomKey);
            setCurrentPhoto(imagePath);
        }
    }, []);

    if (!currentPhoto) return null; // Don't render if no photos are found

    return (
        <PhotoWrapper>
            <StyledImage src={currentPhoto} alt="Personalized Photo" />
        </PhotoWrapper>
    );
};

export default AestheticPhotoCard;