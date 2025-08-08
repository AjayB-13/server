const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Register
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        res.json({ message: 'User registered', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
        await user.save();

        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        
        try {
            await sendEmail(
                email,
                'Password Reset',
                `<p>Click the link to reset your password:</p><a href="${resetURL}">${resetURL}</a>`
            );
        } catch (emailErr) {
            console.warn("Email sending failed:", emailErr.message);
        }

        // ✅ Also return token for frontend dev auto-redirect
        res.json({
            message: 'Password reset link sent',
            token: resetToken
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
