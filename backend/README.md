# Portfolio Backend - Setup & Usage Guide

This is the backend API and admin dashboard for the portfolio website. It provides RESTful APIs for managing projects, services, testimonials, and contact form submissions.

## 🚀 Features

- **Admin Dashboard**: Full-featured web interface for content management
- **Authentication**: Secure session-based authentication with bcrypt password hashing
- **RESTful API**: Complete CRUD operations for all content types
- **MongoDB Database**: Scalable NoSQL database storage
- **Protected Routes**: Admin-only access to sensitive operations
- **Statistics Dashboard**: Real-time overview of site metrics

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 🔧 Installation

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages:
- express (Web framework)
- mongoose (MongoDB ODM)
- bcryptjs (Password hashing)
- express-session (Session management)
- cors (Cross-origin resource sharing)
- dotenv (Environment variables)

### Step 2: Configure Environment Variables

Copy the example environment file:

```bash
copy .env.example .env
```

Edit `.env` file with your configuration:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio
SESSION_SECRET=your-very-secret-key-here
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourSecurePassword123
FRONTEND_URL=http://localhost:8000
```

**⚠️ IMPORTANT:** Change the default credentials before deploying to production!

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

Or if using MongoDB Compass, just launch the application.

### Step 4: Initialize Admin User

Run the setup script to create the initial admin user:

```bash
npm run setup
```

You should see output like:
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

### Step 5: Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001`

## 🎯 Usage

### Admin Dashboard

Access the admin dashboard at: **http://localhost:3001/admin**

Default login credentials:
- **Username:** admin
- **Password:** admin123

### Dashboard Features:

1. **Overview Page**
   - View statistics (total projects, services, contacts, testimonials)
   - See recent contact form submissions
   
2. **Projects Management**
   - Create, read, update, delete portfolio projects
   - Set featured projects
   - Manage project order and status
   - Add technologies, images, demo links

3. **Services Management**
   - Manage service offerings
   - Add custom icons and features
   - Control visibility and order

4. **Testimonials Management**
   - Add client testimonials
   - Set ratings (1-5 stars)
   - Feature specific testimonials

5. **Contact Messages**
   - View all contact form submissions
   - Mark messages as read/replied
   - Delete spam or old messages

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check authentication status

### Projects
- `GET /api/projects` - Get all projects (public)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Services
- `GET /api/services` - Get all services (public)
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Testimonials
- `GET /api/testimonials` - Get all testimonials (public)
- `POST /api/testimonials` - Create testimonial (admin only)
- `PUT /api/testimonials/:id` - Update testimonial (admin only)
- `DELETE /api/testimonials/:id` - Delete testimonial (admin only)

### Contact
- `POST /api/contact` - Submit contact form (public)
- `GET /api/contact` - Get all contacts (admin only)
- `PUT /api/contact/:id` - Update contact status (admin only)
- `DELETE /api/contact/:id` - Delete contact (admin only)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (admin only)

## 📁 Project Structure

```
backend/
├── models/              # Database schemas
│   ├── Admin.js        # Admin user model
│   ├── Project.js      # Project model
│   ├── Service.js      # Service model
│   ├── Contact.js      # Contact form model
│   └── Testimonial.js  # Testimonial model
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── projects.js     # Project CRUD routes
│   ├── services.js     # Service CRUD routes
│   ├── contact.js      # Contact form routes
│   ├── testimonials.js # Testimonial CRUD routes
│   └── admin.js        # Admin dashboard routes
├── middleware/         # Custom middleware
│   └── auth.js         # Authentication middleware
├── scripts/            # Utility scripts
│   └── setup.js        # Initial setup script
├── public/             # Static files
│   └── admin/          # Admin dashboard
│       ├── index.html  # Dashboard UI
│       └── admin.js    # Dashboard logic
├── .env                # Environment configuration
├── .env.example        # Environment template
├── package.json        # Dependencies
└── server.js           # Main application file
```

## 🔒 Security Notes

1. **Change Default Credentials**: Always change the default admin password
2. **Session Secret**: Use a strong, unique session secret in production
3. **HTTPS**: Enable secure cookies when using HTTPS (`cookie.secure = true`)
4. **Environment Variables**: Never commit `.env` file to version control
5. **CORS**: Configure allowed origins appropriately for production
6. **Input Validation**: API includes basic validation, but can be enhanced

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Error: MongoNetworkError
```
**Solution:** Ensure MongoDB is running. Check connection string in `.env`

### Admin Already Exists
```
⚠️  Admin user already exists!
```
**Solution:** This is normal. Use existing credentials or delete admin from database to recreate.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution:** Change PORT in `.env` or stop the other application using port 3001.

### Session/Cookie Issues
```
401 Unauthorized on admin routes
```
**Solution:** Ensure credentials: true is set in both CORS config and fetch requests.

## 📝 Development Tips

1. **Testing API**: Use Postman or Thunder Client to test endpoints
2. **Database GUI**: Use MongoDB Compass to view/edit database directly
3. **Live Reloading**: Use `npm run dev` for automatic server restart
4. **Logging**: Check console for detailed error messages
5. **Database Reset**: Drop the database in MongoDB Compass to start fresh

## 🚀 Production Deployment

When deploying to production:

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `SESSION_SECRET`
3. Configure MongoDB Atlas or hosted MongoDB
4. Enable `cookie.secure = true` for HTTPS
5. Set appropriate CORS origins
6. Use a process manager like PM2
7. Set up proper logging
8. Configure reverse proxy (nginx/Apache)
9. Enable rate limiting
10. Regular database backups

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation
3. Check MongoDB logs
4. Verify environment configuration

## 📄 License

MIT License - Feel free to use this project for your portfolio!

---

**Happy Coding! 🎉**
