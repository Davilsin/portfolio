const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { isAuthenticated } = require('../middleware/auth');

// Get all services (public)
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({ status: 'active' }).sort({ order: 1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching services' });
    }
});

// Get single service (public)
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching service' });
    }
});

// Create service (admin only)
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ error: 'Error creating service', details: error.message });
    }
});

// Update service (admin only)
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        res.status(400).json({ error: 'Error updating service', details: error.message });
    }
});

// Delete service (admin only)
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting service' });
    }
});

module.exports = router;
