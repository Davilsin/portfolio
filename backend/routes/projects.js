const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { isAuthenticated } = require('../middleware/auth');

// Get all projects (public)
router.get('/', async (req, res) => {
    try {
        const { featured, status } = req.query;
        let query = {};
        
        if (featured === 'true') query.featured = true;
        if (status) query.status = status;
        else query.status = 'active'; // Default to active only

        const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

// Get single project (public)
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching project' });
    }
});

// Create project (admin only)
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: 'Error creating project', details: error.message });
    }
});

// Update project (admin only)
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: 'Error updating project', details: error.message });
    }
});

// Delete project (admin only)
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting project' });
    }
});

module.exports = router;
