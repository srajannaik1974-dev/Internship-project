import React from 'react';
import RiskBadge from './RiskBadge';
import { CheckCircle2, Sparkles, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FoodAnalysisCard = ({ analysisResult, onReset }) => {
  const navigate = useNavigate();

  if (!analysisResult) return null;

  return (
    <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Success Notification Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#15803d',
        fontWeight: 700,
        padding: '0.85rem 1.25rem',
        backgroundColor: '#dcfce7',
        border: '1px solid #86efac',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.95rem'
      }}>
        <CheckCircle2 size={22} style={{ color: '#16a34a', flexShrink: 0 }} />
        <span>Successfully logged for {analysisResult.meal_type || 'Meal'}! Home timeline updated.</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {analysisResult.meal_type || 'Meal'}
          </span>
          <h2 className="h2-heading" style={{ marginTop: '0.2rem' }}>
            {analysisResult.food_name || 'Analyzed Food'}
          </h2>
        </div>

        <RiskBadge level={analysisResult.wellness_level} />
      </div>

      {analysisResult.analysis && (
        <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} style={{ color: 'var(--primary)' }} />
            Nutritional & Wellness Analysis
          </h4>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {analysisResult.analysis === 'N/A' 
              ? 'N/A — Specific food item not identified. Please specify the exact dish (e.g., Gulab Jamun, Samosa, Apple) or upload a photo for detailed analysis.'
              : analysisResult.analysis
            }
          </p>
        </div>
      )}

      {analysisResult.suggestion && (
        <div style={{ backgroundColor: 'var(--primary-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-soft)' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.4rem' }}>
            Smart Wellness Recommendation
          </h4>
          <p style={{ fontSize: '0.925rem', color: '#166534', lineHeight: 1.6 }}>
            {analysisResult.suggestion === 'N/A'
              ? 'N/A — Specify a detailed food item to receive personalized wellness suggestions.'
              : analysisResult.suggestion
            }
          </p>
        </div>
      )}

      {analysisResult.estimated_nutrition && (
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Estimated Nutrition Breakdown
          </h4>
          <div className="grid-4" style={{ gap: '0.75rem' }}>
            {Object.entries(analysisResult.estimated_nutrition).map(([key, val]) => {
              const unit = key === 'calories' ? 'kcal' : 'g';
              const label = key === 'carbohydrates' ? 'carbs' : key;
              return (
                <div key={key} style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {label}
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                    {val}<span style={{ fontSize: '0.7rem', fontWeight: 500, marginLeft: '2px', color: 'var(--text-muted)' }}>{unit}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/dashboard')}
          style={{ flex: 1, minWidth: '200px' }}
        >
          <Home size={18} />
          <span>Done & Go to Home Timeline</span>
        </button>

        {onReset && (
          <button
            className="btn btn-secondary btn-lg"
            onClick={onReset}
            style={{ flex: 1, minWidth: '180px' }}
          >
            <RefreshCw size={18} />
            <span>Log Another Food</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodAnalysisCard;
