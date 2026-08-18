import React from 'react';

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
      <div className="form-group">
        <label className="form-label" htmlFor="food-desc">
          Food Description *
        </label>
        <textarea
          id="food-desc"
          className="form-textarea"
          rows={3}
          value={foodDescription}
          onChange={(e) => setFoodDescription(e.target.value)}
          placeholder="e.g. 2 whole wheat rotis with paneer curry and cucumber salad"
        />
        {errors.foodDescription && (
          <span className="form-error">{errors.foodDescription}</span>
        )}
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="meal-type">
            Meal Type
          </label>
          <select
            id="meal-type"
            className="form-select"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snack">Snack</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="food-quantity">
            Serving / Portion Quantity
          </label>
          <input
            id="food-quantity"
            type="text"
            className="form-input"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 1 plate / 200g"
          />
        </div>
      </div>
    </div>
  );
};

export default FoodInput;
