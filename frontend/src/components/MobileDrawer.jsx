import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, BookOpen, User, Leaf, X } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Analyze Food', path: '/analyze', icon: Sparkles },
  { label: 'Food Diary', path: '/diary', icon: BookOpen },
  { label: 'My Profile', path: '/profile', icon: User },
];

const MobileDrawer = ({ isOpen, onClose, userName = 'User' }) => {
  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Dimmed overlay — click to close */}
      <div
        className="mobile-drawer-overlay"
        onClick={onClose}
        aria-label="Close navigation"
      />

      {/* Drawer panel */}
      <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">
        {/* Drawer header */}
        <div className="mobile-drawer__header">
          <div className="mobile-drawer__brand">
            <div className="mobile-drawer__logo-icon">
              <Leaf size={20} />
            </div>
            <div>
              <p className="mobile-drawer__logo-name">NutriMind</p>
              <p className="mobile-drawer__logo-sub">AI Food &amp; Wellness</p>
            </div>
          </div>
          <button
            className="mobile-drawer__close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="mobile-drawer__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `mobile-drawer__nav-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User profile widget at bottom */}
        <div className="mobile-drawer__profile">
          <div className="mobile-drawer__avatar">
            {(userName || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="mobile-drawer__profile-name">{userName || 'User'}</p>
            <p className="mobile-drawer__profile-sub">Active Member</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
