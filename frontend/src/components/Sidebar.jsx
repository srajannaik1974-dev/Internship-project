import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, BookOpen, User, Leaf } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Log Food', path: '/analyze', icon: Sparkles },
    { label: 'Food Diary', path: '/diary', icon: BookOpen },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="desktop-sidebar" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: 'var(--sidebar-width)',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #f3e5dc',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.75rem 1.25rem',
      zIndex: 90
    }}>
      <div>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          padding: '0.25rem 0.5rem 1.75rem 0.5rem',
          borderBottom: '1px solid #f3e5dc',
          marginBottom: '1.75rem'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#ff5722',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(255, 87, 34, 0.3)'
          }}>
            <Leaf size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              NutriMind
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, marginTop: '0.1rem' }}>
              AI Food & Wellness
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ff5722' : '#4b5563',
                  backgroundColor: isActive ? '#fff2eb' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                })}
              >
                <Icon size={20} style={{ color: item.path === '/analyze' ? '#ff5722' : 'inherit' }} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
