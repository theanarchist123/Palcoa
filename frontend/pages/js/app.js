const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const R1 = require('./salon'); // Make sure 'salon.js' exports your model as ORDER
/*const R2 = require('../models/User'); see this*/   
mongoose.connect('mongodb+srv://2023nikhilkadam:goodies987@cluster0.jpngk94.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const app = express();
app.set('views', path.join(__dirname, 'views'));

// Serve static files - Corrected paths
app.use(express.static(path.join(__dirname, '../../'))); // Serves from frontend/pages
app.use('/css', express.static(path.join(__dirname, '../../css'))); 
app.use('/js', express.static(path.join(__dirname, '../../js')));
app.use('/img', express.static(path.join(__dirname, '../../img')));


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