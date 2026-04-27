const AuthService = require('../services/AuthService');
const ActivityLogService = require('../services/ActivityLogService');
const User = require('../models/User');

class AuthController {
  /**
   * Login with identifier (user_id or email) and password
   */
  static async login(req, res, next) {
    let identifier = null;
    try {
      const { identifier: incomingIdentifier, password } = req.body;
      identifier = incomingIdentifier;

      if (!identifier || !password) {
        return res.status(400).json({
          message: 'Please provide identifier and password'
        });
      }

      const result = await AuthService.login(identifier, password);

      await ActivityLogService.logActivity({
        user: result.user,
        action: 'LOGIN_SUCCESS',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'auth',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: { identifier }
      });

      res.status(200).json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      if (error.message === 'The provided credentials are invalid.') {
        await ActivityLogService.logActivity({
          action: 'LOGIN_FAILED',
          method: req.method,
          endpoint: req.originalUrl,
          target_resource: 'auth',
          status_code: 401,
          ip_address: req.ip,
          user_agent: req.get('user-agent') || null,
          metadata: { identifier }
        });

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
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the authenticated user's profile – only logs changed fields
   */
  static async updateProfile(req, res, next) {
    try {
      // 1. Get current user before update
      const currentUser = await User.findById(req.user._id).lean();
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 2. Perform the update
      const updatedUser = await AuthService.updateProfile(req.user._id, req.body);

      // 3. Build changes object for fields that actually changed
      const changes = {};
      const allowedFields = ['firstname', 'lastname', 'email', 'profile_picture', 'phone', 'address'];

      for (const field of allowedFields) {
        // Only consider fields present in the request body
        if (req.body.hasOwnProperty(field)) {
          const oldValue = currentUser[field] || '';
          const newValue = updatedUser[field] || '';
          if (oldValue !== newValue) {
            changes[field] = {
              old: oldValue || '(empty)',
              new: newValue || '(empty)'
            };
          }
        }
      }

      // 4. Log only if there are actual changes
      if (Object.keys(changes).length > 0) {
        await ActivityLogService.logActivity({
          user: req.user,
          action: 'UPDATE_PROFILE',
          method: req.method,
          endpoint: req.originalUrl,
          target_resource: 'auth',
          status_code: 200,
          ip_address: req.ip,
          user_agent: req.get('user-agent') || null,
          metadata: {
            updated_fields: Object.keys(req.body),
            changes: changes   // only changed fields
          }
        });
      }

      res.status(200).json({ user: updatedUser });
    } catch (error) {
      if (error.message === 'User not found.' || error.message === 'User not found') {
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
      await ActivityLogService.logActivity({
        user: req.user,
        action: 'LOGOUT',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'auth',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
      });

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

      const user = await User.findOne({ email }).lean();
      await ActivityLogService.logActivity({
        user: user ? { ...user, _id: user._id } : null,
        action: 'FORGOT_PASSWORD_REQUEST',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'auth',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: { email }
      });

      res.status(200).json({
        message: 'Password reset email sent'
      });
    } catch (error) {
      await ActivityLogService.logActivity({
        action: 'FORGOT_PASSWORD_FAILED',
        method: req.method,
        endpoint: req.originalUrl,
        status_code: 400,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: { email: req.body?.email, error: error.message }
      }).catch(() => { });

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

      const user = await User.findOne({ email }).lean();
      await ActivityLogService.logActivity({
        user: user ? { ...user, _id: user._id } : null,
        action: 'PASSWORD_RESET_SUCCESS',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'auth',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: { email }
      });

      res.status(200).json({
        message: 'Password reset successfully'
      });
    } catch (error) {
      await ActivityLogService.logActivity({
        action: 'PASSWORD_RESET_FAILED',
        method: req.method,
        endpoint: req.originalUrl,
        status_code: 400,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: { email: req.body?.email, error: error.message }
      }).catch(() => { });

      next(error);
    }
  }
}

module.exports = AuthController;