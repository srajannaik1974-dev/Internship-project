import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, BookOpen, User } from 'lucide-react';

const MobileNav = () => {
  const navItems = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Analyze', path: '/analyze', icon: Sparkles },
    { label: 'Diary', path: '/diary', icon: BookOpen },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="mobile-nav-bar">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
