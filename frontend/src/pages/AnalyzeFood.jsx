import React, { useState } from 'react';
import FoodInput from '../components/FoodInput';
import FoodUpload from '../components/FoodUpload';
import FoodAnalysisCard from '../components/FoodAnalysisCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { analyzeFood, createFoodEntry } from '../services/api';
import { Sparkles, RefreshCw } from 'lucide-react';

const AnalyzeFood = () => {
  const [foodDescription, setFoodDescription] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [quantity, setQuantity] = useState('1 serving');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!foodDescription.trim() && !imageFile) {
      newErrors.foodDescription = "Please enter what you're eating or upload a food image.";
    }
    if (!mealType) {
      newErrors.mealType = "Please select a meal type.";
    }
    if (!quantity.trim()) {
      newErrors.quantity = "Please specify quantity.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      // Build FormData payload
      const formData = new FormData();
      formData.append('food_description', foodDescription.trim() || 'Uploaded Food Image');
      formData.append('meal_type', mealType);
      formData.append('quantity', quantity.trim());
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const result = await analyzeFood(formData);
      setAnalysisResult({
        ...result,
        meal_type: mealType,
        quantity: quantity
      });
    } catch (err) {
      setAnalysisError('Food analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToDiary = async (resultToSave) => {
    const payload = {
      food_name: resultToSave.food_name,
      meal_type: resultToSave.meal_type || mealType,
      quantity: resultToSave.quantity || quantity,
      wellness_level: resultToSave.wellness_level,
      analysis: resultToSave.analysis,
      suggestion: resultToSave.suggestion,
      estimated_nutrition: resultToSave.estimated_nutrition
    };

    return await createFoodEntry(payload);
  };

  const handleResetForm = () => {
    setFoodDescription('');
    setMealType('Breakfast');
    setQuantity('1 serving');
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setErrors({});
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="h1-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={24} style={{ color: 'var(--primary)' }} />
          <span>What are you eating?</span>
        </h1>
        <p className="subtitle">
          Tell us what you ate and we'll help you understand it better.
        </p>
      </div>

      {!analysisResult && !isAnalyzing && (
        <form onSubmit={handleAnalyze} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
          <FoodInput
            foodDescription={foodDescription}
            setFoodDescription={setFoodDescription}
            mealType={mealType}
            setMealType={setMealType}
            quantity={quantity}
            setQuantity={setQuantity}
            errors={errors}
          />

          <FoodUpload
            imageFile={imageFile}
            imagePreview={imagePreview}
            setImageFile={setImageFile}
            setImagePreview={setImagePreview}
          />

          {analysisError && (
            <ErrorState message={analysisError} onRetry={handleAnalyze} />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <Sparkles size={20} />
              <span>Analyze Food</span>
            </button>
          </div>
        </form>
      )}

      {isAnalyzing && (
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <LoadingState message="Analyzing your food with AI wellness insights..." />
        </div>
      )}

      {analysisResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <FoodAnalysisCard
            analysisResult={analysisResult}
            onAddToDiary={handleSaveToDiary}
          />

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              className="btn btn-secondary"
              onClick={handleResetForm}
            >
              <RefreshCw size={16} />
              <span>Analyze Another Food</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzeFood;
