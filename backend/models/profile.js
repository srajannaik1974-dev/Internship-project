const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        age: {
            type: Number,
            default: null
        },
        gender: {
            type: String,
            default: 'other'
        },
        height: {
            type: Number,
            default: null
        },
        weight: {
            type: Number,
            default: null
        },
        activity_level: {
            type: String,
            default: 'Active'
        },
        activityLevel: {
            type: String,
            default: 'Active'
        },
        diet_preference: {
            type: String,
            default: 'No Preference'
        },
        dietaryGoal: {
            type: String,
            default: 'No Preference'
        },
        allergies: {
            type: String,
            default: ''
        },
        dietary_restrictions: {
            type: String,
            default: ''
        },
        health_conditions: {
            type: String,
            default: ''
        },
        healthConditions: {
            type: Array,
            default: []
        },
        additional_notes: {
            type: String,
            default: ''
        },
        dailyCalorieTarget: {
            type: Number,
            default: 2000
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Profile', profileSchema);
