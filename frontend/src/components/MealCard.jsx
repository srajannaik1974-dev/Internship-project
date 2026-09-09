import React from 'react';
import RiskBadge from './RiskBadge';
import { Clock, Utensils } from 'lucide-react';

const MealCard = ({ meal, onClick = null }) => {
  if (!meal) return null;

  const foodName = meal.food_name || meal.name || 'Logged Food';
  const rawMealType = meal.meal_type || meal.category || meal.mealType || 'Meal';
  const mealType = rawMealType.charAt(0).toUpperCase() + rawMealType.slice(1);
  const time = meal.time || 'Logged';
  const wellnessLevel = meal.wellness_level || 'Low Concern';
  const calories = meal.calories || meal.estimated_nutrition?.calories;
  const portion = meal.portion || meal.quantity;
  const analysis = meal.analysis || (calories ? `${calories} kcal${portion ? ` • ${portion}` : ''}` : '');

  return (
    <div
      className={`card card-hover ${onClick ? 'interactive' : ''}`}
      onClick={onClick}
      style={{
        padding: '1.25rem',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        gap: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            <Utensils size={13} />
            <span style={{ fontWeight: 600 }}>{mealType}</span>
            <span>•</span>
            <Clock size={13} />
            <span>{time}</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {foodName}
          </h3>
        </div>
        <RiskBadge level={wellnessLevel} />
      </div>

      {analysis && (
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4
        }}>
          {analysis}
        </p>
      )}
    </div>
  );
};

export default MealCard;
