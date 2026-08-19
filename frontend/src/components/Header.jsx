import React from 'react';

const Header = ({ userName = 'User' }) => {
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = userName || 'User';

  return (
    <header className="dashboard-header" style={{
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
      width: '100%',
      maxWidth: '100%'
    }}>
      <div className="header-copy" style={{ flex: 1, minWidth: 0 }}>
        <h1 className="h1-heading" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          flexWrap: 'wrap',
          wordBreak: 'break-word',
          width: '100%'
        }}>
          <span>{getGreetingTime()}, <span className="header-user-name">{displayName}</span></span>
        </h1>
        <p className="subtitle" style={{ wordBreak: 'break-word' }}>
          Let's make today's food choices a little smarter.
        </p>
      </div>

      <img
        className="header-food-image"
        src="/hero-food.png"
        alt="A colorful healthy meal with rice, lentils, and fresh vegetables"
      />

    </header>
  );
};

export default Header;
