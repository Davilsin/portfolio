# 🗄️ MongoDB Setup Guide

This guide helps you set up and configure MongoDB for your portfolio backend.

## ✅ Prerequisites

- MongoDB Community Server installed on your Windows machine
- Node.js and npm installed
- Backend dependencies installed (`npm install` in `/backend` folder)

---

## 📋 Step-by-Step Setup

### Step 1: Verify MongoDB Installation

**Check if MongoDB is installed:**

```powershell
mongod --version
```

You should see output like: `db version v6.0.0` (version number may vary)

### Step 2: Start MongoDB Service

MongoDB can run as a Windows Service. Start it with:

```powershell
net start MongoDB
```

**To verify it's running:**

```powershell
Get-Service -Name MongoDB | Select Status
```

You should see: `Status: Running`

**Alternative: Run MongoDB manually**

If you need to run MongoDB directly (not as service):

```powershell
mongod
```

This starts MongoDB on the default port `27017`

### Step 3: Verify MongoDB Connection

Run the verification script:

```powershell
cd backend
npm run verify-db
```

**Expected output:**
```
✅ Connection Successful!

📊 Server Information:
   Version: 6.0.0
   Uptime: 123 seconds
   Connected Clients: 1

💾 Available Databases:
   admin (0.000 MB)
   local (0.000 MB)
```

