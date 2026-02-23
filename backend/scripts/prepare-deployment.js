#!/usr/bin/env node

/**
 * Portfolio Deployment Setup Script
 * Helps prepare your project for deployment to cloud hosting
 * 
 * Usage: node scripts/prepare-deployment.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function main() {
    console.log('\n🚀 Portfolio Deployment Setup Wizard\n');
    
    // Check for required files
    console.log('📋 Checking project structure...');
    const requiredFiles = [
        'index.html',
        'backend/server.js',
        'backend/package.json',
        'script.js',
        'styles.css'
    ];
    
    let allFilesExist = true;
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`  ✅ ${file}`);
        } else {
            console.log(`  ❌ ${file} - MISSING`);
            allFilesExist = false;
        }
    });
    
    if (!allFilesExist) {
        console.log('\n⚠️  Some required files are missing!');
        process.exit(1);
    }
    
    // Check for .env file
    console.log('\n🔐 Checking environment configuration...');
    if (fs.existsSync('backend/.env')) {
        console.log('  ✅ backend/.env exists');
    } else {
        console.log('  ⚠️  backend/.env not found (needed for production)');
    }
    
    // Check for package.json
    console.log('\n📦 Checking dependencies...');
    const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    const requiredDeps = ['express', 'mongoose', 'dotenv', 'cors', 'compression', 'express-rate-limit'];
    
    requiredDeps.forEach(dep => {
        if (backendPackage.dependencies[dep]) {
            console.log(`  ✅ ${dep}`);
        } else {
            console.log(`  ⚠️  ${dep} - NOT installed`);
        }
    });
    
    // Hosting option selection
    console.log('\n🌍 Hosting Platform Selection');
    console.log('  1. Vercel (Recommended - Easiest)\n  2. Netlify + Render\n  3. DigitalOcean\n  4. GitHub Pages (Frontend only)');
    
    const platform = await question('\nSelect platform (1-4): ');
    
    let deploymentSteps = '';
    
    switch(platform.trim()) {
        case '1':
            deploymentSteps = getVercelSteps();
            break;
        case '2':
            deploymentSteps = getNetlifyRenderSteps();
            break;
        case '3':
            deploymentSteps = getDigitalOceanSteps();
            break;
        case '4':
            deploymentSteps = getGitHubPagesSteps();
            break;
        default:
            console.log('Invalid selection');
            process.exit(1);
    }
    
    // Save deployment guide
    const guidePath = 'DEPLOYMENT_SETUP_SELECTED.md';
    fs.writeFileSync(guidePath, deploymentSteps);
    console.log(`\n✅ Deployment setup saved to: ${guidePath}`);
    
    // Final checklist
    console.log('\n📋 Pre-Deployment Checklist');
    console.log('  [ ] All code committed to Git');
    console.log('  [ ] Environment variables set in hosting platform');
    console.log('  [ ] MongoDB configured (Atlas or local)');
    console.log('  [ ] Email credentials tested');
    console.log('  [ ] Frontend API URLs updated for production');
    console.log('  [ ] Domain configured (if using custom domain)');
    
    console.log('\n🎉 Ready to deploy! Follow the steps in DEPLOYMENT_SETUP_SELECTED.md\n');
    
    rl.close();
}

function getVercelSteps() {
    return `# Vercel Deployment Steps

## 1. Prepare Code
\`\`\`bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
\`\`\`

## 2. Go to Vercel
- Visit https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Select \`.\` as root directory

## 3. Set Environment Variables
In Vercel project settings, add:
- \`MONGODB_URI\`: Your MongoDB Atlas connection string
- \`SESSION_SECRET\`: Generate random string (openssl rand -hex 32)
- \`EMAIL_USER\`: machariadavid882@gmail.com
- \`EMAIL_PASSWORD\`: kvle nyim sxaw ggnn
- \`NODE_ENV\`: production
- \`FRONTEND_URL\`: https://your-domain.com

## 4. Deploy
Click "Deploy" - your site will be live in minutes!

## 5. Test
- Visit your frontend URL
- Submit contact form
- Check email received

✅ Your portfolio is now live!
`;
}

function getNetlifyRenderSteps() {
    return `# Netlify + Render Deployment Steps

## Backend on Render

1. Go to https://render.com
2. Click "New+" → "Web Service"
3. Connect GitHub
4. Settings:
   - Build Command: \`npm install\`
   - Start Command: \`npm start\`
   - Root Directory: \`backend\`
   - Add environment variables (same as Vercel)
5. Deploy!

## Frontend on Netlify

1. Go to https://netlify.com
2. Click "New site from Git"
3. Connect GitHub repository
4. Set Base directory to \`.\` (root)
5. Leave build command empty (static files)
6. Deploy!

## Update API URL

In script.js, update contact endpoints to your Render backend URL

✅ Your portfolio is now live!
`;
}

function getDigitalOceanSteps() {
    return `# DigitalOcean VPS Deployment

## 1. Create Droplet
- Sign up at https://digitalocean.com
- Create Ubuntu 22.04 droplet ($5/month)
- Add SSH key

## 2. Connect & Install
\`\`\`bash
ssh root@YOUR_IP

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2 and MongoDB
npm install -g pm2
apt install -y mongodb-org
systemctl start mongod
\`\`\`

## 3. Deploy Code
\`\`\`bash
git clone YOUR_REPO
cd portfolio
npm install && cd backend && npm install
\`\`\`

## 4. Start Services
\`\`\`bash
pm2 start backend/server.js
pm2 save
pm2 startup
\`\`\`

✅ Your portfolio is now live!
`;
}

function getGitHubPagesSteps() {
    return `# GitHub Pages Deployment (Frontend Only)

## 1. Enable GitHub Pages
- Go to repository settings
- Select Pages
- Choose main branch
- Your site is live at: https://USERNAME.github.io/portfolio

## 2. Update API URL
In script.js, set API endpoints to your backend service (Vercel/Render)

## 3. Custom Domain (Optional)
- Add custom domain in GitHub Pages settings
- Update DNS records at your registrar

✅ Frontend is now live on GitHub Pages!
`;
}

main().catch(console.error);
