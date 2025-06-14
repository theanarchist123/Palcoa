const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const { sendBookingStatusEmail } = require(path.join(__dirname, '../../../backend/utils/emailService')); // Use absolute path
const R1 = require('./salon');
const User = require('./user');
const https = require('https');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

const app = express();

// Configure CORS
app.use(cors({
    origin: [
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// MongoDB Connection
mongoose.connect('mongodb+srv://2023nikhilkadam:goodies987@cluster0.jpngk94.mongodb.net/salon?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log("MongoDB Connection Successful!");
})
.catch((err) => {
    console.error("MongoDB Connection Error:", err);
});

mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
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

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'about.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'services.html'));
});

app.get('/portfolio', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'portfolio.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'contact.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'products.html'));
});

// Authentication routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'signup.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'register.html'));
});

// Profile page (protected)
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'profile.html'));
});

// Admin page (protected)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'admin.html'));
});

// User registration route
app.post('/api/register', async (req, res) => {
    try {
        console.log("Registration request received:", req.body);

        const { firstName, lastName, email, phone, password } = req.body;

        if (!firstName || !lastName || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Email already registered"
            });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password,
            createdAt: new Date()
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "Registration successful"
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            error: "Registration failed"
        });
    }
});

// User login route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Missing credentials",
                details: "Email and password are required"
            });
        }
        
        const user = await User.findOne({ email });
        
        if (!user || user.password !== password) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials",
                details: "Email or password is incorrect"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({
            success: false,
            error: "Login failed",
            details: error.message
        });
    }
});

// Update contact form submission endpoint
app.post('/request', async (req, res) => {
    try {
        console.log("Contact form submission received:", req.body);

        // Validate required fields including email
        if (!req.body.service || !req.body.date || !req.body.time || !req.body.location || !req.body.email) {
            console.log("Missing required fields:", req.body);
            return res.status(400).json({ 
                success: false,
                error: "Missing required fields",
                details: "All fields are required except message"
            });
        }

        // Create new appointment request
        const newRequest = new R1({
            service: req.body.service,
            date: req.body.date,
            time: req.body.time,
            location: req.body.location,
            message: req.body.message || "-",
            email: req.body.email,
            status: 'pending',
            createdAt: new Date()
        });

        const savedRequest = await newRequest.save();
        console.log("Request saved successfully:", savedRequest);
        
        res.status(200).json({ 
            success: true,
            message: "Request saved successfully",
            data: savedRequest
        });
    } catch (error) {
        console.error("Error saving request:", error);
        res.status(500).json({ 
            success: false,
            error: "Error saving your request",
            details: error.message 
        });
    }
});

// Protected routes
app.get('/admin-requests', async (req, res) => {
    try {
        const requests = await R1.find({}).sort({ date: -1 });
        res.json(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ error: 'Error fetching requests' });
    }
});

// Get all admin requests
app.get('/api/admin-requests', async (req, res) => {
    try {
        const requests = await R1.find()
            .sort({ createdAt: -1 })
            .select('service date time location message email status createdAt');
        res.json(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ 
            error: 'Error fetching requests',
            details: error.message 
        });
    }
});

// Accept request
app.post('/api/admin-requests/:id/accept', async (req, res) => {
    try {
        const request = await R1.findByIdAndUpdate(
            req.params.id,
            { status: 'accepted' },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        await sendBookingStatusEmail(
            request.email,
            'accepted',
            {
                service: request.service,
                date: request.date,
                time: request.time,
                location: request.location
            }
        );

        res.json({ 
            message: 'Request accepted',
            request 
        });
    } catch (error) {
        console.error('Error accepting request:', error);
        res.status(500).json({ error: error.message });
    }
});

// Decline request
app.post('/api/admin-requests/:id/decline', async (req, res) => {
    try {
        const request = await R1.findByIdAndUpdate(
            req.params.id,
            { status: 'declined' },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        await sendBookingStatusEmail(
            request.email,
            'declined',
            {
                service: request.service,
                date: request.date,
                time: request.time,
                location: request.location
            }
        );

        res.json({ 
            message: 'Request declined',
            request 
        });
    } catch (error) {
        console.error('Error declining request:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add appointments API endpoints
app.get('/api/appointments', async (req, res) => {
    try {
        console.log('Fetching appointments...');
        const appointments = await R1.find({})
            .sort({ createdAt: -1 })
            .lean();
        console.log('Appointments found:', appointments);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Add update appointment endpoint
app.put('/api/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { service, date, time, message } = req.body;
        
        const updatedAppointment = await R1.findByIdAndUpdate(
            id,
            { service, date, time, message },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
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
    console.log(`404: ${req.method} ${req.url}`);
    if (req.url.startsWith('/api/') || req.url.includes('.')) {
        return res.status(404).json({ error: 'Resource not found' });
    }
    res.redirect('/');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Make sure your User model is properly defined
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});