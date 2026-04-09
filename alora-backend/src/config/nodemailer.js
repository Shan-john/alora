const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zoho.in', // Default to Zoho IN (change to smtp.zoho.com if global)
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || process.env.GMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify().then(() => {
  console.log('✅ Nodemailer: SMTP ready');
}).catch((err) => {
  console.warn('⚠️ Nodemailer: SMTP not configured —', err.message);
});

module.exports = transporter;
