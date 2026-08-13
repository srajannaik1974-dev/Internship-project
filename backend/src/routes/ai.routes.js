/**
 * Routes for AI services.
 * Configures multer for optional memory-based image uploads and hooks up controller actions.
 */

const express = require('express');
const multer = require('multer');
const analyzeController = require('../controllers/analyze.controller');

const router = express.Router();

// Configure multer storage in memory
const storage = multer.memoryStorage();

// Accept image files only, up to 10MB
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are supported.'), false);
    }
  }
});

/**
 * @route   POST /api/analyze
 * @desc    Analyze food description and/or upload image
 * @access  Public (Will be wrapped or integrated by Backend-1 with JWT middleware)
 */
router.post('/analyze', upload.single('image'), analyzeController.analyze);

/**
 * @route   POST /api/insight
 * @desc    Generate daily personalized wellness insight (receives profile and meals in body)
 * @access  Public (Will be wrapped or integrated by Backend-1 with JWT middleware)
 */
router.post('/insight', analyzeController.getInsight);

module.exports = router;
