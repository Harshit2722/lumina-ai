const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const { email, type, otp } = options;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let subject = '';
  let html = '';

  if (type === 'VERIFY_EMAIL') {
    subject = 'Lumina AI - Verification Code';
    html = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; background: #1a181e; color: #e6e0e9;">
        <h2 style="color: #e7c365; text-align: center; font-size: 24px; margin-bottom: 20px;">Welcome to Lumina AI</h2>
        <p style="text-align: center; opacity: 0.8;">Thank you for initializing your gateway. Use the code below to verify your identity:</p>
        <div style="background: rgba(231,195,101,0.1); padding: 30px; text-align: center; font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #e7c365; border-radius: 16px; margin: 30px 0; border: 1px solid rgba(231,195,101,0.2);">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #777; text-align: center;">This neural handshake will expire in 24 hours. If you did not request this, please ignore this transmission.</p>
      </div>
    `;
  } else if (type === 'RESEND_OTP') {
    subject = 'Lumina AI - New Verification Code';
    html = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; background: #1a181e; color: #e6e0e9;">
        <h2 style="color: #e7c365; text-align: center; font-size: 24px; margin-bottom: 20px;">New Verification Code</h2>
        <p style="text-align: center; opacity: 0.8;">You requested a fresh neural handshake. Use the code below:</p>
        <div style="background: rgba(231,195,101,0.1); padding: 30px; text-align: center; font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #e7c365; border-radius: 16px; margin: 30px 0; border: 1px solid rgba(231,195,101,0.2);">
          ${otp}
        </div>
      </div>
    `;
  }

  const message = {
    from: `"Lumina AI" <${process.env.SMTP_USER}>`,
    to: email,
    subject: subject,
    html: html,
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
