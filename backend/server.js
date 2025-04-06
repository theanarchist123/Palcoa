const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const app = express();

// Enhanced CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static('../frontend/pages/js/views/yamik'));

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
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
