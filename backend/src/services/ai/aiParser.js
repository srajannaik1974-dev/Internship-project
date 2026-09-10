/**
 * Parser and validator for structured Gemini AI responses.
 * Ensures data integrity, validates schemas, and handles potential errors safely.
 */

/**
 * Parses and validates the food analysis response from Gemini.
 * 
 * @param {string} rawResponse The raw string response from Gemini.
 * @returns {Object} Validated JSON object.
 * @throws {Error} App-level validation error if parsing or structure checks fail.
 */
function parseAndValidateFoodAnalysis(rawResponse) {
  if (!rawResponse || typeof rawResponse !== 'string' || !rawResponse.trim()) {
    throw new Error('AI returned an empty or invalid response.');
  }

  let data;
  try {
    let cleanJson = rawResponse.trim();
    // Extract JSON object using regex to ignore any surrounding markdown or thoughtSignature text
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }
    data = JSON.parse(cleanJson);
  } catch (err) {
    throw new Error(`AI response is not valid JSON: ${err.message}`);
  }

  // Validate fields existence
  const requiredFields = ['food_name', 'wellness_level', 'analysis', 'suggestion', 'estimated_nutrition'];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw new Error(`AI response is missing required field: ${field}`);
    }
  }

  // Check if Gemini determined the input is N/A (non-food item or generic non-food phrase)
  const isNA = String(data.food_name).trim().toUpperCase() === 'N/A' ||
               String(data.wellness_level).trim().toUpperCase() === 'N/A' ||
               String(data.analysis).trim().toUpperCase() === 'N/A';

  if (isNA) {
    return {
      food_name: 'N/A',
      wellness_level: 'N/A',
      analysis: 'N/A',
      suggestion: 'N/A',
      estimated_nutrition: {
        calories: 'N/A',
        protein: 'N/A',
        carbohydrates: 'N/A',
        fat: 'N/A',
        fiber: 'N/A'
      }
    };
  }

  // Validate wellness_level
  const allowedWellnessLevels = ['Low Concern', 'Moderate Concern', 'High Concern'];
  if (!allowedWellnessLevels.includes(data.wellness_level)) {
    const normalized = String(data.wellness_level).trim().toLowerCase();
    if (normalized.includes('low')) {
      data.wellness_level = 'Low Concern';
    } else if (normalized.includes('high')) {
      data.wellness_level = 'High Concern';
    } else {
      data.wellness_level = 'Moderate Concern'; // Safe fallback
    }
  }

  // Validate estimated_nutrition
  const nutrition = data.estimated_nutrition;
  if (typeof nutrition !== 'object' || nutrition === null) {
    throw new Error('AI response estimated_nutrition must be an object.');
  }

  const nutritionKeys = ['calories', 'protein', 'carbohydrates', 'fat', 'fiber'];
  const formattedNutrition = {};
  for (const key of nutritionKeys) {
    const val = nutrition[key];
    if (val === 'N/A' || val === 'n/a' || val === null || val === undefined) {
      formattedNutrition[key] = (data.wellness_level === 'N/A') ? 'N/A' : 0;
    } else {
      let num = Number(val);
      if (isNaN(num)) {
        formattedNutrition[key] = (typeof val === 'string' && val.trim().toUpperCase() === 'N/A') ? 'N/A' : 0;
      } else {
        formattedNutrition[key] = Math.round(num);
      }
    }
  }

  return {
    food_name: String(data.food_name || 'Unknown Food').trim(),
    wellness_level: data.wellness_level,
    analysis: String(data.analysis || '').trim(),
    suggestion: String(data.suggestion || '').trim(),
    estimated_nutrition: formattedNutrition
  };
}

/**
 * Parses and validates the daily insight response from Gemini.
 * 
 * @param {string} rawResponse The raw string response from Gemini.
 * @returns {Object} Validated JSON object.
 * @throws {Error} App-level validation error if parsing or structure checks fail.
 */
function parseAndValidateDailyInsight(rawResponse) {
  if (!rawResponse || typeof rawResponse !== 'string' || !rawResponse.trim()) {
    throw new Error('AI returned an empty response for daily insight.');
  }

  let data;
  try {
    let cleanJson = rawResponse.trim();
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }
    data = JSON.parse(cleanJson);
  } catch (err) {
    throw new Error(`AI daily insight response is not valid JSON: ${err.message}`);
  }

  if (!data.title || !data.text) {
    throw new Error('AI insight response is missing required fields: title or text');
  }

  return {
    title: String(data.title).trim(),
    text: String(data.text).trim()
  };
}

module.exports = {
  parseAndValidateFoodAnalysis,
  parseAndValidateDailyInsight
};