If you see ❌ error, see [Troubleshooting](#-troubleshooting) below.

### Step 4: Initialize Database with Sample Data

```powershell
npm run setup-db
```

**Expected output:**
```
✅ Connected to MongoDB successfully!

🗑️  Clearing existing data...
✅ Database cleared

📁 Adding sample projects...
✅ Created 5 projects

⚙️  Adding sample services...
✅ Created 5 services

⭐ Adding sample testimonials...
✅ Created 3 testimonials

═══════════════════════════════════════════════════
📊 DATABASE SETUP COMPLETE!
═══════════════════════════════════════════════════

✅ Projects:      5 items
✅ Services:      5 items
✅ Testimonials:  3 items
✅ Contacts:      Ready for submissions
✅ Admin Users:   Setup in separate script
```

### Step 5: Create Admin User

```powershell
npm run setup
```

**Expected output:**
```
✅ Connected to MongoDB
✅ Admin user created successfully!

Login Credentials:
Username: admin
Password: admin123

⚠️  IMPORTANT: Change the password after first login!

You can now access the admin dashboard at:
http://localhost:3001/admin
```

### Step 6: Start Backend Server

```powershell
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected
🚀 Server running on http://localhost:3001
📊 Admin dashboard: http://localhost:3001/admin
```

---

## 📊 Database Structure

### Collections Overview

Your MongoDB database `portfolio` contains these collections:

```
portfolio/
├── projects (5 documents)
│   └── Fields: title, subtitle, description, image, technologies[], 
│              demoLink, category, featured, order, status, timestamps
│
├── services (5 documents)
│   └── Fields: title, icon, description, features[], order, status, timestamps
│
├── testimonials (3 documents)
│   └── Fields: clientName, clientTitle, clientCompany, testimonial, 
│              rating (1-5), image, featured, status, order, timestamps
│
├── contacts (0 documents initially)
│   └── Fields: name, email, phone, service, budget, message, 
│              status (new/read/replied/archived), notes, timestamps
│
└── admins (1 document after setup)
    └── Fields: username, email, password (hashed), role, timestamps
```

---

## 🔍 View Data with MongoDB Compass

**MongoDB Compass** is a GUI tool to browse and manage your data.

### Download & Install:
1. Visit: https://www.mongodb.com/products/compass
2. Download MongoDB Compass (GUI)
3. Install and open it

### Browse Your Data:
1. Open MongoDB Compass
2. Click "Connect" (it auto-detects localhost:27017)
3. Click `portfolio` database
4. Browse collections (projects, services, etc.)
5. Click a collection to see documents
6. Edit or delete documents directly

### Sample Queries:

**See all featured projects:**
```javascript
{ "featured": true }
```

**See new contacts:**
```javascript
{ "status": "new" }
```

**See admin users:**
Query in `admins` collection

---

## 🗄️ Database Commands Reference

### Useful Commands in MongoDB Shell

**Connect to MongoDB:**
```bash
mongo
```

**Use portfolio database:**
```javascript
use portfolio
```

**View collections:**
```javascript
show collections
```

**Count projects:**
```javascript
db.projects.countDocuments()
```

**Find all featured projects:**
```javascript
db.projects.find({ featured: true })
```

**Delete a project:**
```javascript
db.projects.deleteOne({ _id: ObjectId("...") })
```

**Drop entire collection:**
```javascript
db.projects.drop()
```

---

## 🔧 Configuration Files

### `.env` File (Backend Root)

Located at: `backend/.env`

```env
# Server port
PORT=3001

# Database connection
MONGODB_URI=mongodb://localhost:27017/portfolio

# Session secret
SESSION_SECRET=portfolio-secret-key-change-me

# Admin credentials (for setup only)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Frontend URL
FRONTEND_URL=http://localhost:8000
```

### Changing Database Location

If MongoDB is installed in a different location or port:

```env
# Example for custom MongoDB instance
MONGODB_URI=mongodb://hostname:27017/portfolio

# Or with authentication
MONGODB_URI=mongodb://username:password@hostname:27017/portfolio?authSource=admin
```

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to MongoDB"

**Check if MongoDB is running:**
```powershell
Get-Service -Name MongoDB | Select Status
```

**Start MongoDB Service:**
```powershell
net start MongoDB
```

**If service doesn't exist, install it:**
```powershell
mongod --install
net start MongoDB
```

### ❌ "Address already in use"

MongoDB is already running. This is fine! It means you have it installed as a service.

### ❌ "Authentication failed"

Check your `.env` file for correct MongoDB URI:

```env
# Local MongoDB (no auth needed)
MONGODB_URI=mongodb://localhost:27017/portfolio

# Remove any username/password if using local instance
```

### ❌ "Database locked" or "No space left"

**Clear database and restart:**
```powershell
npm run setup-db
```

**Or manually clear:**
```powershell
net stop MongoDB
net start MongoDB
```

### ❌ Verify script shows "No databases"

This is normal for fresh MongoDB. After running `setup-db`, you'll see the portfolio database.

---

## 📈 Backup & Restore

### Backup Database

**Export to file:**
```powershell
mongodump --db portfolio --out ./backup
```

This creates a `backup/portfolio` folder with collections.

### Restore Database

```powershell
mongorestore --db portfolio ./backup/portfolio
```

### Backup Single Collection

```powershell
mongoexport --db portfolio --collection projects --out projects.json
```

---

## 🚀 Production Setup

### For MongoDB Atlas (Cloud MongoDB)

1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true
```

### Important Security Steps:

1. **Change default admin password**
   - Login to admin dashboard
   - Update admin password
   
2. **Use strong SESSION_SECRET**
   ```env
   SESSION_SECRET=use-a-long-random-string-here
   ```

3. **Enable MongoDB authentication** (production)
   - Create database user
   - Use credentials in connection string

4. **Use HTTPS** in production
   - Update `server.js` cookie settings
   - Deploy to HTTPS server

---

## 📊 Sample Query Examples

### Get Featured Projects (API equivalent)

**Using MongoDB Shell:**
```javascript
db.projects.find({ featured: true }).sort({ order: 1 })
```

**Using API:**
```
GET http://localhost:3001/api/projects?featured=true
```

### Get New Contacts

```javascript
db.contacts.find({ status: "new" }).sort({ createdAt: -1 })
```

### Count Total Projects

```javascript
db.projects.countDocuments({ status: "active" })
```

### Update Project Status

```javascript
db.projects.updateOne(
    { _id: ObjectId("...") },
    { $set: { status: "archived" } }
)
```

---

## ✅ Verification Checklist

Before you start developing:

- [ ] MongoDB is installed
- [ ] MongoDB service is running (`net start MongoDB`)
- [ ] Verification script passes (`npm run verify-db`)
- [ ] Sample data is loaded (`npm run setup-db`)
- [ ] Admin user is created (`npm run setup`)
- [ ] Backend starts (`npm run dev`)
- [ ] Admin dashboard accessible (`http://localhost:3001/admin`)
- [ ] Can login with admin/admin123
- [ ] Database visible in MongoDB Compass

---

## 📚 Scripts Reference

```bash
# Verify MongoDB connection
npm run verify-db

# Initialize database with sample data
npm run setup-db

# Create admin user
npm run setup

# Start backend server (development)
npm run dev

# Start backend server (production)
npm start
```

---

## 🆘 Need Help?

**MongoDB Issues?**
- Check MongoDB logs: `C:\Program Files\MongoDB\Server\6.0\log\mongod.log`
- Or run MongoDB manually: `mongod` to see live output

**Database Issues?**
- Re-run setup: `npm run setup-db`
- Check MongoDB Compass to browse data
- Verify `.env` configuration

**Connection Issues?**
- Run verification: `npm run verify-db`
- Check if backend is running on port 3001
- Verify CORS settings are correct

---

## 🎉 You're All Set!

Your MongoDB database is now configured and ready to use with your portfolio backend!

**Next Steps:**
1. Start backend: `npm run dev`
2. Visit admin: `http://localhost:3001/admin`
3. Login: admin / admin123
4. Explore your data!

For more details, see BACKEND_INTEGRATION_GUIDE.md
