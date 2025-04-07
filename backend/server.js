const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Appointment Model
const appointmentSchema = new mongoose.Schema({
  service: String,
  date: String,
  time: String,
  location: String,
  message: { type: String, default: "-" },
  birthday: String,
  place: String,
  // Add any other fields you need
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Enhanced CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('../frontend/pages/js/views/yamik'));

// Test endpoints
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Handle /request endpoint
// Enhanced appointment submission endpoint
app.post('/request', async (req, res) => {
    try {
        // 1. Verify MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error('MongoDB not connected');
        }

        // 2. Parse and validate form data
        const { order } = req.body;
        if (!order) {
            return res.status(400).json({ error: 'Invalid form data' });
        }

        // 3. Create appointment document
        const appointmentData = {
            service: order.service || 'Not specified',
            date: order.date || new Date().toISOString().split('T')[0],
            time: order.time || 'Not specified',
            location: order.location || 'Not specified',
            message: order.message || '-',
            birthday: order.birthday || 'Not specified',
            place: order.place || 'Not specified',
            createdAt: new Date()
        };

        // 4. Save to database with error handling
        const newAppointment = new Appointment(appointmentData);
        const savedAppointment = await newAppointment.save();
        
        // 5. Verify the document was created
        const dbAppointment = await Appointment.findById(savedAppointment._id);
        if (!dbAppointment) {
            throw new Error('Failed to verify document creation');
        }

        // 6. Return success response
        res.json({
            success: true,
            appointment: savedAppointment,
            databaseId: savedAppointment._id
        });

    } catch (err) {
        console.error('Appointment submission error:', err);
        res.status(500).json({ 
            error: err.message,
            details: 'Check server logs and MongoDB connection'
        });
    }
});

// MongoDB test endpoint
app.get('/db-status', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    res.json({ 
        dbStatus: statusMap[dbStatus] || 'unknown',
        readyState: dbStatus
    });
});

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: 'rzp_test_YOUR_KEY_HERE',
    key_secret: 'YOUR_SECRET_KEY_HERE'
});

// Payment endpoint with error handling
app.post('/create-order', async (req, res) => {
    try {
        if (!req.body.amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        const options = {
            amount: req.body.amount,
            currency: 'INR',
            receipt: 'order_' + Date.now()
        };
        
        const order = await razorpay.orders.create(options);
        console.log('Order created:', order);
        res.json(order);
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    } else {
        console.error('Server error:', error);
    }
});
