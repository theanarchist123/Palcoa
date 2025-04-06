const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create test user
router.post('/testuser', async (req, res) => {
    try {
        const user = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'test123'
        });
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all test users
router.get('/testusers', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;
