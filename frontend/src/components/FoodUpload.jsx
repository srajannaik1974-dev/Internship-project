import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw } from 'lucide-react';

const FoodUpload = ({ imageFile, imagePreview, setImageFile, setImagePreview }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        Upload Food Image (Optional)
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        id="food-image-input"
      />

      {imagePreview ? (
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          maxHeight: '260px',
          backgroundColor: '#000000'
        }}>
          <img
            src={imagePreview}
            alt="Food Preview"
            style={{
              width: '100%',
              height: '240px',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              title="Change image"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(4px)' }}
            >
              <RefreshCw size={14} />
              <span>Change</span>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={handleRemoveImage}
              title="Remove image"
              style={{ backgroundColor: 'rgba(254, 242, 242, 0.9)', backdropFilter: 'blur(4px)' }}
            >
              <X size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--color-surface)',
            transition: 'all var(--transition-fast)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'var(--color-primary-soft)'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'var(--color-surface)'; }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <UploadCloud size={24} />
          </div>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Click to upload or drag & drop a photo
          </p>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Supports PNG, JPG, JPEG or WEBP (Max 5MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodUpload;
