const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

async function sendVerificationEmail(to, token) {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"VeeraTube" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: '✅ Verify your VeeraTube account',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0f0f0f; color: #fff; border-radius: 12px; padding: 32px;">
        <h1 style="color: #ff4444; margin-bottom: 8px;">VeeraTube</h1>
        <p style="font-size: 16px; color: #aaa;">Welcome! Please verify your email to get started.</p>
        <a href="${verifyUrl}" style="display: inline-block; margin-top: 24px; padding: 14px 28px; background: #ff4444; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email</a>
        <p style="margin-top: 24px; color: #555; font-size: 12px;">This link expires in 24 hours. If you did not create an account, ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail };
