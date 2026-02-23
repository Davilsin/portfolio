const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { isAuthenticated } = require('../middleware/auth');

// Get all testimonials (public)
router.get('/', async (req, res) => {
    try {
        const { featured, status } = req.query;
        let query = {};
        
        if (featured === 'true') query.featured = true;
        if (status) query.status = status;
        else query.status = 'active';

        const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching testimonials' });
    }
});

// Get single testimonial (public)
router.get('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching testimonial' });
    }
});

// Create testimonial (admin only)
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const testimonial = new Testimonial(req.body);
        await testimonial.save();
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(400).json({ error: 'Error creating testimonial', details: error.message });
    }
});

// Update testimonial (admin only)
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }
        res.json(testimonial);
    } catch (error) {
        res.status(400).json({ error: 'Error updating testimonial', details: error.message });
    }
});

// Delete testimonial (admin only)
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }
        res.json({ success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting testimonial' });
    }
});

module.exports = router;
