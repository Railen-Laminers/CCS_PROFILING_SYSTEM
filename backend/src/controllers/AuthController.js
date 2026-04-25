const AuthService = require('../services/AuthService');

class AuthController {
  /**
   * Login with identifier (user_id or email) and password
   */
  static async login(req, res, next) {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({
          message: 'Please provide identifier and password'
        });
      }

      const result = await AuthService.login(identifier, password);

      if (result.require2FA) {
        return res.status(200).json({
          require2FA: true,
          message: 'Verification code sent to your email',
          email: result.email,
          userId: result.userId
        });
      }

      res.status(200).json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      if (error.message === 'The provided credentials are invalid.') {
        return res.status(401).json({
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Get the authenticated user's profile
   */
  static async me(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user._id);

      res.status(200).json({
        user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the authenticated user's profile
   */
  static async updateProfile(req, res, next) {
    try {
      const user = await AuthService.updateProfile(req.user._id, req.body);
      res.status(200).json({ user });
    } catch (error) {
      if (
        error.message === 'User not found.' ||
        error.message === 'User not found'
      ) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (
        error.message.includes('Current password') ||
        error.message.includes('incorrect') ||
        error.message.includes('at least 6')
      ) {
        return res.status(400).json({ message: error.message });
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0] || 'field';
        return res.status(400).json({ message: `Duplicate value for field: ${field}` });
      }
      if (error.name === 'ValidationError') {
        const message = Object.values(error.errors).map((e) => e.message).join(', ');
        return res.status(400).json({ message });
      }
      next(error);
    }
  }

  /**
   * Logout the authenticated user
   */
  static async logout(req, res, next) {
    try {
      res.status(200).json({
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send password reset token to email
   */
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Please provide an email' });
      }

      await AuthService.forgotPassword(email);

      res.status(200).json({
        message: 'Password reset email sent'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(req, res, next) {
    try {
      const { token, email, password } = req.body;
      if (!token || !email || !password) {
        return res.status(400).json({ message: 'Please provide token, email, and password' });
      }

      await AuthService.resetPassword(token, email, password);

      res.status(200).json({
        message: 'Password reset successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify 2FA OTP and complete login
   */
  static async verify2FA(req, res, next) {
    try {
      const { userId, otp } = req.body;
      if (!userId || !otp) {
        return res.status(400).json({ message: 'Please provide userId and verification code' });
      }

      const result = await AuthService.verify2FA(userId, otp);

      res.status(200).json({
        message: 'Verification successful',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      if (error.message === 'Invalid or expired verification code.') {
        return res.status(401).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Toggle 2FA status
   */
  static async toggle2FA(req, res, next) {
    try {
      const { enabled } = req.body;
      if (enabled === undefined) {
        return res.status(400).json({ message: 'Please provide enabled status' });
      }

      const user = await AuthService.toggle2FA(req.user._id, enabled);

      res.status(200).json({
        message: `2FA ${enabled ? 'enabled' : 'disabled'} successfully`,
        user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
