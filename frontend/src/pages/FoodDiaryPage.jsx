import React, { useState } from 'react';
import MealCard from '../components/MealCard';
import RiskBadge from '../components/RiskBadge';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { useApi } from '../hooks/useApi';
import { getFoodHistory, deleteFoodEntry } from '../services/api';
import { BookOpen, ChevronLeft, ChevronRight, Calendar, X, Trash2, Utensils, Clock, Sparkles, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FoodDiaryPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMealDetail, setSelectedMealDetail] = useState(null);

  const { data: foodHistory, loading, error, execute: refreshHistory } = useApi(getFoodHistory, true);

  const formatDateString = (dateObj) => {
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toISODateString = (dateObj) => {
    return dateObj.toISOString().split('T')[0];
  };

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food entry?')) {
      try {
        await deleteFoodEntry(id);
        setSelectedMealDetail(null);
        refreshHistory();
      } catch (err) {
        alert('Failed to delete entry.');
      }
    }
  };

  const currentISODate = toISODateString(selectedDate);
  const isToday = currentISODate === toISODateString(new Date());

  // Safely extract meals array regardless of backend payload structure ({ success, data: [...] } vs [...])
  const mealsList = Array.isArray(foodHistory)
    ? foodHistory
    : (Array.isArray(foodHistory?.data) ? foodHistory.data : []);

  // Filter history by selected date or show all if date matches
  const filteredMeals = mealsList.filter(item => {
    if (!item) return false;
    const itemDate = item.createdAt ? item.createdAt.split('T')[0] : (item.date || '');
    return !itemDate || itemDate === currentISODate;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}>
      {/* ── Premium Food Diary Banner ── */}
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '1.25rem',
        minHeight: 'clamp(120px, 22vw, 160px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 'clamp(1.25rem, 4vw, 2rem) clamp(1rem, 5vw, 2.5rem)',
        boxShadow: '0 8px 32px rgba(233, 95, 28, 0.15)'
      }}>
        {/* Background image */}
        <img
          src="/food-diary-banner.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        {/* Dark gradient overlay for readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(105deg, rgba(20,10,5,0.75) 0%, rgba(20,10,5,0.48) 55%, rgba(20,10,5,0.18) 100%)'
        }} />

        {/* Text content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: 'clamp(1.2rem, 5vw, 1.75rem)',
            fontWeight: 800,
            color: '#ffffff',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            <BookOpen size={22} style={{ color: '#f97316', flexShrink: 0 }} />
            Food Diary
          </h1>
          <p style={{
            fontSize: 'clamp(0.78rem, 3vw, 0.95rem)',
            color: 'rgba(255,255,255,0.75)',
            margin: '0.35rem 0 0',
            fontWeight: 400,
            maxWidth: '32ch'
          }}>
            Keep track of what you've eaten and understand your food patterns.
          </p>
        </div>

      </div>

      {/* Date Navigation Bar */}
      <div className="card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        padding: '0.75rem 1rem',
        gap: '0.5rem'
      }}>
        <button
          className="btn btn-sm btn-secondary"
          onClick={handlePrevDay}
          style={{ flexShrink: 0, padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}
        >
          <ChevronLeft size={15} />
          <span className="fd-nav-label">Prev</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, justifyContent: 'center', minWidth: 0 }}>
          <Calendar size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {formatDateString(selectedDate)}
          </span>
          {!isToday && (
            <button
              onClick={handleToday}
              className="btn btn-sm btn-outline"
              style={{ flexShrink: 0, padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}
            >
              Today
            </button>
          )}
        </div>

        <button
          className="btn btn-sm btn-secondary"
          onClick={handleNextDay}
          style={{ flexShrink: 0, padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}
        >
          <span className="fd-nav-label">Next</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Content Section */}
      {loading ? (
        <LoadingState message="Loading your food history..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refreshHistory} />
      ) : filteredMeals.length === 0 ? (
        <EmptyState
          title="No meals logged for this date"
          description={`Your food diary is empty for ${formatDateString(selectedDate)}. Log a meal to get started.`}
          actionText="Log Food for Today"
          actionLink="/analyze"
        />
      ) : (
        <div>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Logged Meals ({filteredMeals.length})
          </p>
          <div className="grid-3">
            {filteredMeals.map((meal) => (
              <MealCard
                key={meal.id || meal._id}
                meal={meal}
                onClick={() => setSelectedMealDetail(meal)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedMealDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '1.5rem'
        }}>
          <div className="card animate-fade-in" style={{
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.75rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedMealDetail(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <Utensils size={16} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                {selectedMealDetail.meal_type}
              </span>
              <span style={{ color: 'var(--text-light)' }}>•</span>
              <Clock size={14} style={{ color: 'var(--text-light)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedMealDetail.time}</span>
            </div>

            <h2 className="h2-heading" style={{ marginBottom: '0.85rem' }}>
              {selectedMealDetail.food_name}
            </h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <RiskBadge level={selectedMealDetail.wellness_level} />
            </div>

            {selectedMealDetail.quantity && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <strong>Quantity:</strong> {selectedMealDetail.quantity}
              </p>
            )}

            {selectedMealDetail.analysis && (
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Analysis
                </p>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {selectedMealDetail.analysis}
                </p>
              </div>
            )}

            {selectedMealDetail.suggestion && (
              <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Wellness Suggestion
                </p>
                <p style={{ fontSize: '0.925rem', color: '#176543', lineHeight: 1.5 }}>
                  {selectedMealDetail.suggestion}
                </p>
              </div>
            )}

            {selectedMealDetail.estimated_nutrition && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Estimated Nutrition
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {Object.entries(selectedMealDetail.estimated_nutrition).map(([k, v]) => (
                    <div key={k} style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k}</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(selectedMealDetail.id || selectedMealDetail._id)}
              >
                <Trash2 size={14} />
                <span>Delete Entry</span>
              </button>

              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setSelectedMealDetail(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDiaryPage;
