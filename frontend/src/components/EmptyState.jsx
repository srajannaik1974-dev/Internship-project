import React from 'react';
import { Inbox, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({
  title = "No items found",
  description = "Get started by adding your first entry.",
  actionText = null,
  actionLink = null,
  onAction = null,
  icon: CustomIcon = null
}) => {
  const navigate = useNavigate();
  const IconComponent = CustomIcon || Inbox;

  const handleActionClick = () => {
    if (onAction) {
      onAction();
    } else if (actionLink) {
      navigate(actionLink);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3.5rem 1.5rem',
      textAlign: 'center',
      backgroundColor: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-color)',
      width: '100%'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        <IconComponent size={28} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '380px', marginBottom: actionText ? '1.25rem' : '0' }}>
        {description}
      </p>
      {actionText && (
        <button className="btn btn-primary" onClick={handleActionClick}>
          <PlusCircle size={16} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
