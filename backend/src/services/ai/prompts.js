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
  const hasDesc = typeof foodDescription === 'string'
    && foodDescription.trim().length > 0
    && foodDescription.trim() !== 'Uploaded Food Image';

  let imageInstruction = '';
  if (hasImage && !hasDesc) {
    imageInstruction = `PRIMARY TASK — VISUAL FOOD IDENTIFICATION & CALORIE ESTIMATION:
1. Carefully examine the attached food image.
2. Identify every food/dish item visible (e.g. Butter Chicken, Naan, Samosa, Pizza, Salad bowl, etc.). Be SPECIFIC — not just "rice" but "Basmati rice" or "fried rice".
3. Estimate the PORTION SIZE from visual cues (plate size, food height, density, serving utensils visible). Common references: a standard dinner plate ≈ 26 cm, a fist ≈ 240 ml, a palm of meat ≈ 85g.
4. Use those portion estimates to calculate realistic CALORIE and MACRO values — do NOT use a generic 300 kcal default.
5. If multiple items are visible (e.g. rice + curry + salad), list them all in food_name and SUM their nutritional values.
6. If the image is unclear, dark, or doesn't appear to contain food, state that clearly in the analysis.`;
  } else if (hasImage && hasDesc) {
    imageInstruction = `PRIMARY TASK — VISUAL ANALYSIS WITH TEXT CONTEXT:
You have BOTH a food image AND the user's description: "${foodDescription}".
1. Use the image as the PRIMARY source — visually confirm and identify all food items.
2. Use the text description as secondary context to clarify dish name or portion size.
3. Estimate the portion size from visual cues in the image.
4. Calculate realistic calorie and macro values based on what you actually see — NOT generic averages.
5. If multiple items are visible, sum all nutritional values.`;
  } else {
    imageInstruction = `TASK — TEXT-BASED FOOD ANALYSIS:
Analyze the food based on this description: "${foodDescription}".
Use standard nutritional databases (USDA/IFCT) to estimate calories and macros for the given quantity.`;
  }

  const descriptionValue = hasDesc
    ? foodDescription
    : 'No text description — identify and analyse 100% from the image.';

  return `You are an expert clinical nutritionist and AI food recognition system.

${imageInstruction}

Meal context provided by the user:
- Food Description: ${descriptionValue}
- Meal Type: ${mealType || 'Not specified'}
- Stated Quantity / Portion: ${quantity || 'Estimate from image'}

Your task and output requirements:
1. First, check if the input refers to a specific, recognizable food or beverage. 
   - If the input is clearly generic nonsense (e.g. "stuff", "hello") OR a non-food item, YOU MUST return "N/A" for all fields.
   - However, if the input is ANY recognizable food item (like "samosa", "apple", "rice", "curry"), treat it as a VALID food item and provide the analysis! Don't be overly strict.
2. If it IS a specific food item:
   - Identify the food item name (be specific, e.g. "Samosa", not just "Food item").
   - Estimate realistic nutrition values for the ACTUAL portion visible/stated (not generic averages).
     - Scale all macros proportionally to the portion.
   - Assign wellness level: EXACTLY one of "Low Concern", "Moderate Concern", or "High Concern".
   - Provide a 2-3 sentence wellness analysis covering key nutritional highlights and wellness impact.
   - Provide one specific, actionable recommendation/suggestion.

CRITICAL MEDICAL SAFETY CONSTRAINTS:
- Do NOT diagnose medical conditions or diseases.
- Do NOT prescribe treatments or medication.
- MANDATORY DISCLAIMER: Include "This is for wellness guidance and is not medical advice." in the analysis field.

Return ONLY a valid JSON object — no markdown fences, no extra text outside the JSON.

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

If the input IS a valid specific food item, return this JSON schema (nutrition values MUST be plain integers):
{
  "food_name": "Specific name of identified food(s)",
  "wellness_level": "Low Concern" | "Moderate Concern" | "High Concern",
  "analysis": "2-3 sentence nutritional analysis. This is for wellness guidance and is not medical advice.",
  "suggestion": "One specific, actionable wellness suggestion.",
  "estimated_nutrition": {
    "calories": 520,
    "protein": 28,
    "carbohydrates": 55,
    "fat": 18,
    "fiber": 5
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
  const profileStr = profile ? JSON.stringify(profile) : 'No health profile provided.';
  const mealsStr = meals && meals.length > 0 ? JSON.stringify(meals) : 'No meals logged today yet.';

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
