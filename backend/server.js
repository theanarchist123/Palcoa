const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend/pages/js/views/yamik'));

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: 'rzp_test_YOUR_KEY_HERE',
    key_secret: 'YOUR_SECRET_KEY_HERE'
});

// Payment endpoint
app.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: req.body.amount,
            currency: 'INR',
            receipt: 'order_' + Date.now()
        };
        
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
