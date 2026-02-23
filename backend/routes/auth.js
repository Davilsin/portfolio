const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { isAuthenticated } = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Set session
        req.session.adminId = admin._id;
        req.session.role = admin.role;
        req.session.username = admin.username;
        req.session.email = admin.email;

        res.json({
            success: true,
            message: 'Login successful',
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error during logout' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Check authentication status (Public endpoint - doesn't require auth)
router.get('/check', (req, res) => {
    if (req.session && req.session.adminId) {
        res.json({
            authenticated: true,
            admin: {
                id: req.session.adminId,
                username: req.session.username,
                email: req.session.email,
                role: req.session.role
            }
        });
    } else {
        res.json({
            authenticated: false
        });
    }
});

// Update password (admin only)
router.post('/update-password', isAuthenticated, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.trim() === '') {
            return res.status(400).json({ error: 'Password is required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const admin = await Admin.findById(req.session.adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        admin.password = password;
        await admin.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Error updating password' });
    }
});

// Create initial admin (for setup only - remove in production)
router.post('/setup', async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        const admin = new Admin({
            username: 'admin',
            email: 'admin@portfolio.com',
            password: 'admin123', // Change this!
            role: 'superadmin'
        });

        await admin.save();
        res.json({ success: true, message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating admin' });
    }
});

module.exports = router;
