import React from 'react';

const RiskBadge = ({ level = 'Low Concern' }) => {
  const getBadgeDetails = (wellnessLevel) => {
    switch (wellnessLevel?.toLowerCase()) {
      case 'low concern':
      case 'good':
      case 'healthy':
        return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', icon: '🟢', label: level || 'Low Concern' };
      case 'moderate concern':
      case 'moderate':
        return { bg: '#fffbeb', text: '#b45309', border: '#fde68a', icon: '🟡', label: level || 'Moderate Concern' };
      case 'high concern':
      case 'unhealthy':
        return { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', icon: '🔴', label: level || 'High Concern' };
      case 'n/a':
      case 'na':
        return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb', icon: '⚪', label: 'N/A' };
      default:
        return { bg: 'var(--bg-subtle)', text: 'var(--text-muted)', border: 'var(--border-color)', icon: '⚪', label: level };
    }
  };

  const details = getBadgeDetails(level);

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.3rem 0.85rem',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.825rem',
      fontWeight: 700,
      backgroundColor: details.bg,
      color: details.text,
      border: `1px solid ${details.border}`,
      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      transition: 'all 0.2s ease-in-out'
    }}>
      <span style={{ fontSize: '0.65rem' }}>{details.icon}</span>
      <span>{details.label}</span>
    </span>
  );
};

export default RiskBadge;
