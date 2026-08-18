const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutrimind';

    try {
        const conn = await mongoose.connect(uri, {
            family: 4 // Force IPv4 to prevent Windows OpenSSL IPv6 TLS alert 80 errors
        });
        console.log(`🚀 MongoDB Atlas Cloud Connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error(`MongoDB Cloud Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;


