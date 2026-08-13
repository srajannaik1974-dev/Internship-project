const Profile = require('../models/profile');
const User = require('../models/user');

const getProfile = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email');

        if (!profile) {

            return res.status(200).json({
                success: true,
                data: {
                    user: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    age: null,
                    gender: 'other',
                    height: null,
                    weight: null,
                    activity_level: 'Active',
                    activityLevel: 'Active',
                    diet_preference: 'No Preference',
                    dietaryGoal: 'No Preference',
                    allergies: '',
                    dietary_restrictions: '',
                    health_conditions: '',
                    additional_notes: '',
                    dailyCalorieTarget: 2000
                }
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(error);
    }
};


const updateProfile = async (req, res, next) => {
    try {
        const {
            age,
            gender,
            height,
            weight,
            activity_level,
            activityLevel,
            diet_preference,
            dietaryGoal,
            allergies,
            dietary_restrictions,
            health_conditions,
            healthConditions,
            additional_notes,
            dailyCalorieTarget
        } = req.body;

        const profileFields = {
            user: req.user._id,
            age: age !== undefined ? age : null,
            gender: gender || 'other',
            height: height !== undefined ? height : null,
            weight: weight !== undefined ? weight : null,
            activity_level: activity_level || activityLevel || 'Active',
            activityLevel: activityLevel || activity_level || 'Active',
            diet_preference: diet_preference || dietaryGoal || 'No Preference',
            dietaryGoal: dietaryGoal || diet_preference || 'No Preference',
            allergies: allergies || '',
            dietary_restrictions: dietary_restrictions || '',
            health_conditions: health_conditions || (Array.isArray(healthConditions) ? healthConditions.join(', ') : healthConditions) || '',
            healthConditions: healthConditions || (health_conditions ? [health_conditions] : []),
            additional_notes: additional_notes || '',
            dailyCalorieTarget: dailyCalorieTarget || 2000
        };

        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: profileFields },
            { returnDocument: 'after', upsert: true, runValidators: true }
        ).populate('user', 'name email');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile
};
