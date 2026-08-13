import React from 'react';
import { Lightbulb } from 'lucide-react';

const DailyInsight = ({ insight = null }) => {
  const title = insight?.title || "Today's Insight";
  const text = insight?.text || "You have logged three meals today. Consider including vegetables and a protein source in your next meal.";

  return (
    <div className="card" style={{
      backgroundColor: '#FCE3D4',
      borderColor: '#F5C7AE',
      padding: '1.25rem 1.25rem',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        width: '100%',
        minWidth: 0
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#F47C45',
          color: '#FFFDF8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px var(--primary-glow)'
        }}>
          <Lightbulb size={20} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#E96832', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem', wordBreak: 'break-word' }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.925rem', color: '#211D1A', lineHeight: 1.5, fontWeight: 500, wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>
            "{text}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyInsight;
