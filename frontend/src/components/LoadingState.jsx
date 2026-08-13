import React from 'react';

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      textAlign: 'center',
      gap: '1rem',
      width: '100%'
    }}>
      <div className="spinner" />
      <p style={{
        fontSize: '0.925rem',
        color: 'var(--text-muted)',
        fontWeight: 500
      }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingState;
