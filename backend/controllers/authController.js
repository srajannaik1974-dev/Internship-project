const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'nutrimind_secret_key_2026', {
        expiresIn: '30d'
    });
};

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }


        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
                },
                token
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid user data'
            });
        }
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }


        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
                },
                token
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        next(error);
    }
};


const getMe = async (req, res, next) => {
    try {
    
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    generateToken
};
