import React from 'react';

const Header = ({ userName = 'Chashmitha' }) => {
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = userName || 'User';

  return (
    <header style={{
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
      width: '100%',
      maxWidth: '100%'
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 className="h1-heading" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          flexWrap: 'wrap',
          wordBreak: 'break-word',
          width: '100%'
        }}>
          <span>{getGreetingTime()}, {displayName}</span>
          <span style={{ fontSize: '1.5rem' }}>👋</span>
        </h1>
        <p className="subtitle" style={{ wordBreak: 'break-word' }}>
          Let's make today's food choices a little smarter.
        </p>
      </div>

      <div className="header-user-pill" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: 'var(--bg-card)',
        padding: '0.4rem 0.85rem',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        flexShrink: 0
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem'
        }}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {displayName}
        </span>
      </div>
    </header>
  );
};

export default Header;
