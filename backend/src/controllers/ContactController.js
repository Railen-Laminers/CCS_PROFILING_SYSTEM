const EmailService = require('../services/EmailService');

class ContactController {
  /**
   * Send support inquiry email
   */
  static async sendInquiry(req, res, next) {
    try {
      const { name, email, subject, message } = req.body;

      // Basic validation
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          message: 'Please provide all required fields: name, email, subject, and message.'
        });
      }

      // Send email logic using EmailService
      await EmailService.sendContactInquiry({ name, email, subject, message });

      res.status(200).json({
        message: 'Your message has been sent successfully. We will get back to you soon.'
      });
    } catch (error) {
      console.error('Contact Inquiry Error:', error);
      res.status(500).json({
        message: 'Unable to send message. Please try again later.'
      });
    }
  }
}

module.exports = ContactController;
