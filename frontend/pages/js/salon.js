const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    
    service: String,
    date: String,
    time: String,
    location: String,
    message: String
});

module.exports = mongoose.model('R1', Order);