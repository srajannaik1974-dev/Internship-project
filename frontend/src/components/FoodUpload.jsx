import React, { useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';

const FoodUpload = ({
  imageFile,
  imagePreview,
  setImageFile,
  setImagePreview
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        Optional Food Image
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {!imagePreview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--bg-subtle)',
            transition: 'border-color 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            <Camera size={24} />
            <Upload size={24} />
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Upload or capture photo of your meal
          </p>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Supports JPG, PNG, WEBP
          </p>
        </div>
      ) : (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={imagePreview}
            alt="Food preview"
            style={{
              width: '100%',
              maxHeight: '220px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodUpload;
