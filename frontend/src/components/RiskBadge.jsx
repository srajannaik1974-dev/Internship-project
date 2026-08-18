import React from 'react';

const RiskBadge = ({ level = 'Low Concern' }) => {
  const getBadgeStyle = (wellnessLevel) => {
    switch (wellnessLevel?.toLowerCase()) {
      case 'low concern':
      case 'good':
      case 'healthy':
        return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
      case 'moderate concern':
      case 'moderate':
        return { bg: '#fef9c3', text: '#a16207', border: '#fef08a' };
      case 'high concern':
      case 'unhealthy':
        return { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' };
      default:
        return { bg: 'var(--bg-subtle)', text: 'var(--text-muted)', border: 'var(--border-color)' };
    }
  };

  const style = getBadgeStyle(level);

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.8rem',
      fontWeight: 700,
      backgroundColor: style.bg,
      color: style.text,
      border: `1px solid ${style.border}`
    }}>
      {level}
    </span>
  );
};

export default RiskBadge;
