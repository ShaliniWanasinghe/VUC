const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, userId: user.userId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// POST /api/auth/login
const login = async (req, res) => {
    const { userId, password } = req.body;
    console.log(`🔑 Login attempt for: "${userId}"`);

    if (!userId || !password) {
        return res.status(400).json({ message: 'User ID and password are required.' });
    }

    try {
        const identifier = userId.trim();
        // Find user by userId OR email
        const user = await User.findOne({
            $or: [
                { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                { email: identifier.toLowerCase() }
            ]
        });

        if (!user) {
            console.log(`❌ User not found: "${identifier}"`);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`❌ Password mismatch for: "${identifier}"`);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        console.log(`✅ Login successful for: "${user.userId}"`);
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                userId: user.userId,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/auth/register
const register = async (req, res) => {
    const { userId, name, email, password, role } = req.body;

    if (!userId || !name || !email || !password) {
        return res.status(400).json({ message: 'User ID, name, email, and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ message: 'User ID already exists.' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const user = await User.create({
            userId,
            name,
            email,
            password,
            role: role || 'student'
        });

        const token = generateToken(user);

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                userId: user.userId,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { login, register };
