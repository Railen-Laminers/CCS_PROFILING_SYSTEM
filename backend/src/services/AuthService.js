const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const EmailService = require('./EmailService');

class AuthService {
  /**
   * Generate JWT token
   */
  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  /**
   * Login with identifier (user_id or email) and password
   */
  static async login(identifier, password) {
    const user = await User.findOne({
      $or: [{ user_id: identifier }, { email: identifier }]
    }).select('+password');

    if (!user) {
      throw new Error('The provided credentials are invalid.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('The provided credentials are invalid.');
    }

    user.last_login_at = new Date();
    await user.save();

    const token = this.generateToken(user._id);
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
   * Update the authenticated user's own profile (user model fields + role-specific profile).
   */
  static async updateProfile(userId, body) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found.');
    }

    // 1. Update User model fields
    const allowedUserFields = [
      'firstname', 'middlename', 'lastname', 'email',
      'contact_number', 'gender', 'address', 'birth_date', 'profile_picture'
    ];
    for (const key of allowedUserFields) {
      if (body[key] !== undefined) {
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
    }

    // 2. Password change (if requested)
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

    // 3. Update role-specific profile (Student only – extend for faculty if needed)
    if (user.role === 'student') {
      const Student = require('../models/Student');
      let student = await Student.findOne({ user_id: user._id });
      if (!student) {
        student = new Student({ user_id: user._id });
      }

      // All fields a student may edit via frontend forms
      const allowedStudentFields = [
        'parent_guardian_name', 'emergency_contact',
        'blood_type', 'medical_condition', 'allergies', 'disabilities',
        'sports_activities', 'organizations',
        'quiz_bee_participations', 'programming_contests', 'academic_awards',
        'behavior_discipline_records', 'events_participated'
      ];

      let updated = false;
      for (const key of allowedStudentFields) {
        if (body[key] !== undefined) {
          // Handle empty strings (convert to null for scalar fields, empty arrays for arrays)
          if (body[key] === '' && !Array.isArray(body[key]) && typeof body[key] !== 'object') {
            student[key] = null;
          } else if (Array.isArray(body[key])) {
            student[key] = body[key].filter(v => v !== '');
          } else if (typeof body[key] === 'object' && body[key] !== null) {
            // For sports_activities and organizations, replace with the sent object
            student[key] = body[key];
          } else {
            student[key] = body[key];
          }
          updated = true;
        }
      }
      if (updated) {
        await student.save();
      }
    }

    // 4. Return fresh user data with populated profile
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

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.password_reset_token = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.password_reset_expires = Date.now() + 60 * 60 * 1000;
    await user.save();

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
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      email,
      password_reset_token: hashedToken,
      password_reset_expires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Token is invalid or has expired.');
    }

    user.password = password;
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;
    await user.save();
  }
}

module.exports = AuthService;