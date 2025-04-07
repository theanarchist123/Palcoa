const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const R1 = require('./salon'); // Make sure 'salon.js' exports your model as ORDER

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
    serverSelectionTimeoutMS: 10000
};

console.log("Attempting to connect to MongoDB Atlas...");
mongoose.connect(uri, options)
.then(() => console.log('Connected to MongoDB Atlas successfully'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Please ensure:');
    console.log('1. Your IP address is whitelisted in MongoDB Atlas at https://cloud.mongodb.com');
    console.log('2. Try accessing MongoDB Atlas dashboard in your browser first to verify credentials');
    console.log('3. Your network allows outbound connections to MongoDB (port 27017)');
});

const app = express();
app.set('views', path.join(__dirname, 'views'));

// Serve static files - VERY IMPORTANT for CSS and JS to load correctly
app.use('/yamik', express.static(path.join(__dirname, 'views', 'yamik'))); // For files in views/yamik (like admin.html, contact.html)
app.use(express.static(path.join(__dirname, 'views'))); // For files in views (if any)
app.use('/frontend/pages', express.static(path.join(__dirname, 'frontend', 'pages'))); // For your CSS, images, frontend JS - Add this line!


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Route to serve admin page (admin.html)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'admin.html'));
});

// Route to serve homepage (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'index.html')); // Or wherever your index.html is
});

// Route to serve contact page (contact.html)
app.get('/yamik/contact', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'contact.html'));
});

// Route to handle contact form submission (POST request from contact.html)
// Route to handle contact form submission (POST request from contact.html)
app.post('/request', async (req, res) => {
    console.log("Contact form submission received!");
    console.log("Request body:", req.body);
    try {
        const orderData = req.body.order; // Get the 'order' object from req.body

        const newRequest = new R1({ // Use R1 (or ORDER if you changed it) - be consistent with your model variable
            name: orderData.name,        // Explicitly map each field
            contact: orderData.contact,
            email: orderData.email,
            service: orderData.service,
            date: orderData.date,          // Explicitly include the 'date' field
            time: orderData.time,
            location: orderData.location,
            message: orderData.message
        });

        console.log("New request object created:", newRequest);
        await newRequest.save();
        console.log("Request saved to database successfully!");
        res.redirect('/yamik/contact.html'); // Redirect back to contact page
    } catch (error) {
        console.error("Error saving request to database:", error);
        res.status(500).send("Error submitting request. Please try again.");
    }
});

app.get('/yamik/about', (req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'about.html'));
});

app.get('/yamik/services', (req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'services.html'));
});
app.get('/yamik/products', (req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'yamik', 'products.html'));
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