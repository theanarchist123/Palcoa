const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    services: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Salon', salonSchema);