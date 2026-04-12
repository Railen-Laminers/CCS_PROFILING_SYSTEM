const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const EmailService = require('./EmailService');

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
    // const isMatch = await user.comparePassword(password);
    // if (!isMatch) {
    //   throw new Error('The provided credentials are invalid.');
    // }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error(`Password mismatch - Input: "${password}" | DB Hash: "${user.password}" | User: ${user.email}`);
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
      throw new Error('User not found.');
    }
    return await this.formatUserWithProfile(user);
  }

  /**
   * Update the authenticated user's own profile (user model fields + optional password change).
   * Does not allow changing user_id, role, or is_active from this endpoint.
   */
  static async updateProfile(userId, body) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found.');
    }

    const allowed = [
      'firstname',
      'middlename',
      'lastname',
      'email',
      'contact_number',
      'gender',
      'address',
      'birth_date',
      'profile_picture'
    ];

    for (const key of allowed) {
      if (body[key] === undefined) continue;
      if (key === 'birth_date' && (body[key] === '' || body[key] === null)) {
        user.birth_date = null;
        continue;
      }
      if (key === 'middlename' && body[key] === '') {
        user.middlename = null;
        continue;
      }
      if (key === 'profile_picture' && body[key] === '') {
        user.profile_picture = null;
        continue;
      }
      user[key] = body[key];
    }

    if (body.newPassword) {
      if (!body.currentPassword) {
        throw new Error('Current password is required to change password.');
      }
      const isMatch = await user.comparePassword(body.currentPassword);
      if (!isMatch) {
        throw new Error('Current password is incorrect.');
      }
      if (String(body.newPassword).length < 6) {
        throw new Error('New password must be at least 6 characters.');
      }
      user.password = body.newPassword;
    }

    await user.save();
    const fresh = await User.findById(userId);
    return await this.formatUserWithProfile(fresh);
  }

  /**
   * Send password reset token to email
   */
  static async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('No user with that email found.');
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.password_reset_token = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.password_reset_expires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    // Send email
    try {
      await EmailService.sendPasswordResetEmail(email, resetToken);
    } catch (err) {
      user.password_reset_token = undefined;
      user.password_reset_expires = undefined;
      await user.save();
      throw new Error('There was an error sending the email. Try again later.');
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token, email, password) {
    // Hash token to compare with DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      email,
      password_reset_token: hashedToken,
      password_reset_expires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Token is invalid or has expired.');
    }

    // Set new password
    user.password = password;
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;

    await user.save();
  }
}

module.exports = AuthService;
