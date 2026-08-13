import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({
  message = "Something went wrong. Please try again.",
  onRetry = null
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem',
      textAlign: 'center',
      backgroundColor: '#fef2f2',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid #fecaca',
      width: '100%'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.75rem'
      }}>
        <AlertCircle size={24} />
      </div>
      <p style={{
        fontSize: '0.925rem',
        fontWeight: 600,
        color: '#991b1b',
        maxWidth: '420px',
        marginBottom: onRetry ? '1rem' : '0'
      }}>
        {message}
      </p>
      {onRetry && (
        <button className="btn btn-sm btn-danger" onClick={onRetry}>
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
