const Food = require('../models/food');


const getFoods = async (req, res, next) => {
    try {
        const filter = { user: req.user._id };

        if (req.query.date) {
            filter.date = req.query.date;
        }

        const foods = await Food.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: foods.length,
            data: foods
        });
    } catch (error) {
        next(error);
    }
};


const getTodaysFood = async (req, res, next) => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const foods = await Food.find({
            user: req.user._id,
            date: todayStr
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: foods.length,
            data: foods
        });
    } catch (error) {
        next(error);
    }
};


const createFood = async (req, res, next) => {
    try {
        const {
            name,
            food_name,
            category,
            mealType,
            meal_type,
            calories,
            protein,
            carbs,
            fats,
            portion,
            quantity,
            date,
            time,
            estimated_nutrition
        } = req.body;

        const foodName = name || food_name;
        if (!foodName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a food name'
            });
        }

        const parseNum = (val) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
                const match = val.match(/\d+/);
                return match ? parseInt(match[0], 10) : 0;
            }
            return 0;
        };

        const calVal = parseNum(calories) || parseNum(estimated_nutrition?.calories) || 0;
        const protVal = parseNum(protein) || parseNum(estimated_nutrition?.protein) || 0;
        const carbVal = parseNum(carbs) || parseNum(estimated_nutrition?.carbs) || 0;
        const fatVal = parseNum(fats) || parseNum(estimated_nutrition?.fats) || 0;

        const food = await Food.create({
            user: req.user._id,
            name: foodName,
            category: (category || mealType || meal_type || 'snack').toLowerCase(),
            calories: calVal,
            protein: protVal,
            carbs: carbVal,
            fats: fatVal,
            portion: portion || quantity || '1 serving',
            date: date || new Date().toISOString().split('T')[0],
            time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        res.status(201).json({
            success: true,
            message: 'Food entry created successfully',
            data: food
        });
    } catch (error) {
        next(error);
    }
};

const deleteFood = async (req, res, next) => {
    try {
        const food = await Food.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food entry not found or unauthorized'
            });
        }

        await food.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Food entry deleted successfully',
            id: req.params.id
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFoods,
    getTodaysFood,
    createFood,
    deleteFood
};
