const transporter = require("../config/nodemailer");
require("dotenv").config();

const FROM_EMAIL = `"Alora by Trio" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`;

const statusLabels = {
  pending: "Order Received",
  confirmed: "Order Confirmed",
  processing: "Being Prepared",
  packed: "Packed & Ready",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusEmojis = {
  pending: "📋",
  confirmed: "✅",
  processing: "⚙️",
  packed: "📦",
  shipped: "🚚",
  delivered: "🎉",
  cancelled: "❌",
};

/**
 * Send order status update email to customer.
 */
async function sendOrderStatusEmail(order, newStatus) {
  const { customer, items, total } = order;
  const emoji = statusEmojis[newStatus] || "📋";
  const label = statusLabels[newStatus] || newStatus;

  const itemsList = items
    .map(
      (it) =>
        `• ${it.name}${it.variant ? ` (${it.variant})` : ""} × ${it.quantity} — ₹${it.price * it.quantity}`,
    )
    .join("\n");

  const trackingInfo = order.tracking
    ? `\n\n📦 Tracking Number: ${order.tracking}`
    : "";

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #F7F4EF; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-family: 'Georgia', serif; color: #1A1A1A; font-size: 28px; margin: 0;">Alora by Trio</h1>
        <p style="color: #B8973A; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-top: 5px;">Luxury Jewellery & Lifestyle</p>
      </div>
      
      <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
        <h2 style="color: #1A1A1A; font-size: 22px; margin-top: 0;">${emoji} ${label}</h2>
        <p style="color: #666; font-size: 14px;">Hi ${customer.name},</p>
        <p style="color: #666; font-size: 14px;">Your order <strong style="color: #B8973A;">#${order.orderId || ""}</strong> has been updated.</p>
        
        <div style="background: #F7F4EF; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1A1A1A; font-size: 16px; margin-top: 0;">Order Details</h3>
          <pre style="color: #666; font-size: 13px; white-space: pre-wrap; margin: 0;">${itemsList}</pre>
          <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 15px 0;">
          <p style="color: #1A1A1A; font-size: 16px; font-weight: bold; margin: 0;">Total: ₹${total}</p>
        </div>
        ${trackingInfo ? `<p style="color: #666; font-size: 14px;">${trackingInfo}</p>` : ""}
        
        <p style="color: #666; font-size: 14px;">If you have any questions, reach out to us on Instagram <a href="https://instagram.com/alora.trio" style="color: #B8973A;">@alora.trio</a></p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} Alora by Trio. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: customer.email,
      subject: `${emoji} Order Update — ${label} | Alora by Trio`,
      html,
    });
    console.log(`📧 Email sent to ${customer.email} — Status: ${newStatus}`);
    return true;
  } catch (err) {
    console.error("Email send error:", err.message);
    return false;
  }
}

/**
 * Send order confirmation email.
 */
async function sendOrderConfirmationEmail(order) {
  return sendOrderStatusEmail(order, "pending");
}

/**
 * Send test email to verify SMTP configuration.
 */
async function sendTestEmail(toEmail) {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: toEmail,
      subject: "✅ Alora by Trio — Email Test Successful",
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Configuration Working!</h2>
        <p>Your Gmail SMTP is correctly configured for Alora by Trio.</p>
      </div>`,
    });
    return true;
  } catch (err) {
    console.error("Test email error:", err.message);
    throw err;
  }
}

module.exports = {
  sendOrderStatusEmail,
  sendOrderConfirmationEmail,
  sendTestEmail,
};
