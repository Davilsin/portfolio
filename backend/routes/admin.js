const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Contact = require('../models/Contact');
const Testimonial = require('../models/Testimonial');
const fs = require('fs');
const path = require('path');

// Get dashboard statistics
router.get('/stats', isAuthenticated, async (req, res) => {
    try {
        const stats = {
            projects: {
                total: await Project.countDocuments(),
                active: await Project.countDocuments({ status: 'active' }),
                featured: await Project.countDocuments({ featured: true })
            },
            services: {
                total: await Service.countDocuments(),
                active: await Service.countDocuments({ status: 'active' })
            },
            contacts: {
                total: await Contact.countDocuments(),
                new: await Contact.countDocuments({ status: 'new' }),
                read: await Contact.countDocuments({ status: 'read' }),
                replied: await Contact.countDocuments({ status: 'replied' })
            },
            testimonials: {
                total: await Testimonial.countDocuments(),
                active: await Testimonial.countDocuments({ status: 'active' }),
                featured: await Testimonial.countDocuments({ featured: true })
            }
        };

        // Recent contacts (last 5)
        const recentContacts = await Contact.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email message status createdAt');

        stats.recentContacts = recentContacts;

        res.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Error fetching dashboard statistics' });
    }
});

// Debug endpoint - Get email logs
router.get('/debug/emails', isAuthenticated, (req, res) => {
    try {
        const logsDir = path.join(__dirname, '../logs');
        const logFile = path.join(logsDir, 'emails.log');
        
        if (!fs.existsSync(logFile)) {
            return res.json({
                message: 'No email logs found yet',
                logPath: logFile,
                status: '✅ System ready - awaiting contact submissions'
            });
        }
        
        const content = fs.readFileSync(logFile, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        const emails = lines.map(line => {
            try {
                return JSON.parse(line);
            } catch (e) {
                return { raw: line };
            }
        });
        
        res.json({
            totalEmails: emails.length,
            emails: emails.reverse().slice(0, 20), // Last 20 emails
            message: 'Email logs (most recent first)',
            logPath: logFile
        });
    } catch (error) {
        res.status(500).json({ error: 'Error reading email logs', details: error.message });
    }
});

// Debug endpoint - Get system status
router.get('/debug/status', isAuthenticated, (req, res) => {
    res.json({
        status: 'running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        emailConfig: {
            user: process.env.EMAIL_USER !== 'your-email@gmail.com' ? '✅ Configured' : '❌ Not configured (using placeholder)',
            password: process.env.EMAIL_PASSWORD !== 'your-app-password' ? '✅ Configured' : '❌ Not configured (using placeholder)',
            host: process.env.EMAIL_HOST || 'Not set',
            port: process.env.EMAIL_PORT || '587'
        },
        database: {
            uri: process.env.MONGODB_URI ? '✅ Configured' : '❌ Not configured'
        }
    });
});

// Get all data for admin (with pagination)
router.get('/all', isAuthenticated, async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1 });
        const services = await Service.find().sort({ order: 1 });
        const testimonials = await Testimonial.find().sort({ order: 1 });
        const contacts = await Contact.find().sort({ createdAt: -1 }).limit(50);

        res.json({
            projects,
            services,
            testimonials,
            contacts
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

module.exports = router;
