const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  /**
   * Generate JWT token
   */
  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
expiresIn: '7d'
    });
  }

  /**
   * Login with identifier (user_id or email) and password
   */
  static async login(identifier, password) {
    // Find user by user_id or email
    const user = await User.findOne({
      $or: [
        { user_id: identifier },
        { email: identifier }
      ]
    }).select('+password');

    if (!user) {
      throw new Error('The provided credentials are invalid.');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('The provided credentials are invalid.');
    }

    // Update last login
    user.last_login_at = new Date();
    await user.save();

    // Generate token
    const token = this.generateToken(user._id);

    // Format user with profile
    const formattedUser = await this.formatUserWithProfile(user);

    return {
      user: formattedUser,
      token
    };
  }

  /**
   * Format user data including role-specific profile
   */
  static async formatUserWithProfile(user) {
    const userData = {
      id: user._id,
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      birth_date: user.birth_date,
      contact_number: user.contact_number,
      gender: user.gender,
      address: user.address,
      profile_picture: user.profile_picture,
      is_active: user.is_active
    };

    if (user.role === 'student') {
      await user.populate('student');
      userData.student = user.student;
    } else if (user.role === 'faculty') {
      await user.populate('faculty');
      userData.faculty = user.faculty;
    }

    return userData;
  }

  /**
   * Get current user with profile
   */
  static async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await this.formatUserWithProfile(user);
  }
}

module.exports = AuthService;
