import React from 'react';
import { Search, Sun, Hash } from 'lucide-react';

const FoodInput = ({
  foodDescription,
  setFoodDescription,
  mealType,
  setMealType,
  quantity,
  setQuantity,
  errors = {}
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* What are you eating? Input */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label" htmlFor="food-desc-input" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          What are you eating? *
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search
            size={19}
            style={{
              position: 'absolute',
              left: '1rem',
              color: '#9ca3af',
              pointerEvents: 'none'
            }}
          />
          <input
            id="food-desc-input"
            type="text"
            className="form-input"
            placeholder="I'm eating a samosa"
            value={foodDescription}
            onChange={(e) => setFoodDescription(e.target.value)}
            style={{
              paddingLeft: '2.8rem',
              paddingRight: '2.8rem',
              height: '50px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              fontSize: '0.95rem',
              backgroundColor: '#ffffff'
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '1rem',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            title="Audio / Voice waveform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4" />
            </svg>
          </div>
        </div>
        {errors.foodDescription && <span className="form-error">{errors.foodDescription}</span>}
      </div>

      {/* Meal Type + Quantity side-by-side */}
      <div className="meal-inputs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="meal-type-select" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Meal Type *
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Sun
              size={19}
              style={{
                position: 'absolute',
                left: '1rem',
                color: '#f97316',
                pointerEvents: 'none'
              }}
            />
            <select
              id="meal-type-select"
              className="form-select"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              style={{
                paddingLeft: '2.8rem',
                height: '50px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                fontSize: '0.95rem',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snack">Snack</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
          {errors.mealType && <span className="form-error">{errors.mealType}</span>}
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="quantity-input" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Quantity *
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Hash
              size={19}
              style={{
                position: 'absolute',
                left: '1rem',
                color: '#9ca3af',
                pointerEvents: 'none'
              }}
            />
            <input
              id="quantity-input"
              type="text"
              className="form-input"
              placeholder="e.g. 1 medium piece / 1 bowl"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                paddingLeft: '2.8rem',
                height: '50px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                fontSize: '0.95rem',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
          {errors.quantity && <span className="form-error">{errors.quantity}</span>}
        </div>
      </div>
    </div>
  );
};

export default FoodInput;
