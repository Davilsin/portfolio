# 🚀 Portfolio Hosting & Deployment Guide

## 📊 Quick Comparison of Hosting Options

| Option | Cost | Difficulty | Setup Time | Best For |
|--------|------|-----------|-----------|----------|
| **GitHub Pages + Vercel Backend** | FREE | Easy | 15 min | Quick deployment |
| **Vercel (Full Stack)** | FREE (tier) | Very Easy | 10 min | Modern JavaScript apps |
| **Netlify (Frontend) + Heroku (Backend)** | FREE | Easy | 20 min | Static + serverless |
| **DigitalOcean** | $5/month | Medium | 30 min | Full control, VPS |
| **Render** | FREE tier | Easy | 15 min | Node.js apps |
| **MongoDB Atlas + Custom Server** | FREE | Medium | 45 min | Production-ready |

---

## 🎯 OPTION 1: Vercel (RECOMMENDED - Easiest)
**Cost: FREE | Setup Time: 10 minutes**

Vercel is perfect for your stack - it handles Node.js backends natively.

### Step 1: Prepare for Deployment

**Update your backend/server.js for production:**
```javascript
// At the top of backend/server.js - ADD THESE LINES
const dotenv = require('dotenv').config();

// Change this line:
const PORT = process.env.PORT || 3001;

// Your existing code stays the same
```

**Create backend/vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Portfolio ready for deployment"

# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Connect your GitHub repository
4. Select root as project root
5. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `EMAIL_USER`: machariadavid882@gmail.com
   - `EMAIL_PASSWORD`: kvle nyim sxaw ggnn
   - `SESSION_SECRET`: Generate a new random string
   - `NODE_ENV`: production
6. Click Deploy!

Your backend will be live at: `https://your-project.vercel.app`

### Step 4: Deploy Frontend on Vercel

1. In Vercel dashboard, click "New Project"
2. Import same GitHub repo
3. Set "Root Directory" to `./` (frontend is in root)
4. Set environment variable:
   - `VITE_API_URL`: https://your-project.vercel.app/api
5. Deploy!

Your frontend will be live at: `https://portfolio-frontend.vercel.app`

**Update script.js to use production API:**
```javascript
// In script.js, change the contact submission to:
const endpoints = [
    'https://your-project.vercel.app/api/contact',  // Production
    '/api/contact'                                    // Fallback local
];
```

---

## 🎯 OPTION 2: Netlify (Frontend) + Render (Backend)
**Cost: FREE | Setup Time: 20 minutes**

Best for separating frontend and backend hosting.

### Deploy Backend on Render:

1. Go to [render.com](https://render.com)
2. Click "New+" → "Web Service"
3. Connect GitHub repository
4. Settings:
   - Name: portfolio-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
5. Add Environment Variables (same as above)
6. Deploy!

Your backend URL: `https://portfolio-backend.onrender.com`

### Deploy Frontend on Netlify:

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub
4. Settings:
   - Build command: Leave empty (static files)
   - Publish directory: `.` (root)
5. Deploy!

Your frontend URL: `https://portfolio-frontend.netlify.app`

---

## 🎯 OPTION 3: DigitalOcean (VPS - Most Control)
**Cost: $5/month | Setup Time: 30 minutes**

Full control over your server.

### Step 1: Create Droplet

1. Sign up at [digitalocean.com](https://digitalocean.com)
2. Create → Droplets
3. Choose Ubuntu 22.04
4. $5/month plan (1GB RAM, 1 vCPU)
5. Add SSH key or use root password

### Step 2: Connect & Setup

```bash
# SSH into your droplet
ssh root@YOUR_DROPLET_IP

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Install Nginx (reverse proxy)
apt-get install -y nginx
```

### Step 3: Deploy Your Code

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio

# Install dependencies
npm install
cd backend
npm install
cd ..

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/portfolio
EMAIL_USER=machariadavid882@gmail.com
EMAIL_PASSWORD=kvle nyim sxaw ggnn
SESSION_SECRET=$(openssl rand -hex 32)
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://YOUR_DOMAIN_OR_IP
EOF

# Start backend with PM2
cd backend
pm2 start server.js --name "portfolio-backend"
pm2 save
pm2 startup

# Configure Nginx as reverse proxy
sudo nano /etc/nginx/sites-available/portfolio
```

Add this to Nginx config:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /root/portfolio;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🎯 OPTION 4: GitHub Pages (Frontend Only - FREE)
**Cost: FREE | Setup Time: 5 minutes**

Simple free hosting for static frontend.

1. Go to your GitHub repository
2. Settings → Pages
3. Choose "Deploy from a branch"
4. Select `main` branch
5. Your site is live at: `https://YOUR_USERNAME.github.io/portfolio`

Update script.js API URL to your backend service.

---

## 🌐 Setup MongoDB (Required for All Options)

### Using MongoDB Atlas (FREE Cloud Database):

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create project → Create Cluster (FREE tier)
4. Configure IP Whitelist: Add 0.0.0.0/0 (allow all)
5. Create database user credentials
6. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/portfolio`
7. Update `.env` with that URI

---

## 🔒 Setup Custom Domain (Optional)

### Using Nameserver Transfer:

1. Buy domain from GoDaddy, Namecheap, or Google Domains
2. Update nameservers to your hosting provider's nameservers
3. Configure DNS records to point to your server IP

### Example DNS Records:
```
A Record: @ → YOUR_SERVER_IP
A Record: www → YOUR_SERVER_IP
CNAME: api → your-api-domain.vercel.app
```

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `.env` file configured with real credentials
- [ ] `backend/vercel.json` created (if using Vercel)
- [ ] Database migrations run (`npm run setup-db`)
- [ ] All environment variables set in hosting platform
- [ ] Frontend API URLs updated for production
- [ ] Email credentials tested and working
- [ ] GitHub repository pushed with all changes
- [ ] SSL certificate configured (https)

---

## ✅ Post-Deployment Testing

### Test Your Deployed Site:

```bash
# 1. Test frontend loads
curl https://your-frontend-url.com

# 2. Test contact form endpoint
curl -X POST https://your-backend-url.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'

# 3. Test admin login
# Visit: https://your-backend-url.com/admin
# Login with admin credentials

# 4. Verify email sending
# Submit contact form and check email
```

---

## 🆘 Troubleshooting Common Issues

### API Not Responding
```bash
# Check backend service running
ps aux | grep node

# Check port open
netstat -tuln | grep 3001

# Check logs
pm2 logs portfolio-backend
```

### CORS Errors
Update backend/.env:
```
FRONTEND_URL=https://your-frontend-domain.com
```

### Database Connection Failed
- Check MongoDB Atlas whitelist includes your server IP
- Verify connection string in `.env`
- Check firewall rules

### Email Not Sending
- Verify Gmail App Password is correct
- Check email logs: `curl http://localhost:3001/api/admin/debug/emails`

---

## 💡 Recommended Path for You

**Best option: Vercel (Combined Frontend + Backend)**

Why:
✅ Fastest deployment (10 min)
✅ Zero configuration needed
✅ Automatic SSL/HTTPS
✅ Scales automatically
✅ Free tier is generous
✅ Both frontend and backend in one place

**Follow OPTION 1 above** 👆

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- DigitalOcean Docs: https://docs.digitalocean.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
- GitHub Pages: https://pages.github.com

---

**Ready to deploy? Start with Option 1 (Vercel) - it's the easiest!** 🚀
