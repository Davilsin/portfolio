const express = require('express');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Import email service
const { testEmailConfiguration } = require('./services/emailService');

// Middleware
app.use(compression()); // Enable gzip compression

// Cache Control Headers - Set caching strategy for static assets
app.use((req, res, next) => {
    // Cache static assets for 1 week
    if (req.url.match(/\.(css|js|svg|png|jpg|jpeg|gif|woff|woff2|ttf|eot)$/)) {
        res.set('Cache-Control', 'public, max-age=604800'); // 1 week
    } else if (req.url.match(/\.(html)$/)) {
        // Don't cache HTML files - always fetch fresh
        res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    } else {
        // Default for API responses
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    next();
});

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Test Email Configuration
testEmailConfiguration().then(isValid => {
    if (!isValid) {
        console.log('⚠️  Warning: Email service not configured. Contact notifications will not be sent.');
        console.log('📧 Please configure EMAIL_USER and EMAIL_PASSWORD in .env file');
    }
});

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const serviceRoutes = require('./routes/services');
const contactRoutes = require('./routes/contact');
const testimonialRoutes = require('./routes/testimonials');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', adminRoutes);

// Serve admin dashboard login
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

// Serve admin dashboard
app.get('/admin/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

// Serve frontend
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/admin')) {
        res.sendFile(path.join(__dirname, '../index.html'));
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin dashboard: http://localhost:${PORT}/admin`);
});

module.exports = app;
