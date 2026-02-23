# 📧 Email Configuration Guide

## Overview
Your portfolio system now sends automated email notifications when someone submits a contact message. Messages are sent to:
1. **Admin Email**: `machariadavid882@gmail.com` - Receives contact details
2. **User Email**: The contact form submitter - Receives confirmation message

---

## ⚙️ Setup Instructions

### Step 1: Gmail Account Setup (Recommended)

#### Option A: Using Gmail with App Password (Recommended)
This is the safest method as it doesn't expose your main Gmail password.

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to [myaccount.google.com](https://myaccount.google.com)
   - Click "Security" in left menu
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - Copy this password (you'll use it in .env)

3. **Update `.env` file**:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=machariadavid882@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ADMIN_EMAIL=machariadavid882@gmail.com
   ```

#### Option B: Using Gmail Less Secure App Access (Not Recommended)
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Scroll down to "Less secure app access"
3. Enable "Allow less secure apps"
4. Use your Gmail password directly in .env

---

### Step 2: Update `.env` File

Edit `backend/.env` and replace the email configuration section:

```dotenv
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
ADMIN_EMAIL=machariadavid882@gmail.com
```

**For other email providers:**
- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`
- **AWS SES**: `email-smtp.[region].amazonaws.com:587`
- **Office 365**: `smtp.office365.com:587`

---

### Step 3: Restart Backend Server

After updating `.env`, restart the backend:

```bash
cd backend
npm run dev
```

You should see one of these messages:
- ✅ `Email service is configured and ready to send`
- ⚠️ `Email service not configured. Contact notifications will not be sent.`

---

## 🧪 Testing Email Functionality

### Test 1: Manual Contact Form Submission
1. Open your portfolio: `http://localhost:8000`
2. Go to Contact page
3. Fill out the form with:
   - Name: Test User
   - Email: test@example.com
   - Service: Website Design
   - Message: This is a test message
4. Submit the form
5. Check `machariadavid882@gmail.com` for the admin notification
6. Check `test@example.com` for the confirmation email

### Test 2: Check Server Logs
Monitor the backend console for email activity:
```
✅ Admin notification email sent successfully
✅ User confirmation email sent successfully
```

---

## 📧 Email Templates

### 1. **Admin Notification Email**
When a contact is submitted, the admin receives:
- Sender's name, email, phone
- Service interest
- Budget range
- Full message content
- Timestamp

### 2. **User Confirmation Email**
The contact submitter receives:
- Thank you message
- Their message details summary
- Response time expectation (24-48 hours)
- Professional branding

Both emails use HTML formatting with:
- ✅ Professional gradient headers
- ✅ Color-coded sections
- ✅ Responsive design
- ✅ Clear call-to-actions

---

## 🔒 Security Best Practices

1. **Never commit credentials**: Don't add .env to version control
2. **Use App Passwords**: Use Gmail App Passwords instead of main password
3. **Keep secrets safe**: Treat EMAIL_PASSWORD like a sensitive credential
4. **Monitor emails**: Check sent folder regularly for suspicious activity
5. **Verify sender address**: Confirm emails come from your configured address

---

## 🐛 Troubleshooting

### Issue: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solutions:**
1. Check if you enabled 2FA in Gmail
2. Copy the App Password correctly (16 characters with spaces)
3. Paste it exactly as provided by Google (with spaces)
4. Restart the backend after updating .env

### Issue: "Error: connect ECONNREFUSED"

**Solutions:**
1. Verify EMAIL_HOST and EMAIL_PORT are correct
2. Check internet connection
3. Firewall may be blocking SMTP port 587
4. Try port 465 with `EMAIL_SECURE=true`

### Issue: Emails not being sent but no errors

**Solutions:**
1. Check .env file for typos
2. Verify SMTP credentials are valid
3. Check backend logs for silent failures
4. Ensure MongoDB is running and storing contacts

### Issue: Emails going to spam folder

**Solutions:**
1. Add recipient email to contacts
2. Check SPF/DKIM settings for your domain
3. Use a dedicated email address (not auto-generated)
4. Consider upgrading to professional email service

---

## 📊 Email Service Debug

Enable email debug logging in `backend/.env`:

```dotenv
DEBUG=nodemailer:*
```

Then restart backend to see detailed SMTP communication logs.

---

## 🚀 Production Deployment

### For Heroku / Cloud Deployment:

1. Set environment variables in platform dashboard:
   ```
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_SECURE = false
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASSWORD = your-app-password
   ADMIN_EMAIL = machariadavid882@gmail.com
   ```

2. Use environment variables in .env (already configured)

3. Test email sending after deployment

### Alternative: SendGrid

SendGrid is often recommended for production:
1. Create SendGrid account
2. Get API key from SendGrid dashboard
3. Update .env:
   ```
   EMAIL_HOST = smtp.sendgrid.net
   EMAIL_PORT = 587
   EMAIL_USER = apikey
   EMAIL_PASSWORD = SG.xxxxx...
   ```

---

## 📈 Monitoring Email Delivery

### Check Gmail Sent Folder
1. Go to your Gmail account
2. Look in "Sent Mail" folder
3. Verify emails were sent successfully

### Monitor Backend Logs
```bash
# If backend is still running, you'll see:
✅ Admin notification email sent successfully
✅ User confirmation email sent successfully

# Or errors like:
❌ Error sending admin notification: [error message]
```

---

## 🔗 Relevant Files

- **Email Service**: `backend/services/emailService.js`
- **Contact Route**: `backend/routes/contact.js`
- **Configuration**: `backend/.env`
- **Server**: `backend/server.js`

---

## ✅ Confirmation Checklist

- [ ] Gmail 2-Factor Authentication enabled
- [ ] App Password generated from Google
- [ ] `.env` file updated with EMAIL_USER and EMAIL_PASSWORD
- [ ] Backend restarted
- [ ] No "Email service not configured" warning in console
- [ ] Test contact form submission sent successfully
- [ ] Admin received notification email
- [ ] Contact submitter received confirmation email
- [ ] Email timestamps and formatting look correct

---

## 🎉 You're All Set!

Your portfolio now has:
✅ Automatic contact notifications to admin  
✅ Confirmation emails to visitors  
✅ Professional HTML email templates  
✅ Secure credentials management  
✅ Error handling and logging  

**Questions?** Check the troubleshooting section or review email service logs in the backend console.
