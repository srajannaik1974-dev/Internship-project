import React, { useState } from 'react';
import RiskBadge from './RiskBadge';
import { CheckCircle2, PlusCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FoodAnalysisCard = ({ analysisResult, onAddToDiary }) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!analysisResult) return null;

  const handleAdd = async () => {
    setIsSaving(true);
    try {
      if (onAddToDiary) {
        await onAddToDiary(analysisResult);
      }
      setSavedSuccess(true);
      setTimeout(() => {
        navigate('/diary');
      }, 1200);
    } catch (err) {
      console.error('Failed to save to diary:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            {analysisResult.analysis}
          </p>
        </div>
      )}

      {analysisResult.suggestion && (
        <div style={{ backgroundColor: 'var(--primary-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-soft)' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.4rem' }}>
            Smart Wellness Recommendation
          </h4>
          <p style={{ fontSize: '0.925rem', color: '#166534', lineHeight: 1.6 }}>
            {analysisResult.suggestion}
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

      {savedSuccess ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 700, justifyContent: 'center', padding: '0.75rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
          <CheckCircle2 size={20} />
          <span>Saved to Food Diary! Redirecting...</span>
        </div>
      ) : (
        <button
          className="btn btn-primary btn-lg"
          onClick={handleAdd}
          disabled={isSaving}
          style={{ marginTop: '0.5rem' }}
        >
          {isSaving ? (
            <span>Saving...</span>
          ) : (
            <>
              <PlusCircle size={18} />
              <span>Save to Food Diary</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default FoodAnalysisCard;
