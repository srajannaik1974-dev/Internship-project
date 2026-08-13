const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors
        });
    }
    next();
};

const registerValidationRules = [
    body('name').trim().notEmpty().withMessage('Full Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
];


const loginValidationRules = [
    body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

const profileValidationRules = [
    body('age').optional({ nullable: true }).isNumeric().withMessage('Age must be a number'),
    body('height').optional({ nullable: true }).isNumeric().withMessage('Height must be a number'),
    body('weight').optional({ nullable: true }).isNumeric().withMessage('Weight must be a number'),
    body('dailyCalorieTarget').optional().isNumeric().withMessage('Daily calorie target must be a number'),
    validate
];


const foodValidationRules = [
    body('name').optional().trim(),
    body('food_name').optional().trim(),
    body('calories').optional().isNumeric().withMessage('Calories must be a number'),
    validate
];

module.exports = {
    registerValidationRules,
    loginValidationRules,
    profileValidationRules,
    foodValidationRules
};
