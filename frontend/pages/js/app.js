const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const R1 = require('./salon');

// Initialize express
const app = express();

// MongoDB Connection
mongoose.connect('mongodb+srv://2023nikhilkadam:goodies987@cluster0.jpngk94.mongodb.net/salon?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
})
.then(() => {
    console.log("MongoDB Connection Successful!");
})
.catch((err) => {
    console.error("MongoDB Connection Error:", err);
});

// Express middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views', 'yamik')));
app.use(methodOverride('_method'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'index.html'));
});

// Contact form submission
app.post('/request', async (req, res) => {
    try {
        const { service, date, time, location, message } = req.body;

        const newRequest = new R1({
            service, 
            date,
            time, 
            location,
            message: message || "-",
            createdAt: new Date()
        });

        const savedRequest = await newRequest.save();
        res.status(201).json({
            success: true,
            message: "Request saved successfully",
            data: savedRequest
        });
    } catch (error) {
        console.error("Error saving request:", error);
        res.status(500).json({ 
            error: "Error saving request",
            details: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;