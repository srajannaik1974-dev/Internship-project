const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
    registerValidationRules,
    loginValidationRules
} = require('../middleware/validationMiddleware');

router.post('/register', registerValidationRules, registerUser);
router.post('/login', loginValidationRules, loginUser);
router.get('/me', protect, getMe);

module.exports = router;
