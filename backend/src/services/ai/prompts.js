/**
 * Prompts module for Google Gemini AI integrations.
 * Houses structured prompts for food analysis and daily wellness insights.
 */

/**
 * Generates the prompt for analyzing a food item.
 * 
 * @param {string} foodDescription Description of the food provided by the user.
 * @param {string} mealType Type of the meal (e.g., Breakfast, Lunch, Dinner, Snack).
 * @param {string} quantity Quantity of the food (e.g., "1 plate", "200g").
 * @param {boolean} hasImage Whether an image is provided.
 * @returns {string} The constructed prompt for Gemini.
 */
function getFoodAnalysisPrompt(foodDescription, mealType, quantity, hasImage) {
  const isGenericText = !foodDescription || foodDescription.trim() === 'Uploaded Food Image';
  const descriptionValue = hasImage && isGenericText 
    ? "No text description provided — identify the food item 100% visually from the attached image." 
    : foodDescription;

  const imageInstruction = hasImage 
    ? "PRIMARY TASK: Carefully examine the attached food image. Identify the exact dish, meal, or food items visible in the image (for example: Dosa, Biryani, Pizza, Salad, Pasta, Curry, etc.). Base your 'food_name', wellness analysis, and nutrition estimates PRIMARILY on what you visually see in the image."
    : "Analyze the provided food description text.";

  return `You are a professional nutrition and wellness AI assistant.
${imageInstruction}

Details of the meal input:
- Food Description: ${descriptionValue}
- Meal Type: ${mealType || "Not specified"}
- Quantity: ${quantity || "Standard portion"}

Your task:
1. First, check if the input (description or image) refers to a specific, recognizable food or beverage item.
   - If the input is generic (e.g. "i have food", "food", "something", "stuff", "hello") OR non-food related (e.g. pencil, car, non-food object), YOU MUST return "N/A" for all fields.
2. If it IS a specific food item:
   - Identify the food item name.
   - Estimate approximate nutrition values (calories, protein, carbohydrates, fat, fiber).
   - Assign wellness level: "Low Concern", "Moderate Concern", or "High Concern".
   - Provide a wellness analysis and recommendation.

CRITICAL MEDICAL SAFETY CONSTRAINTS:
- Do NOT diagnose medical conditions or diseases.
- Do NOT claim that a food is guaranteed medically safe or medically dangerous.
- Do NOT prescribe treatments or medication.
- Always frame nutrition values as estimates. Use non-definitive wording.

You must return ONLY a valid JSON object without markdown formatting.

If the input IS NOT a valid specific food item, return EXACTLY this JSON:
{
  "food_name": "N/A",
  "wellness_level": "N/A",
  "analysis": "N/A",
  "suggestion": "N/A",
  "estimated_nutrition": {
    "calories": "N/A",
    "protein": "N/A",
    "carbohydrates": "N/A",
    "fat": "N/A",
    "fiber": "N/A"
  }
}

If the input IS a valid specific food item, return:
{
  "food_name": "Name of identified food",
  "wellness_level": "Low Concern" | "Moderate Concern" | "High Concern",
  "analysis": "Wellness analysis text...",
  "suggestion": "Recommendation text...",
  "estimated_nutrition": {
    "calories": 250,
    "protein": 12,
    "carbohydrates": 30,
    "fat": 8,
    "fiber": 3
  }
}
`;
}

/**
 * Generates the prompt for daily wellness insights.
 * 
 * @param {Object} profile User health profile (age, height, weight, activity, diet, allergies, conditions, notes).
 * @param {Array} meals Array of meal logs for today.
 * @returns {string} The constructed prompt for Gemini.
 */
function getDailyInsightPrompt(profile, meals) {
  const profileStr = profile ? JSON.stringify(profile) : "No health profile provided.";
  const mealsStr = meals && meals.length > 0 ? JSON.stringify(meals) : "No meals logged today yet.";

  return `You are a professional health and wellness AI assistant.
Generate a daily personalized wellness insight for a user based on their health profile and their logged meals for today.

User Health Profile:
${profileStr}

Today's Logged Meals:
${mealsStr}

Your task:
- Identify patterns in today's meals (e.g., carbohydrate-heavy, low protein, skipped meals, lack of vegetables).
- Cross-reference with the user's health profile (e.g., diet type, allergies, wellness goals).
- Provide a helpful, constructive, and actionable insight to guide their choices for the rest of the day or tomorrow.

CRITICAL MEDICAL SAFETY CONSTRAINTS:
- Do NOT diagnose, treat, or prevent any medical condition.
- Do NOT prescribe plans or override professional medical advice.
- Keep the language supportive, motivational, and informational.
- Frame comments as wellness suggestions (e.g., "You might consider...", "A good next step could be...").

Return ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json or \`\`\` around the JSON response. Do not include any explanations or commentary outside the JSON object.

The JSON response MUST match this exact schema:
{
  "title": "A short, engaging title for the insight (e.g., 'Balance your dinner')",
  "text": "The personalized wellness recommendation text (e.g., 'You\\'ve had a carbohydrate-heavy day. Consider a protein-rich dinner with vegetables.')"
}
`;
}

module.exports = {
  getFoodAnalysisPrompt,
  getDailyInsightPrompt
};
