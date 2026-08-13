const express = require('express');
const router = express.Router();
const {
    getFoods,
    getTodaysFood,
    createFood,
    deleteFood
} = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');
const { foodValidationRules } = require('../middleware/validationMiddleware');

router.get('/', protect, getFoods);
router.get('/today', protect, getTodaysFood);
router.post('/', protect, foodValidationRules, createFood);
router.delete('/:id', protect, deleteFood);

module.exports = router;
