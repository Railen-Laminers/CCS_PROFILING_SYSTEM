const UserService = require('../services/UserService');

class UserController {
  /**
   * List all users (with their role-specific profiles)
   */
  static async index(req, res, next) {
    try {
      const users = await UserService.getAllUsers();

      res.status(200).json({
        users
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all students (with their student profiles)
   */
  static async getStudents(req, res, next) {
    try {
      const students = await UserService.getAllStudents();

      res.status(200).json({
        students
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all faculty (with their faculty profiles)
   */
  static async getFaculty(req, res, next) {
    try {
      const faculty = await UserService.getAllFaculty();

      res.status(200).json({
        faculty
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Show a single user with their profile
   */
  static async show(req, res, next) {
    try {
      const { identifier } = req.params;
      const user = await UserService.findByIdentifier(identifier);

      res.status(200).json({
        user
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Create a new student or faculty
   */
  static async store(req, res, next) {
    try {
      const result = await UserService.createUser(req.body);

      res.status(201).json(result);
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
          message: `Duplicate value for field: ${field}`
        });
      }
      next(error);
    }
  }

  /**
   * Update a user (common fields and role-specific fields)
   */
  static async update(req, res, next) {
    try {
      const { identifier } = req.params;

      // Separate user data from profile data
      const userData = {};
      const profileData = {};

      // User fields
      const userFields = [
        'firstname', 'middlename', 'lastname', 'user_id', 'email', 'password',
        'birth_date', 'contact_number', 'gender', 'address',
        'profile_picture', 'is_active'
      ];

      userFields.forEach(field => {
        if (req.body[field] !== undefined) {
          userData[field] = req.body[field];
        }
      });

      // Profile fields (will be determined by role)
      const studentFields = [
        'parent_guardian_name', 'emergency_contact', 'section', 'program',
        'year_level', 'gpa', 'current_subjects', 'academic_awards',
        'blood_type', 'disabilities',
        'medical_condition', 'allergies', 'sports_activities',
        'organizations', 'behavior_discipline_records'
      ];

      const facultyFields = [
        'department', 'position', 'specialization', 'subjects_handled',
        'teaching_schedule', 'research_projects'
      ];

      // Get user to determine role
      const User = require('../models/User');
      const user = await User.findOne({
        $or: [
          { _id: identifier },
          { user_id: identifier }
        ]
      });

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      const profileFields = user.role === 'student' ? studentFields : facultyFields;

      profileFields.forEach(field => {
        if (req.body[field] !== undefined) {
          profileData[field] = req.body[field];
        }
      });

      const result = await UserService.updateUser(identifier, userData, profileData);

      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
          message: `Duplicate value for field: ${field}`
        });
      }
      next(error);
    }
  }

  /**
   * Delete a user (only if inactive)
   */
  static async destroy(req, res, next) {
    try {
      const { identifier } = req.params;
      await UserService.deleteUser(identifier, req.user._id);

      res.status(200).json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      if (error.message.includes('cannot delete') || error.message.includes('deactivated')) {
        return res.status(403).json({
          message: error.message
        });
      }
      next(error);
    }
  }

  // static async importStudents(req, res, next) {
  //     try {
  //         // Check if file exists
  //         if (!req.file) {
  //             return res.status(400).json({ message: 'No file uploaded.' });
  //         }
          
  //         // Process the Excel file and create users
  //         const result = await UserService.importStudentsFromExcel(req.file);
          
  //         res.status(200).json({
  //             message: `Successfully imported ${result.importedCount} students.`,
  //             importedCount: result.importedCount,
  //             errors: result.errors
  //         });
  //     } catch (error) {
  //         next(error);
  //     }
  // }

  // UPDATE this method in UserController.js
  static async importStudents(req, res, next) {
      try {
          // Check if file exists
          if (!req.file) {
              return res.status(400).json({ message: 'No file uploaded.' });
          }
          
          // Process the Excel file and create users
          const result = await UserService.importStudentsFromExcel(req.file);
          
          // MODIFIED: Return more detailed response
          const responseMessage = result.errors.length > 0 
              ? `Successfully imported ${result.importedCount} students, but failed to import ${result.errors.length} students.`
              : `Successfully imported ${result.importedCount} students.`;
          
          res.status(200).json({
              message: responseMessage,
              importedCount: result.importedCount,
              failedCount: result.errors.length,
              errors: result.errors // This will help debug which rows failed
          });
      } catch (error) {
          next(error);
      }
  }
}

module.exports = UserController;
