const Appointment = require('../models/Appointment');
exports.createAppointment = async (req, res) => {
    try {
        const appointment = new Appointment({ ...req.body, user: req.user.id });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
