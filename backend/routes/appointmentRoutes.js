const express = require('express');
const router = express.Router();
const R1 = require('../models/salon');

router.post('/request', async (req, res) => {
    try {
        const { service, date, time, location, message } = req.body;
        
        const newAppointment = new R1({
            service,
            date,
            time,
            location,
            message: message || "-",
            createdAt: new Date()
        });

        const savedAppointment = await newAppointment.save();
        res.status(201).json({
            success: true,
            appointment: savedAppointment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
