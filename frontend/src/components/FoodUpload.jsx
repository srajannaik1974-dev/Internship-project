import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, ShieldCheck, X, RefreshCw, RotateCcw, VideoOff, AlertCircle } from 'lucide-react';

const FoodUpload = ({ imageFile, imagePreview, setImageFile, setImagePreview }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [isFlashActive, setIsFlashActive] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Bind video stream once the <video> element is mounted in DOM
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.error('Error playing video stream:', err);
      });
    }
  }, [isCameraActive]);

  // Start camera stream with fallback constraints
  const startCamera = async (mode = facingMode) => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode } },
        });
      } catch (e) {
        // Fallback to basic camera request without constraints
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access permission was denied. Please grant permission in browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. Please select an image file instead.');
      } else {
        setCameraError(err.message || 'Unable to access camera.');
      }
      setIsCameraActive(false);
    }
  };

  // Flip between front and back camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture snapshot from live video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvasRef.current = canvas;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    // Trigger visual flash feedback
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `food_snapshot_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
          setImageFile(file);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          setImagePreview(dataUrl);

          // Stop camera once captured
          stopCamera();
        }
      },
      'image/jpeg',
      0.92
    );
  };

  // Handle standard file selection
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

  // Remove preview and reset state
  const handleRemoveImage = (e) => {
    if (e) e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fu-wrapper">
      <label className="fu-label">Capture Food Image (Optional)</label>

      {/* Hidden file input fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        id="food-image-input"
      />

      {/* Hidden canvas for capturing video frame */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* VIEW 1: Image Captured Preview */}
      {imagePreview ? (
        <div className="fu-preview-box">
          <img src={imagePreview} alt="Food Preview" className="fu-preview-img" />
          <div className="fu-preview-actions">
            <button
              type="button"
              className="btn btn-sm btn-secondary fu-action-btn"
              onClick={() => startCamera()}
              title="Retake photo using live camera"
            >
              <Camera size={13} />
              Retake Camera
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary fu-action-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload image from file"
            >
              <Upload size={13} />
              Upload File
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
      ) : isCameraActive ? (
        /* VIEW 2: Live Camera Viewfinder */
        <div className={`fu-camera-viewfinder ${isFlashActive ? 'fu-flash' : ''}`}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="fu-video-stream"
          />

          <div className="fu-camera-badge">
            <span className="fu-live-dot"></span> LIVE CAMERA
          </div>

          <div className="fu-camera-controls">
            <button
              type="button"
              className="fu-ctrl-btn fu-btn-flip"
              onClick={toggleFacingMode}
              title="Switch camera"
            >
              <RotateCcw size={18} />
            </button>

            <button
              type="button"
              className="fu-btn-snap"
              onClick={capturePhoto}
              title="Click to take photo"
            >
              <div className="fu-btn-snap-inner">
                <Camera size={24} />
              </div>
            </button>

            <button
              type="button"
              className="fu-ctrl-btn fu-btn-close"
              onClick={stopCamera}
              title="Close camera"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* VIEW 3: Initial Camera / Upload Launcher Box */
        <div className="fu-launch-card">
          {cameraError && (
            <div className="fu-camera-error">
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{cameraError}</span>
            </div>
          )}

          <div className="fu-actions-grid">
            {/* Primary Action: Open Live Camera */}
            <button
              type="button"
              className="fu-main-camera-btn"
              onClick={() => startCamera()}
            >
              <div className="fu-icon-ring">
                <Camera size={26} />
              </div>
              <div className="fu-btn-text">
                <span className="fu-btn-title">Open Live Camera</span>
                <span className="fu-btn-sub">Click to open camera & snap food instantly</span>
              </div>
            </button>

            </div>
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

