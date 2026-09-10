import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { bg: '#10b981', color: '#ffffff', icon: '✓' };
      case 'error':
        return { bg: '#ef4444', color: '#ffffff', icon: '✕' };
      case 'warning':
        return { bg: '#f59e0b', color: '#ffffff', icon: '⚠' };
      default:
        return { bg: '#3b82f6', color: '#ffffff', icon: 'ℹ' };
    }
  };

  const style = getTypeStyles();

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1.25rem',
      backgroundColor: style.bg,
      color: style.color,
      borderRadius: 'var(--radius-lg, 12px)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      fontWeight: 600,
      fontSize: '0.925rem',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{style.icon}</span>
      <span>{message}</span>
      <button 
        onClick={onClose} 
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: '0 0 0 0.5rem',
          fontSize: '1.1rem',
          opacity: 0.8
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
