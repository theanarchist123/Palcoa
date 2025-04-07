const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: 'rzp_test_YOUR_KEY_HERE',
    key_secret: 'YOUR_SECRET_KEY_HERE'
});

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
