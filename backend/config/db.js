const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
<<<<<<< HEAD
        await mongoose.connect('mongodb+srv://2023nikhilkadam:goodies987@cluster0.jpngk94.mongodb.net/palcoa?retryWrites=true&w=majority');
=======
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
>>>>>>> 41ac2d2 (insta facebook)
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        // Exit process with failure
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = connectDB;
