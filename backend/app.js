const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const Razorpay = require('razorpay');

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend/pages/js/views/yamik')));

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: 'rzp_test_bAseycHKzzaPQt',
    key_secret: ' fU1Ss3psJJMHyIGR9qsURqnx'
});

// Routes
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Import route handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
    });
});

module.exports = app;
