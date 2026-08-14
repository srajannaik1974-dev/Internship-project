import React, { useEffect } from 'react';
import Header from '../components/Header';
import DailyInsight from '../components/DailyInsight';
import MealCard from '../components/MealCard';
import ProfileCard from '../components/ProfileCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import { getProfile, getTodaysFood, getDailyInsight, getStoredUser } from '../services/api';
import { PlusCircle, Utensils, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: profile, loading: profileLoading, error: profileError } = useApi(getProfile, true);
  const { data: todaysMeals, loading: mealsLoading, error: mealsError, execute: refreshMeals } = useApi(getTodaysFood, true);
  const { data: insight, loading: insightLoading } = useApi(getDailyInsight, true);
  const storedUser = getStoredUser();


  const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

  const getMealForType = (type) => {
    if (!todaysMeals) return null;
    return todaysMeals.find(m => (m.meal_type || '').toLowerCase() === type.toLowerCase());
  };

  const loggedCount = todaysMeals ? todaysMeals.length : 0;

  return (
    <div className="animate-fade-in">
      <Header userName={profile?.name || storedUser?.name || 'User'} />

      {/* Profile Overview Banner */}
      {profileLoading ? (
        <LoadingState message="Loading your wellness profile..." />
      ) : profileError ? (
        <ErrorState message="Could not load profile. Using local mode." />
      ) : (
        <div style={{ marginBottom: '1.75rem' }}>
          <ProfileCard profile={profile} />
        </div>
      )}

      {/* Today's Insight Widget */}
      <div style={{ marginBottom: '1.75rem' }}>
        <DailyInsight insight={insight} />
      </div>

      {/* Today's Meal Summary Header & Quick Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <h2 className="h2-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={20} style={{ color: 'var(--primary)' }} />
            <span>Today's Meals</span>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {loggedCount} Logged
            </span>
          </h2>
          <p className="subtitle">
            Track your daily nutrition timeline and wellness statuses.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/analyze')}
        >
          <PlusCircle size={18} />
          <span>+ Log Food</span>
        </button>
      </div>

      {/* Meal Type Progress Tracker */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }}>
          Meals Logged Today
        </p>
        <div className="grid-4" style={{ gap: '0.75rem' }}>
          {mealTypes.map((type) => {
            const loggedMeal = getMealForType(type);
            const isLogged = !!loggedMeal;
            return (
              <div
                key={type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isLogged ? 'var(--primary-light)' : 'var(--bg-subtle)',
                  border: isLogged ? '1px solid var(--color-primary-soft)' : '1px solid var(--border-color)',
                  color: isLogged ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                {isLogged ? (
                  <CheckCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                ) : (
                  <Clock size={18} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
                )}
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: isLogged ? 'var(--primary)' : 'var(--text-main)' }}>
                    {type}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: isLogged ? 'var(--color-primary)' : 'var(--text-light)' }}>
                    {isLogged ? (loggedMeal.food_name || 'Logged') : 'Not logged'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Meal Cards Grid */}
      {mealsLoading ? (
        <LoadingState message="Loading today's logged meals..." />
      ) : mealsError ? (
        <ErrorState message={mealsError} onRetry={refreshMeals} />
      ) : !todaysMeals || todaysMeals.length === 0 ? (
        <EmptyState
          title="No meals logged today"
          description="You haven't logged any meals yet today. Click below to analyze and log your food."
          actionText="Log Your First Meal"
          actionLink="/analyze"
        />
      ) : (
        <div className="grid-3">
          {todaysMeals.map((meal) => (
            <MealCard
              key={meal.id || meal._id}
              meal={meal}
              onClick={() => navigate('/diary')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
