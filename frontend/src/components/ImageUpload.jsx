import React, { useState } from 'react';
import { uploadImage } from '../services/api';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload, currentImage, label = "Загрузить изображение" }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Создаем preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setUploading(true);
    try {
      const response = await uploadImage(file);
      onImageUpload(response.data.url);
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      alert('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      )}
      
      <label className={`upload-label ${uploading ? 'uploading' : ''}`}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <div className="upload-content">
          {uploading ? (
            <>
              <div className="spinner"></div>
              <span>Загрузка...</span>
            </>
          ) : (
            <>
              <span className="upload-icon">📁</span>
              <span>{label}</span>
            </>
          )}
        </div>
      </label>
    </div>
  );
};

export default ImageUpload;