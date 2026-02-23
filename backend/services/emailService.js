const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Create a transporter using Gmail (you can use any email service)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false,
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

// Check if using placeholder credentials
const hasValidCredentials = () => {
    return process.env.EMAIL_USER && 
           process.env.EMAIL_USER !== 'your-email@gmail.com' && 
           process.env.EMAIL_PASSWORD && 
           process.env.EMAIL_PASSWORD !== 'your-app-password';
};

// Save email to log file (for debugging)
const saveEmailToLog = (emailType, mailOptions) => {
    try {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            type: emailType,
            to: mailOptions.to,
            subject: mailOptions.subject,
            from: mailOptions.from,
            status: 'logged (awaiting Gmail credentials)'
        };
        
        const logFile = path.join(logsDir, 'emails.log');
        const logLine = JSON.stringify(logEntry) + '\n';
        fs.appendFileSync(logFile, logLine, 'utf8');
        
        console.log(`📝 Email logged to file: ${emailType} → ${mailOptions.to}`);
        return true;
    } catch (error) {
        console.error('Error saving email log:', error);
        return false;
    }
};

// Send email to admin
const sendAdminNotification = async (contactData) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'machariadavid882@gmail.com';
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@portfolio.com',
            to: adminEmail,
            subject: `New Contact Message from ${contactData.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                        <h2 style="margin: 0;">📨 New Contact Message</h2>
                    </div>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
                        <p><strong>From:</strong> ${contactData.name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
                        ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
                        ${contactData.service ? `<p><strong>Service Interest:</strong> ${contactData.service}</p>` : ''}
                        ${contactData.budget ? `<p><strong>Budget:</strong> ${contactData.budget}</p>` : ''}
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <h3>Message:</h3>
                        <p style="background: white; padding: 15px; border-left: 4px solid #667eea; line-height: 1.6;">
                            ${contactData.message.replace(/\n/g, '<br>')}
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <p style="color: #666; font-size: 12px;">
                            <strong>Received:</strong> ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            `
        };
        
        // If no valid credentials, just log to file
        if (!hasValidCredentials()) {
            saveEmailToLog('ADMIN_NOTIFICATION', mailOptions);
            console.log(`⚠️  Email not sent (Gmail not configured). Contact: ${contactData.email}`);
            return true;
        }
        
        // Try to send via Gmail
        await transporter.sendMail(mailOptions);
        console.log('✅ Admin notification email sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Error sending admin notification:', error.message);
        // Still log it even if sending failed
        saveEmailToLog('ADMIN_NOTIFICATION_FAILED', { ...mailOptions, error: error.message });
        return false;
    }
};

// Send confirmation email to user
const sendUserConfirmation = async (contactData) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@portfolio.com',
            to: contactData.email,
            subject: 'We Received Your Message! 📬',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                        <h2 style="margin: 0;">Thank You! 🎉</h2>
                    </div>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
                        <p>Hi <strong>${contactData.name}</strong>,</p>
                        
                        <p>Thank you for reaching out to us! We received your message and will get back to you as soon as possible.</p>
                        
                        <div style="background: white; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 5px 0;"><strong>📝 Your Message Details:</strong></p>
                            <p style="margin: 5px 0; color: #666;">Service: ${contactData.service || 'Not specified'}</p>
                            <p style="margin: 5px 0; color: #666;">Message: <em>${contactData.message.substring(0, 100)}${contactData.message.length > 100 ? '...' : ''}</em></p>
                        </div>
                        
                        <p>We typically respond within <strong>24-48 hours</strong>.</p>
                        
                        <p>If you have any additional questions, feel free to reply to this email.</p>
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <p style="color: #666; font-size: 12px;">
                            Best regards,<br>
                            <strong>The Portfolio Team</strong>
                        </p>
                    </div>
                </div>
            `
        };
        
        // If no valid credentials, just log to file
        if (!hasValidCredentials()) {
            saveEmailToLog('USER_CONFIRMATION', mailOptions);
            console.log(`⚠️  Confirmation email not sent (Gmail not configured). To: ${contactData.email}`);
            return true;
        }
        
        // Try to send via Gmail
        await transporter.sendMail(mailOptions);
        console.log('✅ User confirmation email sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Error sending user confirmation:', error.message);
        // Still log it even if sending failed
        saveEmailToLog('USER_CONFIRMATION_FAILED', { ...mailOptions, error: error.message });
        return false;
    }
};

// Test email configuration
const testEmailConfiguration = async () => {
    try {
        if (!hasValidCredentials()) {
            console.log('⚠️  Email service: Using local logging (Gmail credentials not configured)');
            console.log('ℹ️  To enable email sending, update EMAIL_USER and EMAIL_PASSWORD in .env');
            console.log(`📝 Emails will be logged to: ${path.join(logsDir, 'emails.log')}`);
            return true; // Still return true as the system is working with logging
        }
        
        await transporter.verify();
        console.log('✅ Email service is configured and ready to send');
        return true;
    } catch (error) {
        console.error('❌ Email service configuration error:', error.message);
        console.log('⚠️  Using local logging as fallback...');
        return true; // Return true anyway, we have fallback
    }
};

module.exports = {
    sendAdminNotification,
    sendUserConfirmation,
    testEmailConfiguration
};
