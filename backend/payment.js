const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: 'rzp_tesrzp_test_bAseycHKzzaPQt',
    key_secret: '6Y3bAQzpb6eOLlSarBzg5cl',
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

(async () => {
    try {
        const testOrder = await razorpay.orders.create({
            amount: 500 * 100, // 500 INR in paise
            currency: 'INR',
            receipt: `test_order_${Date.now()}`
        });
        console.log('Test Order Created:', testOrder);
    } catch (error) {
        console.error('Error creating test order:', error);
    }
})();
