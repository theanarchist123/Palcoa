const Salon = require('../models/Salon');
exports.getSalons = async (req, res) => {
    try {
        const salons = await Salon.find();
        res.json(salons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
