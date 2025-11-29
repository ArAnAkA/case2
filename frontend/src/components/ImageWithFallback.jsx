// src/components/ImageWithFallback.jsx
import React, { useState } from 'react';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className, 
  fallback = '/skins/fallback.jpg',
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (e) => {
    console.warn(`❌ Image failed to load: ${src}, using fallback`);
    setHasError(true);
    setIsLoading(false);
    e.target.src = fallback;
  };

  const handleLoad = (e) => {
    console.log(`✅ Image loaded successfully: ${src}`);
    setIsLoading(false);
  };

  return (
    <div className="image-container">
      {isLoading && (
        <div className="image-loading">Загрузка...</div>
      )}
      <img 
        src={hasError ? fallback : src} 
        alt={alt} 
        className={`${className} ${isLoading ? 'image-hidden' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;