import React, { useRef } from 'react';
import { Camera, ShieldCheck, X, RefreshCw } from 'lucide-react';

const FoodUpload = ({ imageFile, imagePreview, setImageFile, setImagePreview }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fu-wrapper">
      <label className="fu-label">Capture Food Image (Optional)</label>

      {/* Hidden file input — camera capture on mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        id="food-image-input"
      />

      {imagePreview ? (
        <div className="fu-preview-box">
          <img src={imagePreview} alt="Food Preview" className="fu-preview-img" />
          <div className="fu-preview-actions">
            <button
              type="button"
              className="btn btn-sm btn-secondary fu-action-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Change image"
            >
              <RefreshCw size={13} />
              Change
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger fu-action-btn"
              onClick={handleRemoveImage}
              title="Remove image"
            >
              <X size={13} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className="fu-camera-box"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <div className="fu-camera-icon">
            <Camera size={22} />
          </div>
          <p className="fu-camera-title">Click a photo</p>
          <p className="fu-camera-sub">Use your camera to take a picture</p>
        </div>
      )}

      {/* Privacy note */}
      <div className="fu-privacy">
        <ShieldCheck size={14} style={{ color: '#10b981', flexShrink: 0 }} />
        <span>We don't store your images. They're only used for your food insights.</span>
      </div>
    </div>
  );
};

export default FoodUpload;
