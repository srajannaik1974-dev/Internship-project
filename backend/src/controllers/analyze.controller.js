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
    // Map controller error responses. If it's a validation/input issue, use 400, else 500
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

/**
 * Handler for GET /api/insight
 * Note: Under the final architecture, Collaborator 3 (Backend-1) will wrap this
 * with Auth middleware to get the current user, fetch their profile and today's meals from DB,
 * and handle caching.
 */
async function getInsight(req, res) {
  try {
    // These objects should be retrieved by Backend-1 from their database
    // profile: age, height, weight, activity, diet, allergies, conditions, notes
    // meals: array of logged meals for today
    const { profile, meals } = req.body || {};

    if (!profile) {
      return res.status(400).json({ error: 'Missing health profile for insight generation.' });
    }

    const insight = await geminiService.generateDailyInsight(profile, meals || []);
    return res.status(200).json(insight);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to generate daily insight.' });
  }
}

module.exports = {
  analyze,
  getInsight
};
