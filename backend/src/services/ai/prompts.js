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

Your output requirements:
1. food_name: Specific dish name(s). Never use "Food item" or "Unknown". If image only, name what you SEE.
2. estimated_nutrition: Realistic values for the ACTUAL portion visible or stated — not generic averages.
   - For a full plate of rice + curry, calories should be 600–900 kcal, not 300.
   - For a single samosa, calories ≈ 150–200 kcal.
   - For a large burger, calories ≈ 450–700 kcal.
   - Scale all macros proportionally to the portion.
3. wellness_level: EXACTLY one of:
   - "Low Concern"      → nutritious, balanced, minimally processed
   - "Moderate Concern" → decent but has excess sugar / sodium / fat / calories
   - "High Concern"     → highly processed, very high calorie/fat/sugar, low nutritional value
4. analysis: 2–3 sentences covering key nutritional highlights and wellness impact.
5. suggestion: One specific, actionable improvement (e.g., "Add a cup of dal for 10g extra protein").

MANDATORY DISCLAIMER: Include "This is for wellness guidance and is not medical advice." in the analysis field.

Return ONLY a valid JSON object — no markdown fences, no extra text outside the JSON.

Required JSON schema (all nutrition values MUST be plain integers — no units, no strings):
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
