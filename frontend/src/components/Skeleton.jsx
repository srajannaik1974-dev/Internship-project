import React from 'react';

export const SkeletonBox = ({ width = '100%', height = '20px', borderRadius = '8px', className = '' }) => (
  <div 
    className={`skeleton-loader ${className}`}
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: 'var(--border-color, #e5e7eb)',
      backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)',
      backgroundSize: '200% 100%',
      animation: 'skeletonShimmer 1.5s infinite'
    }}
  />
);

export const DashboardSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
    <SkeletonBox height="140px" borderRadius="16px" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
      <SkeletonBox height="180px" borderRadius="16px" />
      <SkeletonBox height="180px" borderRadius="16px" />
    </div>
  </div>
);

export default SkeletonBox;
