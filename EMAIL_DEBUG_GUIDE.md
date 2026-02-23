# 🐛 Email System Debug Guide

## Current Status

✅ **Email System is Working!**

The system now has a **fallback logging mechanism**:
- When Gmail credentials are NOT configured → Emails are logged to file
- When Gmail credentials ARE configured → Emails are sent via Gmail

---

## 📊 How to Debug Email Issues

### Method 1: Check Email Logs via Admin Dashboard

1. **Login to Admin**: http://localhost:3001/admin
   - Username: `admin`
   - Password: `admin123`

2. **Go to Dashboard** → Click on 📈 Dashboard

3. **Open Browser Console** (F12) and run:
   ```javascript
   fetch('http://localhost:3001/api/admin/debug/emails')
     .then(r => r.json())
     .then(d => console.log(JSON.stringify(d, null, 2)))
   ```

4. **View Results** - You'll see all logged emails

### Method 2: Check System Status

Open browser console and run:
```javascript
fetch('http://localhost:3001/api/admin/debug/status')
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
```

You'll see:
```json
{
  "status": "running",
  "emailConfig": {
    "user": "❌ Not configured (using placeholder)",
    "password": "❌ Not configured (using placeholder)"
  }
}
```

### Method 3: Check Backend Console Logs

When contact form is submitted, backend should show:
```
📨 New contact submission received: {
  name: 'John Doe',
  email: 'john@example.com',
  service: 'Web Design'
}
✅ Contact saved to database: 507f1f77bcf48cd496881234
📧 Sending notification emails...
📝 Email logged to file: ADMIN_NOTIFICATION → machariadavid882@gmail.com
📝 Email logged to file: USER_CONFIRMATION → john@example.com
✅ Email notifications processed
```

### Method 4: Check Email Log File

Email log location: `backend/logs/emails.log`

Each line is JSON with:
- `timestamp` - When email was logged
- `type` - ADMIN_NOTIFICATION or USER_CONFIRMATION
- `to` - Recipient email
- `subject` - Email subject
- `status` - Current status

---

## ✅ Test Email System

### Step 1: Submit a Test Contact

1. Open portfolio: http://localhost:8000
2. Go to Contact page
3. Fill form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Service: `Website Design`
   - Message: `This is a test message`
4. Click Submit

### Step 2: Check Backend Console

You should see:
```
📨 New contact submission received: { name: 'Test User', ... }
✅ Contact saved to database: [ID]
📧 Sending notification emails...
📝 Email logged to file: ADMIN_NOTIFICATION → machariadavid882@gmail.com
📝 Email logged to file: USER_CONFIRMATION → test@example.com
✅ Email notifications processed
```

### Step 3: Verify Contact in Admin Dashboard

1. Login: http://localhost:3001/admin
2. Go to Contacts section
3. You should see your test contact
4. Click "View" to see full message

### Step 4: Check Email Logs

Open browser console at admin dashboard and run:
```javascript
fetch('http://localhost:3001/api/admin/debug/emails')
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
```

Expected output:
```json
{
  "totalEmails": 2,
  "emails": [
    {
      "timestamp": "2026-02-16T10:30:45.123Z",
      "type": "USER_CONFIRMATION",
      "to": "test@example.com",
      "subject": "We Received Your Message! 📬",
      "status": "logged (awaiting Gmail credentials)"
    },
    {
      "timestamp": "2026-02-16T10:30:44.987Z",
      "type": "ADMIN_NOTIFICATION",
      "to": "machariadavid882@gmail.com",
      "subject": "New Contact Message from Test User",
      "status": "logged (awaiting Gmail credentials)"
    }
  ]
}
```

---

## 🔧 Enable Real Email Sending

To send actual emails via Gmail, follow these steps:

### Step 1: Generate Gmail App Password

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** (left menu)
3. Enable **2-Step Verification** if not done
4. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
5. Select **Mail** and **Windows Computer**
6. Copy the 16-character password

### Step 2: Update `.env` File

Edit `backend/.env`:

```diff
- EMAIL_USER=your-email@gmail.com
- EMAIL_PASSWORD=your-app-password
+ EMAIL_USER=machariadavid882@gmail.com
+ EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Important:** Keep the spaces in the password exactly as Google generated them!

### Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ Email service is configured and ready to send
```

### Step 4: Test Again

Submit a contact form and check:
1. Backend console should show: `✅ [Email type] sent successfully`
2. Admin dashboard debug should show: `"status": "sent"`
3. Your Gmail inbox should receive the email

---

## 🆘 Common Issues & Solutions

### Issue: "Email service not configured"

**Problem:** Gmail credentials still set to placeholder values

**Solution:**
1. Open `backend/.env`
2. Replace `your-email@gmail.com` with actual email
3. Replace `your-app-password` with 16-char app password
4. Restart backend

### Issue: "Invalid login 535-5.7.8"

**Problem:** Wrong email/password combination

**Solution:**
1. Go back to Gmail settings
2. Verify app password was generated correctly
3. Check for typos in .env file
4. Use copy-paste to avoid mistakes

### Issue: "Connect ECONNREFUSED"

**Problem:** Can't connect to Gmail SMTP server

**Solution:**
1. Check internet connection
2. Firewall may be blocking port 587
3. Try port 465 with `EMAIL_SECURE=true` in .env
4. Use different email service (SendGrid, etc.)

### Issue: Emails in spam folder

**Problem:** Gmail marking emails as suspicious

**Solution:**
1. Add email to Gmail contacts
2. Mark as "Not spam" in Gmail
3. Check SPF/DKIM settings for custom domain
4. Use professional email address

---

## 📝 API Endpoints for Debugging

### Get Dashboard Stats
```
GET /api/admin/stats
```
Returns: Project, service, testimonial, contact counts

### Get Email Logs
```
GET /api/admin/debug/emails
```
Returns: All logged emails (JSON format)

### Get System Status
```
GET /api/admin/debug/status
```
Returns: Email config status, database status, environment info

---

## 🚀 Full Test Checklist

- [ ] Backend running (port 3001)
- [ ] Frontend running (port 8000)
- [ ] Can access portfolio website
- [ ] Can login to admin dashboard
- [ ] Can submit contact form
- [ ] Backend console shows email processing
- [ ] Contact appears in admin dashboard
- [ ] Email logs accessible via debug endpoint
- [ ] System status shows current config

### To Enable Real Emails:
- [ ] Gmail 2FA enabled
- [ ] App password generated
- [ ] .env updated with credentials
- [ ] Backend restarted
- [ ] Version without 2-step verification won't work

---

## 📧 Testing with Different Email Providers

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxxx
```

### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=postmaster@sandboxXXX.mailgun.org
EMAIL_PASSWORD=password-from-mailgun
```

### Microsoft 365
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@company.com
EMAIL_PASSWORD=your-office-password
```

---

## 🎯 Next Steps

1. **Test logging** - Submit contact form and check logs
2. **Configure Gmail** - Add app password to .env
3. **Test real emails** - Verify emails are sent
4. **Monitor** - Check admin dashboard for all contacts
5. **Production** - Deploy with proper email configuration

---

**Everything is working! The system is just waiting for Gmail credentials. 🎉**
