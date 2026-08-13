export const initialMockProfile = {
  name: "User",
  age: 20,
  height: 152,
  weight: 45,
  activity_level: "Active",
  diet_preference: "No Preference",
  allergies: "None",
  dietary_restrictions: "None",
  health_conditions: "None",
  additional_notes: "Focusing on balanced energy and overall wellness."
};

export const initialMockFoodDiary = [
  {
    id: "food_101",
    food_name: "Idli + Sambar",
    meal_type: "Breakfast",
    quantity: "2 Idlis with 1 bowl sambar",
    time: "8:30 AM",
    date: new Date().toISOString().split("T")[0],
    wellness_level: "Low Concern",
    analysis: "Steamed fermented rice & lentil cake served with vegetable sambar. High in complex carbohydrates and light on digestion.",
    suggestion: "Great start to your morning! Pair with coconut chutney or boiled eggs for extra micronutrients and protein.",
    estimated_nutrition: { calories: 220, protein: "7g", carbs: "42g", fats: "2g", fiber: "5g" }
  },
  {
    id: "food_102",
    food_name: "Rice + Dal",
    meal_type: "Lunch",
    quantity: "1 bowl white rice with yellow dal",
    time: "1:15 PM",
    date: new Date().toISOString().split("T")[0],
    wellness_level: "Low Concern",
    analysis: "Classic comfort dish offering a complete amino acid profile when combining legumes and grains.",
    suggestion: "Consider adding a fresh salad or green leafy veggies to boost fiber and slow glucose absorption.",
    estimated_nutrition: { calories: 340, protein: "12g", carbs: "62g", fats: "5g", fiber: "6g" }
  },
  {
    id: "food_103",
    food_name: "Samosa",
    meal_type: "Snack",
    quantity: "1 medium samosa",
    time: "4:30 PM",
    date: new Date().toISOString().split("T")[0],
    wellness_level: "Moderate Concern",
    analysis: "This is a deep-fried savory pastry stuffed with spiced potatoes. It is relatively high in energy and saturated fats.",
    suggestion: "Enjoy in moderation. Balance your upcoming dinner with leafy vegetables, light broth, and a clean protein source.",
    estimated_nutrition: { calories: 260, protein: "4g", carbs: "32g", fats: "14g", fiber: "2g" }
  }
];

export const sampleFoodAnalysis = {
  Samosa: {
    food_name: "Samosa",
    wellness_level: "Moderate Concern",
    analysis: "This is a fried snack and may be relatively high in energy and unhealthy fats.",
    suggestion: "Consider balancing your next meal with vegetables and a protein source.",
    estimated_nutrition: {
      calories: 260,
      protein: "4g",
      carbs: "32g",
      fats: "14g",
      fiber: "2g"
    }
  },
  Default: {
    food_name: "Balanced Meal",
    wellness_level: "Low Concern",
    analysis: "Contains a wholesome mix of whole grains and plant nutrients providing steady energy flow.",
    suggestion: "Keep hydration levels steady throughout the afternoon.",
    estimated_nutrition: {
      calories: 310,
      protein: "9g",
      carbs: "48g",
      fats: "6g",
      fiber: "4g"
    }
  }
};

export const initialDailyInsight = {
  title: "Today's Insight",
  text: "You have logged three meals today. Consider including vegetables and a protein source in your next meal to maintain steady energy levels.",
  date: new Date().toISOString().split("T")[0]
};
