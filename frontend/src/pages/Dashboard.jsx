import React, { useState } from 'react';
import Header from '../components/Header';
import MealCard from '../components/MealCard';
import { useApi } from '../hooks/useApi';
import { getTodaysFood, getStoredUser } from '../services/api';
import { Plus, Utensils, CheckCircle2, ArrowUpRight, Sunrise, Sun, Cookie, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [skippedMeals, setSkippedMeals] = useState([]);

  const { data: todaysMeals, loading: mealsLoading } = useApi(getTodaysFood, true);
  const storedUser = getStoredUser();
  const userName = storedUser?.name || 'there';

  const mealTypes = [
    { name: 'Breakfast', icon: Sunrise, color: 'morning' },
    { name: 'Lunch', icon: Sun, color: 'midday' },
    { name: 'Snack', icon: Cookie, color: 'snack' },
    { name: 'Dinner', icon: Moon, color: 'evening' }
  ];

  const mealsList = Array.isArray(todaysMeals)
    ? todaysMeals
    : Array.isArray(todaysMeals?.data)
    ? todaysMeals.data
    : [];

  const getMealForType = (type) => {
    return mealsList.find(m => (m.meal_type || m.mealType || m.type || '').toLowerCase() === type.toLowerCase()) || null;
  };

  const loggedCount = mealsList.length;
  const nextMeal = mealTypes.find(({ name }) => !getMealForType(name) && !skippedMeals.includes(name))?.name || 'All meals handled';
  const progress = Math.round(((loggedCount + skippedMeals.length) / mealTypes.length) * 100);

  return (
    <div className="dashboard-meals-page animate-fade-in">
      <Header userName={userName} />

      <section className="dashboard-meals-hero">
        <div>
          <p className="dashboard-kicker"><Utensils size={15} /> TODAY, {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase()}</p>
          <h1>Today's meals</h1>
          <p className="dashboard-meals-copy">Keep your day visible, one meal at a time.</p>
        </div>
        <div className="dashboard-hero-side">
          <div className="dashboard-hero-action">
            <button className="btn btn-primary dashboard-log-button" onClick={() => navigate('/analyze', { state: { mealType: nextMeal !== 'All meals handled' ? nextMeal : '' } })} disabled={nextMeal === 'All meals handled'}>
              <Plus size={18} /> Log meal
            </button>
          </div>
        </div>
      </section>

      <section className="dashboard-meal-board">
        <div className="dashboard-board-heading">
          <div>
            <h2><span className="dashboard-heading-mark"><Utensils size={16} /></span>Meal timeline</h2>
            <p>{loggedCount === 0 ? 'Nothing logged yet. Start with your next bite.' : `${loggedCount} meal${loggedCount === 1 ? '' : 's'} logged today.`}</p>
          </div>
          <span className="dashboard-count">{loggedCount}/4</span>
        </div>

        <div className="dashboard-progress-wrap">
          <div className="dashboard-progress-labels"><span>Daily rhythm</span><strong>{progress}% complete</strong></div>
          <div className="dashboard-progress-track"><span style={{ width: `${progress}%` }} /></div>
        </div>

        <div className="dashboard-meal-slots">
          {mealTypes.map(({ name, icon: MealIcon, color }) => {
            const loggedMeal = getMealForType(name);
            const isSkipped = skippedMeals.includes(name) && !loggedMeal;
            return (
              <div className={`dashboard-meal-slot dashboard-meal-slot--${color} ${loggedMeal ? 'is-logged' : ''} ${isSkipped ? 'is-skipped' : ''}`} key={name}>
                <div className="dashboard-meal-slot__icon">
                  <MealIcon size={18} />
                </div>
                <div>
                  <strong>{name}</strong>
                  <span>{loggedMeal ? (loggedMeal.food_name || loggedMeal.name || 'Logged meal') : isSkipped ? 'Skipped today' : 'Ready to log'}</span>
                </div>
                <span className="dashboard-meal-slot__status">{loggedMeal ? <CheckCircle2 size={15} /> : isSkipped ? '—' : null}</span>
              </div>
            );
          })}
        </div>

        {mealsLoading ? (
          <div className="dashboard-meal-empty">Loading today’s meals...</div>
        ) : mealsList.length === 0 ? (
          <div className="dashboard-meal-empty dashboard-meal-empty--ready">
            <div className="dashboard-empty-icon"><Utensils size={22} /></div>
            <h3>Your day starts here</h3>
            <p>Log breakfast, lunch, a snack, or dinner to build today’s meal timeline.</p>
            <div className="dashboard-empty-link"><ArrowUpRight size={15} /> Your next meal will appear here</div>
          </div>
        ) : (
          <div className="dashboard-logged-meals">
            {mealsList.map((meal) => <MealCard key={meal.id || meal._id} meal={meal} onClick={() => navigate('/diary')} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
