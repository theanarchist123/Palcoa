const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ _id: user.id, name: user.name, email: user.email });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({ token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' }) });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

module.exports = { registerUser, loginUser };