const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    message: { type: String, default: "-" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('R1', Order);