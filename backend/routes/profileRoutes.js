const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { profileValidationRules } = require('../middleware/validationMiddleware');

router.get('/', protect, getProfile);
router.put('/', protect, profileValidationRules, updateProfile);
router.post('/', protect, profileValidationRules, updateProfile);

module.exports = router;
