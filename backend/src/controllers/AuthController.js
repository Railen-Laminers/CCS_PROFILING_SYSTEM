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
}

module.exports = AuthController;
