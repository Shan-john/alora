const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify().then(() => {
  console.log('✅ Nodemailer: Gmail SMTP ready');
}).catch((err) => {
  console.warn('⚠️ Nodemailer: Gmail SMTP not configured —', err.message);
});

module.exports = transporter;
