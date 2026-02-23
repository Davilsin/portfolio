require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function setupAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({});
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log(`Username: ${existingAdmin.username}`);
            console.log('If you want to reset, please delete the admin from database first.');
            process.exit(0);
        }

        // Create initial admin
        const admin = new Admin({
            username: process.env.ADMIN_USERNAME || 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            role: 'superadmin'
        });

        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('Login Credentials:');
        console.log(`Username: ${admin.username}`);
        console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
        console.log('');
        console.log('⚠️  IMPORTANT: Change the password after first login!');
        console.log('');
        console.log('You can now access the admin dashboard at:');
        console.log(`http://localhost:${process.env.PORT || 3001}/admin`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up admin:', error);
        process.exit(1);
    }
}

setupAdmin();
