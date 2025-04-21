const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
<<<<<<< HEAD
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// MongoDB Connection URL - replace with your MongoDB connection string
const MONGODB_URI = 'mongodb+srv://2023nikhilkadam:goodies987@cluster0.jpngk94.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// Enhanced MongoDB connection with error handling
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Monitor MongoDB connection
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.info('MongoDB reconnected');
});

// Appointment Model
const appointmentSchema = new mongoose.Schema({
  service: String,
  date: String,
  time: String,
  location: String,
  message: { type: String, default: "-" },
  birthday: String,
  place: String,
  // Add any other fields you need
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
=======
const connectDB = require('./config/db');
const app = express();

// Connect to MongoDB with retries
const connectWithRetry = async () => {
    try {
        await connectDB();
        console.log('MongoDB connection established');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        console.log('Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});
>>>>>>> 41ac2d2 (insta facebook)

// Enhanced CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('../frontend/pages/js/views/yamik'));

<<<<<<< HEAD
// Test endpoints
=======
// Health check endpoint with memory monitoring
app.get('/health', (req, res) => {
    const memoryUsage = process.memoryUsage();
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({
        status: 'up',
        uptime: process.uptime(),
        memory: {
            rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
            heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
            heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
            external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`
        },
        db: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Memory leak detection
let lastHeapUsed = 0;
setInterval(() => {
    const currentHeap = process.memoryUsage().heapUsed;
    if (lastHeapUsed > 0 && currentHeap > lastHeapUsed * 1.5) {
        console.warn(`Possible memory leak detected! Heap growth: ${lastHeapUsed} -> ${currentHeap}`);
    }
    lastHeapUsed = currentHeap;
}, 60000);

// Test endpoint
>>>>>>> 41ac2d2 (insta facebook)
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

<<<<<<< HEAD
// Handle /request endpoint
// Enhanced appointment submission endpoint
app.post('/request', async (req, res) => {
    try {
        // 1. Verify MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error('MongoDB not connected');
        }

        // 2. Parse and validate form data
        const { order } = req.body;
        if (!order) {
            return res.status(400).json({ error: 'Invalid form data' });
        }

        // 3. Create appointment document
        const appointmentData = {
            service: order.service || 'Not specified',
            date: order.date || new Date().toISOString().split('T')[0],
            time: order.time || 'Not specified',
            location: order.location || 'Not specified',
            message: order.message || '-',
            birthday: order.birthday || 'Not specified',
            place: order.place || 'Not specified',
            createdAt: new Date()
        };

        // 4. Save to database with error handling
        const newAppointment = new Appointment(appointmentData);
        const savedAppointment = await newAppointment.save();
        
        // 5. Verify the document was created
        const dbAppointment = await Appointment.findById(savedAppointment._id);
        if (!dbAppointment) {
            throw new Error('Failed to verify document creation');
        }

        // 6. Return success response
        res.json({
            success: true,
            appointment: savedAppointment,
            databaseId: savedAppointment._id
        });

    } catch (err) {
        console.error('Appointment submission error:', err);
        res.status(500).json({ 
            error: err.message,
            details: 'Check server logs and MongoDB connection'
        });
    }
});

// MongoDB test endpoint
app.get('/db-status', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    res.json({ 
        dbStatus: statusMap[dbStatus] || 'unknown',
        readyState: dbStatus
    });
});

// Initialize Razorpay
=======
// Initialize Razorpay with env variables
>>>>>>> 41ac2d2 (insta facebook)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Memory monitoring and keep-alive ping
setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log('[Keep-alive] Server status:', {
        uptime: `${process.uptime().toFixed(2)}s`,
        memory: {
            rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
            heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
            heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
            external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`
        },
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
}, 30000);

// Handle uncaught exceptions (prevent crash)
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Don't exit - log and continue
});

// Handle unhandled promise rejections (prevent crash)
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    // Don't exit - log and continue
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
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
    });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Network accessible at:', `http://${require('os').networkInterfaces().eth0?.[0]?.address || 'localhost'}:${PORT}`);
    console.log('Process ID:', process.pid);
});

// Track server shutdown
server.on('close', () => {
    console.log('Server is shutting down...');
    console.log('Last memory usage:', process.memoryUsage());
    console.log('Uptime:', process.uptime(), 'seconds');
});

// Track process exit
process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
});

// Enhanced keep-alive settings
server.keepAliveTimeout = 60000;
server.headersTimeout = 65000;

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    } else {
        console.error('Server error:', error);
    }
});
