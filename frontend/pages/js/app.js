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

// Express middleware setup - Consolidated version
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware - Consolidated to avoid duplicates
app.use(express.static(path.join(__dirname, 'views', 'yamik')));
app.use('/static', express.static(path.join(__dirname, 'views')));
app.use('/css', express.static(path.join(__dirname, 'views', 'yamik', 'css')));
app.use('/js', express.static(path.join(__dirname, 'views', 'yamik', 'js')));
app.use('/images', express.static(path.join(__dirname, 'views', 'yamik', 'images')));

// Method override middlewares
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

// Add this after your other routes
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await R1.find({})
            .sort({ createdAt: -1 })
            .select('service date time location message status');
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ 
            error: 'Error fetching appointments',
            details: error.message 
        });
    }
});

app.put('/api/appointments/:id', async (req, res) => {
    try {
        const updatedAppointment = await R1.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(updatedAppointment);
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ error: 'Error updating appointment' });
    }
});

// Add this with your other routes
app.get('/api/notifications', async (req, res) => {
    try {
        const requests = await R1.find({})
            .sort({ createdAt: -1 })
            .select('service date time location status createdAt stylist price');

        const notifications = requests.map(request => ({
            id: request._id,
            type: request.status === 'accepted' ? 'booking_accepted' : 'booking_request',
            service: request.service,
            date: request.date,
            time: request.time,
            location: request.location,
            status: request.status,
            stylist: request.stylist,
            price: request.price,
            timestamp: request.createdAt,
            read: false
        }));

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Add a 404 handler - must be after all other routes
app.use((req, res, next) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    // Check if the request is an API call or static file
    if (req.url.startsWith('/api/') || req.url.includes('.')) {
        return res.status(404).json({ error: 'Resource not found' });
    }
    // For regular page requests, redirect to home
    res.redirect('/');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
