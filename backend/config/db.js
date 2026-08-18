const mongoose = require('mongoose');

const connectDB = async () => {
    const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutrimind';
    const fallbackUri = 'mongodb://127.0.0.1:27017/nutrimind';

    try {
        const conn = await mongoose.connect(primaryUri);
        console.log(`Database connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.warn(`Primary MongoDB connection failed (${error.message}). Switching to local fallback database...`);
        try {
            const conn = await mongoose.connect(fallbackUri);
            console.log(`Database connected (local fallback): ${conn.connection.host}/${conn.connection.name}`);
        } catch (fallbackError) {
            console.error(`Database connection error: ${fallbackError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;


