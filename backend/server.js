const express = require('express');
const cors = require('cors');
const path = require('path');
const Razorpay = require('razorpay');
const connectDB = require('./config/db');
const crypto = require('crypto');
require('dotenv').config(); // Ensure dotenv is configured

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Ensure this is present to parse JSON request bodies
app.use(cors());

// Serve static files - update paths
app.use('/static', express.static(path.join(__dirname, '../frontend/pages/js/views/yamik')));
app.use('/', express.static(path.join(__dirname, '../frontend/pages/js/views/yamik')));

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/js/views/yamik/index.html'));
});

// Add notifications route
app.get('/notifications', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/js/views/yamik/notifications.html'));
});

// Import Razorpay instance
const razorpayInstance = require('./config/payment');

// Routes
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Payment Routes
app.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        console.log('Received amount:', amount); // Debug log

        // Validate amount
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid amount provided' });
        }

        const options = {
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt: `order_rcptid_${Date.now()}`
        };

        console.log('Creating order with options:', options); // Debug log

        const order = await razorpayInstance.orders.create(options);
        console.log('Order created:', order); // Debug log
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
});

app.post('/verify-payment', (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        // Generate signature for verification
        const generated_signature = crypto
            .createHmac('sha256', ' fU1Ss3psJJMHyIGR9qsURqnx')
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
        
        // Verify signature
        if (generated_signature === razorpay_signature) {
            res.json({ verified: true });
        } else {
            res.status(400).json({ verified: false });
        }
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
});

app.post('/api/admin-requests/:id/payment-complete', async (req, res) => {
    try {
        const request = await R1.findByIdAndUpdate(
            req.params.id,
            { status: 'paid' },
            { new: true }
        );
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.json({ message: 'Payment status updated', request });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Performing graceful shutdown...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
