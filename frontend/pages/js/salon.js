const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    name: String,
    contact: Number,
    email: String,
    service: String,
    message: String
});

module.exports = mongoose.model('R1', Order);