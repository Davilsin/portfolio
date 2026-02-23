# Portfolio Website
This folder contains the complete portfolio website (frontend + backend).

## Project Structure
- **Frontend**: HTML/CSS/JS files in root directory
- **Backend**: Node.js/Express server in `/backend`
- **Database**: MongoDB (local or Atlas)

## Files to Deploy

### For Vercel Full-Stack:
- `backend/server.js` - Main backend file
- `vercel.json` - Deployment configuration
- `.env` (set via Vercel dashboard)
- All frontend files in root

### For Netlify + Render:
- Frontend: Deploy root directory
- Backend: Deploy `/backend` directory separately

## Environment Variables Required

Set these in your hosting platform dashboard:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/portfolio
SESSION_SECRET=your-secure-random-string
EMAIL_USER=machariadavid882@gmail.com
EMAIL_PASSWORD=kvle nyim sxaw ggnn
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

## Deployment Commands

```bash
# Verify setup locally
npm run dev

# Setup database (one-time)
cd backend && npm run setup-db

# Deploy to Vercel
vercel deploy

# Deploy to Netlify
netlify deploy --prod
```

## Quick Start

1. Read `HOSTING_DEPLOYMENT_GUIDE.md` for detailed instructions
2. Choose your hosting platform
3. Set environment variables
4. Push to GitHub
5. Connect repository to hosting platform
6. Deploy!

## Support
See `HOSTING_DEPLOYMENT_GUIDE.md` for troubleshooting
