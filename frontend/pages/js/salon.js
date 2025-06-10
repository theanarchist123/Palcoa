const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    service: { 
        type: String, 
        required: [true, 'Service is required'],
        enum: ['Facials', 'Hair Styling', 'Full Body Massage', 'Manicure', 'Pedicure']
    },
    date: { 
        type: String, 
        required: [true, 'Date is required'] 
    },
    time: { 
        type: String, 
        required: [true, 'Time is required'] 
    },
    location: { 
        type: String, 
        required: [true, 'Location is required'],
        enum: ['Kalyan', 'Andheri', 'Dadar', 'Matunga', 'Dombivali', 'Thane', 'Bandra', 'Ghatkopar', 'Mulund']
    },
    message: { 
        type: String, 
        default: "-" 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'] 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('R1', Order);
