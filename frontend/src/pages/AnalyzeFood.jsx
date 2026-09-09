import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FoodInput from '../components/FoodInput';
import FoodUpload from '../components/FoodUpload';
import FoodAnalysisCard from '../components/FoodAnalysisCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { analyzeFood, createFoodEntry } from '../services/api';
import { UtensilsCrossed, RefreshCw, ArrowRight, Camera, Utensils, Coffee } from 'lucide-react';

import tomatoImg from '../assets/tomato_slice.png';
import bowlImg from '../assets/curry_bowl.png';

const AnalyzeFood = () => {
  const location = useLocation();
  const [foodDescription, setFoodDescription] = useState('');
  const [mealType, setMealType] = useState(location.state?.mealType || 'Breakfast');
  const [quantity, setQuantity] = useState(' ');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  useEffect(() => {
    if (location.state?.mealType) {
      setMealType(location.state.mealType);
    }
  }, [location.state]);

  const validateForm = () => {
    const newErrors = {};
    if (!foodDescription.trim() && !imageFile) {
      newErrors.foodDescription = "Please enter what you're eating or take a food photo.";
    }
    if (!mealType) newErrors.mealType = "Please select a meal type.";
    if (!quantity.trim()) newErrors.quantity = "Please specify quantity.";
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
      const formData = new FormData();
      formData.append('food_description', foodDescription.trim() || 'Uploaded Food Image');
      formData.append('meal_type', mealType);
      formData.append('quantity', quantity.trim());
      if (imageFile) formData.append('image', imageFile);

      const result = await analyzeFood(formData);
      const fullResult = { ...result, meal_type: mealType, quantity };
      
      // Auto-save entry immediately so it's logged into DB & home page updates!
      await handleSaveToDiary(fullResult);

      setAnalysisResult(fullResult);
    } catch (err) {
      console.error('Food logging error:', err);
      setAnalysisError('Food logging failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToDiary = async (resultToSave) => {
    const selectedMeal = resultToSave.meal_type || mealType;
    const payload = {
      name: resultToSave.food_name,
      food_name: resultToSave.food_name,
      meal_type: selectedMeal,
      mealType: selectedMeal,
      category: selectedMeal.toLowerCase(),
      quantity: resultToSave.quantity || quantity,
      portion: resultToSave.quantity || quantity,
      wellness_level: resultToSave.wellness_level,
      analysis: resultToSave.analysis,
      suggestion: resultToSave.suggestion,
      estimated_nutrition: resultToSave.estimated_nutrition,
      calories: resultToSave.estimated_nutrition?.calories || 0
    };
    return await createFoodEntry(payload);
  };

  const handleResetForm = () => {
    setFoodDescription('');
    setMealType('Breakfast');
    setQuantity(' ');
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setErrors({});
  };

  return (
    <div className="lf-page animate-fade-in">

      {/* ── All page content ── */}
      <div className="lf-inner">

        {/* HEADING */}
        <div className="lf-heading-block">
          <img
            src={tomatoImg}
            aria-hidden="true"
            alt=""
            className="lf-deco-inline lf-deco-left"
          />
          <div className="lf-heading-text">
            <h1 className="lf-title">
              What are you eating?
            </h1>
            <p className="lf-subtitle">
              Tell us what you ate and we'll help you understand it better.
            </p>
          </div>
          <img
            src={bowlImg}
            aria-hidden="true"
            alt=""
            className="lf-deco-inline lf-deco-right"
          />
        </div>

        {/* FORM */}
        {!analysisResult && !isAnalyzing && (
          <form onSubmit={handleAnalyze} className="lf-card">

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

            <button type="submit" className="lf-submit-btn">
              Log Food
              <ArrowRight size={19} />
            </button>

          </form>
        )}

        {/* LOADING */}
        {isAnalyzing && (
          <div className="lf-card lf-loading-card">
            <LoadingState message="Processing and logging your food..." />
          </div>
        )}

        {/* RESULT */}
        {analysisResult && (
          <div className="lf-result-wrapper">
            <FoodAnalysisCard
              analysisResult={analysisResult}
              onReset={handleResetForm}
            />
          </div>
        )}

        {/* TIPS */}
        {!isAnalyzing && !analysisResult && (
          <div className="lf-tips">
            <span className="lf-tips-title">Tips for better results</span>
            <div className="lf-tips-grid">

              <div className="lf-tip">
                <div className="lf-tip-icon">
                  <Camera size={17} />
                </div>
                <div>
                  <strong>Take a clear photo</strong>
                  <p>Good lighting helps identify food better.</p>
                </div>
              </div>

              <div className="lf-tip">
                <div className="lf-tip-icon">
                  <Utensils size={17} />
                </div>
                <div>
                  <strong>Include all items</strong>
                  <p>Capture everything on your plate or bowl.</p>
                </div>
              </div>

              <div className="lf-tip">
                <div className="lf-tip-icon">
                  <Coffee size={17} />
                </div>
                <div>
                  <strong>Be specific</strong>
                  <p>Add details in text for more accurate insights.</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AnalyzeFood;