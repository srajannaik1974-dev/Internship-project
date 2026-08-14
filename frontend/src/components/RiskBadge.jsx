import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

const RiskBadge = ({ level = 'Low Concern' }) => {
  let badgeClass = 'low';
  let Icon = ShieldCheck;
  let label = level;

  const normalized = (level || '').toLowerCase();

  if (normalized.includes('moderate')) {
    badgeClass = 'moderate';
    Icon = AlertTriangle;
    label = 'Moderate Concern';
  } else if (normalized.includes('high')) {
    badgeClass = 'higher';
    Icon = AlertCircle;
    label = 'Higher Concern';
  } else {
    badgeClass = 'low';
    Icon = ShieldCheck;
    label = 'Low Concern';
  }

  return (
    <span className={`risk-badge ${badgeClass}`}>
      <Icon size={14} />
      <span>{label}</span>
    </span>
  );
};

export default RiskBadge;
