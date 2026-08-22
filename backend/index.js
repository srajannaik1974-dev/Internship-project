const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const foodRoutes = require('./routes/foodRoutes');
const aiRoutes = require('./src/routes/ai.routes');

const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to MongoDB
connectDB();

const app = express();

// Security and Logging Middleware
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        // Echo back requesting origin string to satisfy browser credentials spec
        callback(null, origin || 'http://localhost:5173');
    },
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Routes
app.get('/', (req, res) => {
    res.send('<h1>NutriMind Backend is Working 🚀</h1>');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'NutriMind API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/food', foodRoutes); // Alias for frontend compatibility
app.use('/api', aiRoutes);        // AI analysis & daily insight routes

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
