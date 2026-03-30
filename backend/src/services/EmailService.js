const nodemailer = require('nodemailer');

class EmailService {
  /**
   * Create transporter (Using placeholders for SMTP - user should update .env)
   */
  static getTransporter() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
      port: process.env.MAIL_PORT || 2525,
      auth: {
        user: process.env.MAIL_USERNAME || '',
        pass: process.env.MAIL_PASSWORD || ''
      }
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email, token) {
    const transporter = this.getTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}&email=${email}`;

    const mailOptions = {
      from: `"Profiling System" <${process.env.MAIL_FROM_ADDRESS || 'noreply@example.com'}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You are receiving this email because we received a password reset request for your account.</p>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request a password reset, no further action is required.</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  }

  /**
   * Send contact inquiry email to admin
   */
  static async sendContactInquiry(contactData) {
    const transporter = this.getTransporter();

    const mailOptions = {
      from: `"Contact Form" <${contactData.email}>`,
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      subject: `Support Inquiry: ${contactData.subject}`,
      html: `
        <h1>New Support Inquiry</h1>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message}</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService;
