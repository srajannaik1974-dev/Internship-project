const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: [true, 'Please add a food name'],
            trim: true
        },
        category: {
            type: String,
            enum: ['breakfast', 'lunch', 'dinner', 'snack', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'other'],
            default: 'snack'
        },
        calories: {
            type: Number,
            required: [true, 'Please add calories count'],
            default: 0
        },
        protein: {
            type: Number,
            default: 0
        },
        carbs: {
            type: Number,
            default: 0
        },
        fats: {
            type: Number,
            default: 0
        },
        portion: {
            type: String,
            default: '1 serving'
        },
        date: {
            type: String,
            default: () => new Date().toISOString().split('T')[0]
        },
        time: {
            type: String,
            default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Food', foodSchema);
