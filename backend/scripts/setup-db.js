#!/usr/bin/env node

/**
 * MongoDB Database Setup Script
 * This script initializes the portfolio database with collections and sample data
 * 
 * Usage: node setup-db.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

// Import models
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Contact = require('../models/Contact');
const Testimonial = require('../models/Testimonial');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

// Sample data
const sampleProjects = [
    {
        title: "E-Commerce Platform",
        subtitle: "Full-stack shopping experience",
        description: "A complete e-commerce solution built with React and Node.js featuring product catalog, shopping cart, payment integration, and order management system.",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        demoLink: "#",
        category: "E-Commerce",
        featured: true,
        order: 1,
        status: "active"
    },
    {
        title: "Task Management App",
        subtitle: "Collaborative productivity tool",
        description: "A real-time task management application with team collaboration features, project tracking, and automated notifications.",
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop",
        technologies: ["Vue.js", "Express", "MongoDB", "Socket.io"],
        demoLink: "#",
        category: "Web App",
        featured: true,
        order: 2,
        status: "active"
    },
    {
        title: "Weather Dashboard",
        subtitle: "Real-time weather analytics",
        description: "Interactive weather application fetching real-time data from multiple sources with beautiful visualizations and forecasting.",
        image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop",
        technologies: ["React", "API Integration", "Chart.js"],
        demoLink: "#",
        category: "Web App",
        featured: false,
        order: 3,
        status: "active"
    },
    {
        title: "Social Media Analytics",
        subtitle: "Comprehensive metrics dashboard",
        description: "SaaS platform for analyzing social media performance with detailed analytics, reporting, and predictive insights.",
        image: "https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=400&h=300&fit=crop",
        technologies: ["React", "Python", "PostgreSQL", "D3.js"],
        demoLink: "#",
        category: "SaaS",
        featured: true,
        order: 4,
        status: "active"
    },
    {
        title: "Fitness Tracker",
        subtitle: "Personal health monitoring",
        description: "Mobile-first fitness tracking application with workout logging, nutrition tracking, and AI-powered recommendations.",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
        technologies: ["React Native", "Firebase", "TensorFlow"],
        demoLink: "#",
        category: "Mobile",
        featured: false,
        order: 5,
        status: "active"
    }
];

const sampleServices = [
    {
        title: "Web Application Development",
        icon: "🚀",
        description: "Custom web applications built with modern technologies and best practices.",
        features: [
            "Responsive Design",
            "Progressive Web Apps",
            "Real-time Updates",
            "Mobile Optimization",
            "SEO Optimization"
        ],
        order: 1,
        status: "active"
    },
    {
        title: "API Development & Integration",
        icon: "🔌",
        description: "RESTful and GraphQL APIs with robust architecture and documentation.",
        features: [
            "RESTful Architecture",
            "GraphQL Implementation",
            "Third-party Integration",
            "Payment Gateway Setup",
            "API Documentation"
        ],
        order: 2,
        status: "active"
    },
    {
        title: "Database Design & Optimization",
        icon: "💾",
        description: "Efficient database architecture for scalable applications.",
        features: [
            "Schema Design",
            "Query Optimization",
            "Backup & Recovery",
            "Data Migration",
            "Performance Tuning"
        ],
        order: 3,
        status: "active"
    },
    {
        title: "Frontend Development",
        icon: "🎨",
        description: "Beautiful and interactive user interfaces with modern frameworks.",
        features: [
            "React Development",
            "Vue.js Development",
            "UI/UX Implementation",
            "Animation & Interactions",
            "Cross-browser Compatibility"
        ],
        order: 4,
        status: "active"
    },
    {
        title: "DevOps & Deployment",
        icon: "⚙️",
        description: "Continuous integration, deployment, and infrastructure management.",
        features: [
            "CI/CD Pipeline Setup",
            "Docker Containerization",
            "Cloud Deployment",
            "Server Management",
            "Performance Monitoring"
        ],
        order: 5,
        status: "active"
    }
];

const sampleTestimonials = [
    {
        clientName: "Sarah Johnson",
        clientTitle: "CEO",
        clientCompany: "TechStart Inc",
        testimonial: "Exceptional work! The team delivered a high-quality solution that exceeded our expectations. Highly professional and responsive throughout the project.",
        rating: 5,
        featured: true,
        status: "active",
        order: 1
    },
    {
        clientName: "Michael Chen",
        clientTitle: "Product Manager",
        clientCompany: "Digital Solutions",
        testimonial: "Great attention to detail and excellent communication. They understood our requirements perfectly and delivered on time.",
        rating: 5,
        featured: true,
        status: "active",
        order: 2
    },
    {
        clientName: "Emma Williams",
        clientTitle: "Founder",
        clientCompany: "Creative Agency",
        testimonial: "Outstanding technical skills combined with great problem-solving abilities. A pleasure to work with!",
        rating: 5,
        featured: false,
        status: "active",
        order: 3
    }
];

async function setupDatabase() {
    try {
        // Connect to MongoDB
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB successfully!\n');

        // Clear existing data (optional - comment out to keep data)
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            Project.deleteMany({}),
            Service.deleteMany({}),
            Testimonial.deleteMany({}),
            Contact.deleteMany({})
        ]);
        console.log('✅ Database cleared\n');

        // Insert sample projects
        console.log('📁 Adding sample projects...');
        const createdProjects = await Project.insertMany(sampleProjects);
        console.log(`✅ Created ${createdProjects.length} projects\n`);

        // Insert sample services
        console.log('⚙️  Adding sample services...');
        const createdServices = await Service.insertMany(sampleServices);
        console.log(`✅ Created ${createdServices.length} services\n`);

        // Insert sample testimonials
        console.log('⭐ Adding sample testimonials...');
        const createdTestimonials = await Testimonial.insertMany(sampleTestimonials);
        console.log(`✅ Created ${createdTestimonials.length} testimonials\n`);

        // Display summary
        console.log('═'.repeat(50));
        console.log('📊 DATABASE SETUP COMPLETE!');
        console.log('═'.repeat(50));
        console.log(`
✅ Projects:      ${createdProjects.length} items
✅ Services:      ${createdServices.length} items
✅ Testimonials:  ${createdTestimonials.length} items
✅ Contacts:      Ready for submissions
✅ Admin Users:   Setup in separate script

Database: ${MONGODB_URI.split('/').pop()}
Collections: projects, services, testimonials, contacts, admins

Your database is now ready to use!
        `);
        console.log('═'.repeat(50));
        console.log(`\n🚀 Next steps:
1. Run setup script: npm run setup (to create admin user)
2. Start backend:   npm run dev
3. Visit admin:     http://localhost:3001/admin

📝 Login Credentials (from admin setup):
   Username: admin
   Password: admin123
        `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
}

// Run setup
setupDatabase();
