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
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f9fafb; padding: 40px 20px; line-height: 1.6;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #f97316; padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Profiling System</h1>
            </div>
            <div style="padding: 40px 32px;">
              <h2 style="color: #111827; margin: 0 0 16px; font-size: 20px; font-weight: 600;">Password Reset Request</h2>
              <p style="color: #4b5563; margin-bottom: 24px;">Someone requested a password reset for your account. If this was you, please use the button below to reset it securely.</p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #f97316; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">Reset Password</a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">This secure link will expire in 1 hour. If you didn't request a reset, you can safely ignore this email.</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 24px 32px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Profiling System. All rights reserved.</p>
            </div>
          </div>
        </div>
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
        <div style="font-family: 'Inter', system-ui, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
            <div style="padding: 32px; border-bottom: 1px solid #f3f4f6;">
              <h1 style="color: #111827; margin: 0; font-size: 20px;">New Support Inquiry</h1>
              <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0;">Received on ${new Date().toLocaleDateString()}</p>
            </div>
            <div style="padding: 32px;">
              <div style="margin-bottom: 24px;">
                <label style="display: block; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase;">From</label>
                <p style="color: #111827; margin: 4px 0; font-weight: 500;">${contactData.name} (${contactData.email})</p>
              </div>
              <div style="margin-bottom: 24px;">
                <label style="display: block; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase;">Subject</label>
                <p style="color: #111827; margin: 4px 0; font-weight: 500;">${contactData.subject}</p>
              </div>
              <div>
                <label style="display: block; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase;">Message</label>
                <div style="color: #4b5563; margin-top: 8px; padding: 16px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #f3f4f6; white-space: pre-wrap;">${contactData.message}</div>
              </div>
            </div>
          </div>
        </div>
      `
    };

    return await transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService;
