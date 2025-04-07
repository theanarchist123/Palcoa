const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const R1 = require('./salon'); // Make sure 'salon.js' exports your model as ORDER
const https = require('https');

// Force Node.js to use TLSv1.2 (the most compatible version)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // ONLY FOR DEVELOPMENT

// Standard MongoDB Atlas connection string format
const uri = "mongodb+srv://2023nikhilkadam:goodies987@cluster0.jpngk94.mongodb.net/?retryWrites=true&w=majority";

// Set MongoDB driver options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsAllowInvalidCertificates: true, // ONLY FOR DEVELOPMENT
    tlsAllowInvalidHostnames: true, // ONLY FOR DEVELOPMENT
    serverSelectionTimeoutMS: 30000, // Increased timeout
    heartbeatFrequencyMS: 2000,     // More frequent heartbeats
    retryWrites: true,
    w: 'majority'
};

console.log("Attempting to connect to MongoDB Atlas...");

// Add function to get current IP address
const getCurrentIP = () => {
    return new Promise((resolve, reject) => {
        https.get('https://api.ipify.org', (resp) => {
            let data = '';
            resp.on('data', (chunk) => { data += chunk; });
            resp.on('end', () => resolve(data));
        }).on('error', (err) => {
            console.error('Error fetching IP:', err);
            resolve('Unable to fetch IP');
        });
    });
};

// Improved connection handling
const connectDB = async () => {
    try {
        await mongoose.connect(uri, options);
        console.log('Connected to MongoDB Atlas successfully');
        return true;
    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', 'MongoDB Connection Error:'); // Red text
        console.error(err);
        
        // Fetch current IP address
        const currentIP = await getCurrentIP();
        
        console.log('\x1b[33m%s\x1b[0m', '\nTroubleshooting steps:'); // Yellow text
        console.log('1. Add your current IP address to MongoDB Atlas whitelist:');
        console.log(`   Your current IP address is: ${currentIP}`);
        console.log('   To add it to MongoDB Atlas:');
        console.log('   a. Go to: https://cloud.mongodb.com');
        console.log('   b. Select your project/cluster');
        console.log('   c. Click "Network Access" in the left sidebar');
        console.log('   d. Click "Add IP Address"');
        console.log(`   e. Enter your IP: ${currentIP}`);
        console.log('   f. Click "Confirm"');
        console.log('\n2. Check your MongoDB Atlas credentials');
        console.log('3. Ensure your network firewall allows outbound connections to port 27017');
        return false;
    }
};

// Initial connection attempt
connectDB().then(connected => {
    if (!connected) {
        console.log('\nRetrying connection in 5 seconds...');
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
});

// Add connection monitoring
mongoose.connection.on('disconnected', () => {
    console.log('\x1b[31m%s\x1b[0m', 'Lost MongoDB connection. Attempting to reconnect...');
    connectDB();
});

const app = express();
app.set('views', path.join(__dirname, 'views'));

// Add these lines for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Updated static file serving
app.use(express.static(path.join(__dirname, 'views', 'yamik')));
app.use('/static', express.static(path.join(__dirname, 'views')));

app.use(methodOverride('_method'));

// Root route - serves index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'index.html'));
});

// Routes for all pages
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

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'login.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'payment.html'));
});

app.get('/payment-gateway', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'payment-gateway.html'));
});

app.get('/notifications', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'notifications.html'));
});

// Add admin page route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'admin.html'));
});

// Route to handle contact form submission (POST request from contact.html)
app.post('/request', async (req, res) => {
    console.log("Contact form submission received!");
    console.log("Request body:", req.body);
    
    try {
        const { service, date, time, location, message } = req.body;

        // Basic validation first
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                error: 'Invalid request body',
            });
        }

        // Enhanced validation with specific error messages
        const missingFields = [];
        if (!service || service.trim() === '') missingFields.push('service');
        if (!date || date.trim() === '') missingFields.push('date');
        if (!time || time.trim() === '') missingFields.push('time');
        if (!location || location.trim() === '') missingFields.push('location');

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missingFields.join(', ')}`,
                missingFields: missingFields
            });
        }

        // Additional validation
        const today = new Date().toISOString().split('T')[0];
        if (date < today) {
            return res.status(400).json({
                error: 'Invalid date. Please select a future date.'
            });
        }

        // Create new request with the form data
        const newRequest = new R1({
            service: service.trim(),
            date: date.trim(),
            time: time.trim(),
            location: location.trim(),
            message: message ? message.trim() : '-'
        });

        console.log("New request object created:", newRequest);
        const savedRequest = await newRequest.save();
        console.log("Request saved to database successfully:", savedRequest);

        // Send success response
        return res.status(200).json({
            message: 'Request saved successfully',
            data: savedRequest
        });
    } catch (error) {
        console.error("Error saving request:", error);
        return res.status(500).json({
            error: 'Error saving request',
            details: error.message
        });
    }
});

// Route to fetch booking requests data for admin page (API endpoint for admin.html)
app.get('/api/admin-requests', async (req, res) => {
    try {
        const requests = await R1.find({});
        console.log("Fetched requests from database:", requests);
        res.json(requests);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});