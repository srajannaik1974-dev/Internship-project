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
 *
 * ── Integration guide for Backend-1 ─────────────────────────────────────────
 * This controller is the bridge between the AI service and the Express layer.
 * Backend-1 MUST do the following before this handler runs:
 *
 *   1. Add JWT auth middleware to the route so that req.user is populated:
 *        router.get('/insight', jwtAuthMiddleware, analyzeController.getInsight);
 *
 *   2. Inside this controller (or via middleware), fetch from MongoDB:
 *        const profile = await Profile.findOne({ userId: req.user.id });
 *        const meals   = await Food.find({
 *          userId: req.user.id,
 *          createdAt: { $gte: startOfToday, $lte: endOfToday }
 *        });
 *
 *   3. Optionally cache the result (e.g. in-memory or Redis):
 *        key: `insight:${req.user.id}:${today's date string}`
 *        If the cache contains a result for today, return it directly without
 *        calling generateDailyInsight() again.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */
async function getInsight(req, res) {
  try {
    // ── Step 1: Verify authenticated user ────────────────────────────────────
    // req.user is populated by Backend-1's JWT middleware.
    // If it is missing, return 401 immediately.
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required. Please log in to receive your daily insight.'
      });
    }

    // ── Step 2: Retrieve profile and today's meals ────────────────────────────
    // TODO (Backend-1): Replace these stubs with real DB queries.
    //
    //   const profile = await Profile.findOne({ userId: req.user.id });
    //   const today   = new Date();
    //   const meals   = await Food.find({
    //     userId:    req.user.id,
    //     createdAt: { $gte: startOfDay(today), $lte: endOfDay(today) }
    //   });
    //
    // For now, fall back to empty stubs so the AI generates a generic insight.
    const profile = req.user.profile || null;
    const meals   = req.user.meals   || [];

    // ── Step 3: Call the AI service ───────────────────────────────────────────
    // generateDailyInsight() is a pure function — no Express objects inside.
    // Backend-1 can also call it directly from their own controller if preferred.
    const insight = await geminiService.generateDailyInsight(profile, meals);

    // ── Step 4: Return the result ─────────────────────────────────────────────
    // Backend-1 should cache this result before returning:
    //   await cache.set(`insight:${req.user.id}:${todayDateString}`, insight);
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
