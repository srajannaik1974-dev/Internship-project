/**
 * Service to interface with Google Gemini AI using the official @google/genai SDK.
 * Handles food analysis (text & image) and daily personalized insights.
 *
 * ── dotenv note ─────────────────────────────────────────────────────────────
 * This service reads GEMINI_API_KEY from process.env at call time.
 * Backend-1 must call `require('dotenv').config()` at the very top of the
 * Express app entry point (e.g. src/index.js) BEFORE importing any service.
 * Example:
 *   require('dotenv').config();
 *   const aiRoutes = require('./routes/ai.routes');
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { GoogleGenAI } = require('@google/genai');
const { getFoodAnalysisPrompt, getDailyInsightPrompt } = require('./prompts');
const { parseAndValidateFoodAnalysis, parseAndValidateDailyInsight } = require('./aiParser');

// Model definition
const DEFAULT_MODEL = 'gemini-2.0-flash';

// Helper to initialize GoogleGenAI client securely
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable.');
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Analyzes food based on description, meal type, quantity, and an optional image.
 * 
 * @param {Object} params Input parameters.
 * @param {string} [params.foodDescription] Description of the food.
 * @param {string} [params.mealType] Type of meal (e.g., Breakfast, Lunch, Dinner, Snack).
 * @param {string} [params.quantity] Portion size or quantity description.
 * @param {Object} [params.image] Optional image object.
 * @param {Buffer} [params.image.buffer] Buffer containing the image file.
 * @param {string} [params.image.base64] Base64 string of the image file (alternative to buffer).
 * @param {string} [params.image.mimeType] Mime type of the image (defaults to 'image/jpeg').
 * @returns {Promise<Object>} The parsed and validated nutritional/wellness analysis.
 */
async function analyzeFood({ foodDescription, mealType, quantity, image } = {}) {
  try {
    // 1. Validation of input
    const hasDescription = typeof foodDescription === 'string' && foodDescription.trim().length > 0;
    const hasImage = !!(image && (image.buffer || image.base64));

    if (!hasDescription && !hasImage) {
      throw new Error('Please provide either a food description or a food image for analysis.');
    }

    // 2. Initialize Gemini client
    const ai = getAiClient();

    // 3. Prepare content parts
    const contents = [];

    // Add image if present
    if (hasImage) {
      let base64Data = '';
      let mimeType = image.mimeType || 'image/jpeg';

      if (image.buffer && Buffer.isBuffer(image.buffer)) {
        base64Data = image.buffer.toString('base64');
      } else if (typeof image.base64 === 'string') {
        base64Data = image.base64.replace(/^data:image\/\w+;base64,/, ''); // strip prefix if present
      }

      if (!base64Data) {
        throw new Error('Invalid image data provided.');
      }

      contents.push({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    }

    // Add prompt text
    const promptText = getFoodAnalysisPrompt(foodDescription, mealType, quantity, hasImage);
    contents.push({ text: promptText });

    // 4. Send request to Gemini
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: contents,
      // Request JSON output constraint if supported, or rely on prompt formatting
      config: {
        responseMimeType: 'application/json'
      }
    });

    const rawText = response.text;

    // 5. Parse and validate the response
    return parseAndValidateFoodAnalysis(rawText);

  } catch (error) {
    // Standardize Gemini and application-level errors
    const errorMessage = error.message || 'An error occurred during food analysis.';
    
    // Check for specific Gemini/Network errors and return user-friendly versions
    if (errorMessage.includes('API key') || errorMessage.includes('403') || errorMessage.includes('API_KEY')) {
      throw new Error('AI Service Configuration Error: Invalid or missing API key.');
    }
    if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('Rate limit')) {
      throw new Error('AI Service is temporarily busy due to rate limits. Please try again in a few moments.');
    }
    if (errorMessage.includes('ETIMEDOUT') || errorMessage.includes('timeout')) {
      throw new Error('AI Service request timed out. Please check your connection and try again.');
    }

    throw new Error(`AI Analysis Failed: ${errorMessage}`);
  }
}

/**
 * Generates daily wellness insights for a user based on health profile and logged meals.
 * 
 * @param {Object} profile User health profile.
 * @param {Array} meals Array of logged meals for today.
 * @returns {Promise<Object>} The parsed and validated daily insight.
 */
async function generateDailyInsight(profile, meals) {
  try {
    const ai = getAiClient();
    const promptText = getDailyInsightPrompt(profile, meals);

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ text: promptText }],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const rawText = response.text;
    return parseAndValidateDailyInsight(rawText);

  } catch (error) {
    const errorMessage = error.message || 'An error occurred while generating insight.';
    
    if (errorMessage.includes('API key') || errorMessage.includes('403') || errorMessage.includes('API_KEY')) {
      throw new Error('AI Service Configuration Error: Invalid or missing API key.');
    }
    if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('Rate limit')) {
      throw new Error('AI Service is temporarily busy. Unable to generate daily insights.');
    }

    throw new Error(`Daily Insight Generation Failed: ${errorMessage}`);
  }
}

module.exports = {
  analyzeFood,
  generateDailyInsight
};
