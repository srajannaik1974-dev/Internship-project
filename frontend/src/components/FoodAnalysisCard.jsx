import React, { useState } from 'react';
import RiskBadge from './RiskBadge';
import { Sparkles, CheckCircle2, BookmarkPlus, ArrowRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FoodAnalysisCard = ({ analysisResult, onAddToDiary }) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!analysisResult) return null;

  const {
    food_name = 'Food Item',
    wellness_level = 'Low Concern',
    analysis = '',
    suggestion = '',
    estimated_nutrition = null
  } = analysisResult;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onAddToDiary(analysisResult);
      setIsSaved(true);
    } catch (err) {
      console.error('Failed to save meal:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card animate-fade-in" style={{
      borderLeft: '4px solid var(--primary)',
      padding: '1.75rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, uppercase: true, color: 'var(--primary)', letterSpacing: '0.05em' }}>
              AI Wellness Analysis
            </span>
          </div>
          <h2 className="h2-heading">{food_name}</h2>
        </div>

        <RiskBadge level={wellness_level} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Analysis section */}
        <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Analysis
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            "{analysis}"
          </p>
        </div>

        {/* Suggestion section */}
        {suggestion && (
          <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #b8e9d0' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Wellness Suggestion
            </p>
            <p style={{ fontSize: '0.95rem', color: '#176543', lineHeight: 1.5 }}>
              "{suggestion}"
            </p>
          </div>
        )}

        {/* Nutrition section */}
        {estimated_nutrition && (
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={16} />
              <span>Estimated Nutrition (Approx.)</span>
            </p>
            <div className="grid-4" style={{ gap: '0.75rem' }}>
              {Object.entries(estimated_nutrition).map(([key, val]) => (
                <div key={key} style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  border: '1px solid var(--border-color)'
                }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {key}
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions section */}
        <div style={{
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {!isSaved ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  <span>Saving to your food diary...</span>
                </>
              ) : (
                <>
                  <BookmarkPlus size={18} />
                  <span>Add to Food Diary</span>
                </>
              )}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}>
                <CheckCircle2 size={20} />
                Food added to your diary.
              </span>
              <button
                className="btn btn-outline"
                onClick={() => navigate('/diary')}
              >
                <span>View Food Diary</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodAnalysisCard;
