import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, BookOpen, User, Leaf } from 'lucide-react';

const Sidebar = ({ userName = 'Chashmitha' }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Analyze Food', path: '/analyze', icon: Sparkles },
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
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1.25rem',
      zIndex: 90
    }}>
      <div>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 0.5rem 1.5rem 0.5rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            <Leaf size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              NutriMind
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              AI Food & Wellness
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.925rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Widget */}
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        border: '1px solid var(--border-color)'
      }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
          Your Wellness Profile
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem'
          }}>
            {(userName || 'U').charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {userName || 'User Profile'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
              Active Member
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
