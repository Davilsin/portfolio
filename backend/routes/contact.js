const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const Contact = require('../models/Contact');
const { isAuthenticated } = require('../middleware/auth');
const { sendAdminNotification, sendUserConfirmation } = require('../services/emailService');

// Rate limiting for contact form - max 5 submissions per IP per 1 hour
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many contact submissions from this IP, please try again after an hour',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({ 
            error: 'Too many contact submissions. Please wait before sending another message.',
            retryAfter: req.rateLimit.resetTime 
        });
    }
});

// Validation middleware
const validateContactForm = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('service')
        .trim()
        .optional()
        .isLength({ max: 100 }).withMessage('Service must not exceed 100 characters'),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters')
];

// Submit contact form (public)
router.post('/', contactLimiter, validateContactForm, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors.array().map(err => ({ field: err.param, message: err.msg }))
        });
    }

    try {
        console.log('📨 New contact submission received:', {
            name: req.body.name,
            email: req.body.email,
            service: req.body.service
        });

        const contact = new Contact(req.body);
        await contact.save();
        
        console.log('✅ Contact saved to database:', contact._id);
        
        // Send emails asynchronously (don't wait for them)
        setImmediate(async () => {
            try {
                console.log('📧 Sending notification emails...');
                await sendAdminNotification(contact);
                await sendUserConfirmation(contact);
                console.log('✅ Email notifications processed');
            } catch (emailError) {
                console.error('⚠️  Error in email notifications:', emailError);
            }
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Message sent successfully',
            contactId: contact._id 
        });
    } catch (error) {
        console.error('❌ Error submitting contact form:', error);
        res.status(400).json({ error: 'Error submitting contact form', details: error.message });
    }
});

// Get all contacts (admin only)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const contacts = await Contact.find(query).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching contacts' });
    }
});

// Get single contact (admin only)
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching contact' });
    }
});

// Update contact status (admin only)
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        res.status(400).json({ error: 'Error updating contact', details: error.message });
    }
});

// Delete contact (admin only)
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting contact' });
    }
});

module.exports = router;
