import React from 'react';
import { Leaf, Menu } from 'lucide-react';

const MobileHeader = ({ userName = 'Chashmitha', onMenuOpen }) => {
  const initial = (userName || 'U').charAt(0).toUpperCase();

  return (
    <header className="mobile-app-header">
      <button
        className="mobile-app-header__menu-btn"
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>

      <div className="mobile-app-header__brand">
        <div className="mobile-app-header__logo-icon">
          <Leaf size={16} />
        </div>
        <span className="mobile-app-header__logo-text">NutriMind</span>
      </div>

      <div className="mobile-app-header__avatar" title={userName}>
        {initial}
      </div>
    </header>
  );
};

export default MobileHeader;
