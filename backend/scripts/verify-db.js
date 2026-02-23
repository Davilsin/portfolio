#!/usr/bin/env node

/**
 * MongoDB Connection Verification Script
 * Checks MongoDB installation and connectivity
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

async function verifyConnection() {
    try {
        console.log('\n🔍 MongoDB Connection Verification\n');
        console.log('Testing connection to:', MONGODB_URI);
        
        // Test connection
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        console.log('\n✅ Connection Successful!\n');

        // Get database info
        const admin = mongoose.connection.db.admin();
        const status = await admin.serverStatus();
        
        console.log('📊 Server Information:');
        console.log('   Version:', status.version);
        console.log('   Uptime:', status.uptime, 'seconds');
        console.log('   Connected Clients:', status.connections.current);

        // List databases
        const databases = await admin.listDatabases();
        console.log('\n💾 Available Databases:');
        databases.databases.forEach(db => {
            console.log(`   ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });

        // Check portfolio database collections
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        
        console.log('\n📁 Portfolio Database Collections:');
        if (collections.length === 0) {
            console.log('   (None yet - run setup-db.js to initialize)');
        } else {
            for (const collection of collections) {
                const count = await db.collection(collection.name).countDocuments();
                console.log(`   ${collection.name}: ${count} documents`);
            }
        }

        console.log('\n✅ MongoDB is ready to use!\n');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Connection Failed!\n');
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('⚠️  MongoDB is not running.');
            console.log('\n📝 To start MongoDB:');
            console.log('   1. Open Services (services.msc)');
            console.log('   2. Find "MongoDB Server"');
            console.log('   3. Right-click and select "Start"');
            console.log('\n   OR run in PowerShell:');
            console.log('   net start MongoDB');
        } else if (error.message.includes('authentication')) {
            console.log('🔐 Authentication failed.');
            console.log('Check your MongoDB credentials in .env file');
        } else {
            console.log('Error:', error.message);
        }
        
        process.exit(1);
    }
}

verifyConnection();
