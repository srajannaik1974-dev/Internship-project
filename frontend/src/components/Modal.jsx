import React from 'react';

const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        borderRadius: 'var(--radius-xl, 16px)',
        width: '100%',
        maxWidth: '440px',
        padding: '1.75rem',
        boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--border-color, #e5e7eb)',
        animation: 'fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {title && (
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main, #111827)' }}>
            {title}
          </h3>
        )}
        <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted, #4b5563)', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {children}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-md, 8px)',
              border: '1px solid var(--border-color, #d1d5db)',
              background: 'transparent',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-md, 8px)',
                border: 'none',
                backgroundColor: isDanger ? '#ef4444' : 'var(--accent-orange, #f47c45)',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
