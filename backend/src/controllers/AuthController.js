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
      // In JWT, we don't need to do anything server-side
      // The client should remove the token
      res.status(200).json({
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
