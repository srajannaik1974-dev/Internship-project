/**
 * Controller for AI analysis routes.
 * Bridges Express request/response layer with the Gemini AI service.
 */

const geminiService = require('../services/ai/gemini.service');

/**
 * Handler for POST /api/analyze
 * Analyzes food description and/or uploaded image.
 */
async function analyze(req, res) {
  try {
    const { food_description, meal_type, quantity } = req.body;
    
    // Check if an image was uploaded via multer
    let imageParam = null;
    if (req.file) {
      imageParam = {
        buffer: req.file.buffer,
        mimeType: req.file.mimetype
      };
    }

    // Call service layer
    const result = await geminiService.analyzeFood({
      foodDescription: food_description,
      mealType: meal_type,
      quantity,
      image: imageParam
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('[Analyze Controller Error]:', error.message || error);
    const message = error.message || 'An error occurred during food analysis';
    if (message.includes('Invalid or missing API key') || message.includes('Configuration Error')) {
      return res.status(500).json({ error: 'AI Service is misconfigured. Please contact support.' });
    }
    if (message.includes('Please provide either') || message.includes('Invalid image')) {
      return res.status(400).json({ error: message });
    }
    return res.status(500).json({ error: message });
  }
}

const Profile = require('../../models/profile');
const Food = require('../../models/food');

// In-memory cache for daily insights: key -> { data, date }
const insightCache = new Map();

/**
 * Handler for GET /api/insight
 * Generates and returns a personalized daily insight for the logged-in user.
 */
async function getInsight(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required. Please log in to receive your daily insight.'
      });
    }

    const userId = req.user._id ? req.user._id.toString() : req.user.id;
    const todayStr = new Date().toISOString().split('T')[0];
    const cacheKey = `insight:${userId}:${todayStr}`;

    // ── Step 1: Check cache ───────────────────────────────────────────────────
    if (insightCache.has(cacheKey)) {
      return res.status(200).json(insightCache.get(cacheKey));
    }

    // ── Step 2: Retrieve profile and today's meals ────────────────────────────
    let profile = null;
    let meals = [];

    try {
      profile = await Profile.findOne({ user: userId });
      meals = await Food.find({ user: userId, date: todayStr });
    } catch (dbError) {
      console.warn('[Analyze Controller] DB query failed, falling back to empty profile/meals:', dbError.message);
    }

    // ── Step 3: Call AI service ───────────────────────────────────────────────
    const insight = await geminiService.generateDailyInsight(profile, meals);

    // ── Step 4: Cache & return ────────────────────────────────────────────────
    insightCache.set(cacheKey, insight);
    return res.status(200).json(insight);

  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Failed to generate daily insight.'
    });
  }
}

module.exports = {
  analyze,
  getInsight
};
