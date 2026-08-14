import React from 'react';
import { Utensils, Hash, Clock } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group">
        <label className="form-label" htmlFor="food-desc-input">
          What are you eating? *
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="food-desc-input"
            type="text"
            className="form-input"
            placeholder="I'm eating a samosa"
            value={foodDescription}
            onChange={(e) => setFoodDescription(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Utensils
            size={18}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)'
            }}
          />
        </div>
        {errors.foodDescription && <span className="form-error">{errors.foodDescription}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="meal-type-select">
            Meal Type *
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="meal-type-select"
              className="form-select"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snack">Snack</option>
              <option value="Dinner">Dinner</option>
            </select>
            <Clock
              size={18}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)',
                pointerEvents: 'none'
              }}
            />
          </div>
          {errors.mealType && <span className="form-error">{errors.mealType}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="quantity-input">
            Quantity *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="quantity-input"
              type="text"
              className="form-input"
              placeholder="e.g. 1 medium piece / 1 bowl"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Hash
              size={18}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)'
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
