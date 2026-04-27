const UserService = require('../services/UserService');
const ActivityLogService = require('../services/ActivityLogService');
const User = require('../models/User');

// Deep equality check for any values (including arrays/objects)
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, idx) => deepEqual(item, b[idx]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => deepEqual(a[key], b[key]));
  }
  return false;
}

// Format value for display in logs (readable)
function formatValue(value, depth = 0) {
  if (value == null) return '(empty)';
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.length > 3 && depth === 0) {
      return `[${value.length} items]`;
    }
    // For arrays of objects, stringify with indentation
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    if (keys.length > 5 && depth === 0) {
      return `{${keys.length} properties}`;
    }
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  if (typeof value === 'string' && value.length > 100) {
    return value.substring(0, 97) + '...';
  }
  return String(value);
}

class UserController {
  static async index(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  }

  static async getStudents(req, res, next) {
    try {
      const students = await UserService.getAllStudents();
      res.status(200).json({ students });
    } catch (error) {
      next(error);
    }
  }

  static async getFaculty(req, res, next) {
    try {
      const faculty = await UserService.getAllFaculty();
      res.status(200).json({ faculty });
    } catch (error) {
      next(error);
    }
  }

  static async show(req, res, next) {
    try {
      const { identifier } = req.params;
      const user = await UserService.findByIdentifier(identifier);
      res.status(200).json({ user });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  static async store(req, res, next) {
    try {
      const result = await UserService.createUser(req.body);

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'USER_CREATED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'user',
        status_code: 201,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          created_user_id: result.user.user_id,
          created_user_role: result.user.role,
          created_user_email: result.user.email
        }
      });

      res.status(201).json(result);
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({ message: `Duplicate value for field: ${field}` });
      }
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { identifier } = req.params;

      // Prepare userData and profileData based on request body
      const userData = {};
      const profileData = {};

      const userFields = [
        'firstname', 'middlename', 'lastname', 'user_id', 'email', 'password',
        'birth_date', 'contact_number', 'gender', 'address',
        'profile_picture', 'is_active'
      ];

      userFields.forEach(field => {
        if (req.body[field] !== undefined) userData[field] = req.body[field];
      });

      const studentFields = [
        'parent_guardian_name', 'emergency_contact', 'section', 'program',
        'year_level', 'gpa', 'current_subjects', 'academic_awards',
        'blood_type', 'disabilities', 'medical_condition', 'allergies',
        'sports_activities', 'organizations', 'behavior_discipline_records'
      ];

      const facultyFields = [
        'department', 'position', 'specialization', 'subjects_handled',
        'teaching_schedule', 'research_projects'
      ];

      // Fetch current user with populated profiles BEFORE update
      const currentUserDoc = await User.findOne({
        $or: [{ _id: identifier }, { user_id: identifier }]
      }).populate('student').populate('faculty');

      if (!currentUserDoc) {
        return res.status(404).json({ message: 'User not found' });
      }

      const profileFields = currentUserDoc.role === 'student' ? studentFields : facultyFields;
      profileFields.forEach(field => {
        if (req.body[field] !== undefined) profileData[field] = req.body[field];
      });

      // Perform update
      const result = await UserService.updateUser(identifier, userData, profileData);

      // Build changes object – ONLY for fields that were in request AND actually changed
      const changes = {};

      // Compare user fields (only those present in req.body)
      for (const field of userFields) {
        if (req.body.hasOwnProperty(field)) {
          const oldVal = currentUserDoc[field];
          const newVal = result.user[field];
          if (!deepEqual(oldVal, newVal)) {
            changes[field] = {
              old: formatValue(oldVal),
              new: formatValue(newVal)
            };
          }
        }
      }

      // Compare profile fields (only those present in req.body)
      if (currentUserDoc.role === 'student' && result.student) {
        for (const field of studentFields) {
          if (req.body.hasOwnProperty(field)) {
            const oldVal = currentUserDoc.student?.[field];
            const newVal = result.student[field];
            if (!deepEqual(oldVal, newVal)) {
              changes[field] = {
                old: formatValue(oldVal),
                new: formatValue(newVal)
              };
            }
          }
        }
      } else if (currentUserDoc.role === 'faculty' && result.faculty) {
        for (const field of facultyFields) {
          if (req.body.hasOwnProperty(field)) {
            const oldVal = currentUserDoc.faculty?.[field];
            const newVal = result.faculty[field];
            if (!deepEqual(oldVal, newVal)) {
              changes[field] = {
                old: formatValue(oldVal),
                new: formatValue(newVal)
              };
            }
          }
        }
      }

      // Log only if there are actual changes
      if (Object.keys(changes).length > 0) {
        await ActivityLogService.logActivity({
          user: req.user,
          action: 'USER_UPDATED',
          method: req.method,
          endpoint: req.originalUrl,
          target_resource: 'user',
          status_code: 200,
          ip_address: req.ip,
          user_agent: req.get('user-agent') || null,
          metadata: {
            updated_user_id: result.user.user_id,
            updated_user_role: result.user.role,
            changes: changes
          }
        });
      }

      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({ message: `Duplicate value for field: ${field}` });
      }
      next(error);
    }
  }

  static async destroy(req, res, next) {
    try {
      const { identifier } = req.params;

      const userToDelete = await User.findOne({
        $or: [{ _id: identifier }, { user_id: identifier }]
      });
      if (!userToDelete) {
        return res.status(404).json({ message: 'User not found' });
      }
      const deletedUserId = userToDelete.user_id;
      const deletedUserRole = userToDelete.role;

      await UserService.deleteUser(identifier, req.user._id);

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'USER_DELETED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'user',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          deleted_user_id: deletedUserId,
          deleted_user_role: deletedUserRole
        }
      });

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('cannot delete') || error.message.includes('deactivated')) {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  }

  static async importStudents(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }

      const result = await UserService.importStudentsFromExcel(req.file);

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'STUDENTS_IMPORTED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'user',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          filename: req.file.originalname,
          imported_count: result.importedCount,
          failed_count: result.errors.length,
          sample_errors: result.errors.slice(0, 3).map(e => ({ row: e.rowNumber, message: e.error }))
        }
      });

      const responseMessage = result.errors.length > 0
        ? `Successfully imported ${result.importedCount} students, but failed to import ${result.errors.length} students.`
        : `Successfully imported ${result.importedCount} students.`;

      res.status(200).json({
        message: responseMessage,
        importedCount: result.importedCount,
        failedCount: result.errors.length,
        errors: result.errors
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;