const mongoose = require('mongoose');
const ActivityLog = require('../models/ActivityLog');

class ActivityLogService {
  static buildActor(user) {
    if (!user) {
      return {
        actor_id: null,
        actor_user_id: null,
        actor_name: 'Unknown User',
        actor_role: null
      };
    }

    return {
      actor_id: user._id || user.id || null,
      actor_user_id: user.user_id || null,
      actor_name: [user.firstname, user.lastname].filter(Boolean).join(' ') || user.email || 'Unknown User',
      actor_role: user.role || null
    };
  }

  static async logActivity({
    user = null,
    action,
    method = null,
    endpoint = null,
    target_resource = null,
    status_code = null,
    ip_address = null,
    user_agent = null,
    metadata = null
  }) {
    if (!action) return null;
    const actor = this.buildActor(user);
    return ActivityLog.create({
      ...actor,
      action,
      method,
      endpoint,
      target_resource,
      status_code,
      ip_address,
      user_agent,
      metadata
    });
  }

  static async getLogs({
    userId,
    action,
    method,
    startDate,
    endDate,
    page = 1,
    limit = 20
  }) {
    const query = {};
    if (userId) query.actor_id = userId;
    if (action) query.action = { $regex: action, $options: 'i' };
    if (method) query.method = method.toUpperCase();
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const [logs, total] = await Promise.all([
      ActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
      ActivityLog.countDocuments(query)
    ]);

    const logsWithMessage = logs.map(log => ({
      ...log,
      friendly_message: ActivityLogService.getFriendlyMessage(log)
    }));

    return {
      logs: logsWithMessage,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  // NEW: Get the earliest and latest log dates for a specific user
  static async getUserLogDateRange(userId) {
    if (!userId) return { firstLogDate: null, lastLogDate: null };

    const [oldest, newest] = await Promise.all([
      ActivityLog.findOne({ actor_id: userId }).sort({ createdAt: 1 }).select('createdAt').lean(),
      ActivityLog.findOne({ actor_id: userId }).sort({ createdAt: -1 }).select('createdAt').lean()
    ]);

    return {
      firstLogDate: oldest ? oldest.createdAt : null,
      lastLogDate: newest ? newest.createdAt : null
    };
  }

  static async getUserLogs(userId, page = 1, limit = 10) {
    if (!userId) return { logs: [], pagination: { total: 0, page, limit, totalPages: 0 } };
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const skip = (safePage - 1) * safeLimit;

    const [logs, total] = await Promise.all([
      ActivityLog.find({ actor_id: userId }).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
      ActivityLog.countDocuments({ actor_id: userId })
    ]);

    const logsWithMessage = logs.map(log => ({
      ...log,
      friendly_message: ActivityLogService.getFriendlyMessage(log)
    }));

    return {
      logs: logsWithMessage,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  static getFriendlyMessage(log) {
    const { action, metadata, actor_name } = log;
    const timestamp = log.createdAt ? new Date(log.createdAt).toLocaleString() : 'unknown time';
    const who = actor_name && actor_name !== 'Unknown User' ? actor_name : 'Someone';

    switch (action) {
      // ========== AUTH ACTIONS ==========
      case 'LOGIN_SUCCESS':
        return `${who} logged in successfully at ${timestamp}.`;
      case 'LOGIN_FAILED': {
        const identifier = metadata?.identifier || 'unknown account';
        return `Failed login attempt for "${identifier}" at ${timestamp}.`;
      }
      case 'LOGOUT':
        return `${who} logged out at ${timestamp}.`;
      case 'FORGOT_PASSWORD_REQUEST':
        return `Password reset requested for ${metadata?.email || 'an email address'} at ${timestamp}.`;
      case 'PASSWORD_RESET_SUCCESS':
        return `Password was successfully reset for ${metadata?.email || 'the account'} at ${timestamp}.`;
      case 'PASSWORD_RESET_FAILED':
        return `A password reset attempt failed at ${timestamp}.`;
      case 'UPDATE_PROFILE': {
        const changes = metadata?.changes;
        if (!changes || Object.keys(changes).length === 0) {
          return `${who} updated their profile at ${timestamp}.`;
        }

        // Helper to detect profile picture fields
        const isPictureField = (fieldName) => {
          const pictureNames = ['profile_picture', 'profilePicture', 'avatar', 'photo', 'image', 'picture'];
          return pictureNames.includes(fieldName.toLowerCase());
        };

        const changeLines = Object.entries(changes).map(([field, { old, new: newVal }]) => {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

          if (isPictureField(field)) {
            const oldDesc = old ? 'an image' : 'no image';
            const newDesc = newVal ? 'a new image' : 'removed the image';
            return `  ${fieldName}: ${oldDesc} → ${newDesc}`;
          }

          // For all other fields, show the actual old/new values
          return `  ${fieldName}: "${old}" → "${newVal}"`;
        });

        const header = `${who} updated the following fields at ${timestamp}:`;
        const oldNewHeader = `Old → New`;
        return `${header}\n${oldNewHeader}\n${changeLines.join('\n')}`;
      }

      // ========== USER MANAGEMENT ACTIONS ==========
      case 'USER_CREATED':
        return `${who} created a new ${metadata?.created_user_role || 'user'} with ID "${metadata?.created_user_id}" at ${timestamp}.`;
      case 'USER_UPDATED': {
        const changes = metadata?.changes;
        if (!changes || Object.keys(changes).length === 0) {
          return `${who} updated user "${metadata?.updated_user_id}" (no changes) at ${timestamp}.`;
        }
        const changeLines = Object.entries(changes).map(([field, { old, new: newVal }]) => {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
          return `  ${fieldName}: "${old}" → "${newVal}"`;
        });
        const header = `${who} updated the following fields at ${timestamp}:`;
        const oldNewHeader = `Old → New`;
        return `${header}\n${oldNewHeader}\n${changeLines.join('\n')}`;
      }
      case 'USER_DELETED':
        return `${who} deleted user "${metadata?.deleted_user_id}" (${metadata?.deleted_user_role}) at ${timestamp}.`;
      case 'STUDENTS_IMPORTED':
        return `${who} imported ${metadata?.imported_count || 0} students from file "${metadata?.filename}" (${metadata?.failed_count || 0} failed) at ${timestamp}.`;
      case 'STUDENTS_EXPORTED':
        return `${who} exported student data (${metadata?.export_format || 'file'}) at ${timestamp}.`;

      // ========== EVENT ACTIONS ==========
      case 'EVENT_CREATED': {
        const title = metadata?.event_title || 'an event';
        const start = metadata?.start_datetime ? new Date(metadata.start_datetime).toLocaleString() : 'unknown time';
        const end = metadata?.end_datetime ? new Date(metadata.end_datetime).toLocaleString() : 'unknown time';
        return `${who} created event "${title}" (${metadata?.event_category || 'uncategorized'}) scheduled from ${start} to ${end} at ${timestamp}.`;
      }
      case 'EVENT_UPDATED': {
        const title = metadata?.event_title || 'an event';
        const changes = metadata?.changes;
        if (!changes || Object.keys(changes).length === 0) {
          return `${who} updated event "${title}" (no changes) at ${timestamp}.`;
        }
        const changeLines = Object.entries(changes).map(([field, { old, new: newVal }]) => {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
          return `  ${fieldName}: "${old}" → "${newVal}"`;
        });
        const header = `${who} updated the following fields of event "${title}" at ${timestamp}:`;
        const oldNewHeader = `Old → New`;
        return `${header}\n${oldNewHeader}\n${changeLines.join('\n')}`;
      }
      case 'EVENT_DELETED': {
        const title = metadata?.event_title || 'an event';
        return `${who} deleted event "${title}" at ${timestamp}.`;
      }
      case 'EVENT_REGISTERED': {
        const title = metadata?.event_title || 'an event';
        const studentId = metadata?.student_user_id || 'a student';
        if (log.actor_id && metadata?.student_user_id && log.actor_id.toString() === metadata.student_user_id.toString()) {
          return `${who} registered for event "${title}" at ${timestamp}.`;
        }
        return `${who} registered student ${studentId} for event "${title}" at ${timestamp}.`;
      }
      case 'EVENT_UNREGISTERED': {
        const title = metadata?.event_title || 'an event';
        const studentId = metadata?.student_user_id || 'a student';
        if (log.actor_id && metadata?.student_user_id && log.actor_id.toString() === metadata.student_user_id.toString()) {
          return `${who} unregistered from event "${title}" at ${timestamp}.`;
        }
        return `${who} unregistered student ${studentId} from event "${title}" at ${timestamp}.`;
      }
      case 'EVENT_INVITED': {
        const title = metadata?.event_title || 'an event';
        const invitedId = metadata?.invited_user_id || 'a student';
        return `${who} invited user ${invitedId} to event "${title}" at ${timestamp}.`;
      }
      case 'EVENT_INVITATION_RESPONDED': {
        const title = metadata?.event_title || 'an event';
        const response = metadata?.response === 'accepted' ? 'accepted' : 'declined';
        return `${who} ${response} the invitation to event "${title}" at ${timestamp}.`;
      }

      // ========== INSTRUCTION / CLASS ACTIONS ==========
      case 'CLASS_CREATED': {
        const course = metadata?.course || 'class';
        const section = metadata?.section || '';
        const date = metadata?.date || 'a date';
        if (metadata?.series_id) {
          return `${who} scheduled ${metadata.count} recurring sessions from ${metadata.first_date} to ${metadata.last_date} for ${course} (${section}) at ${timestamp}.`;
        }
        return `${who} created a new class:  (${section}) scheduled on ${date} at ${timestamp}.`;
      }
      case 'CLASS_UPDATED': {
        const changes = metadata?.changes;
        if (!changes || Object.keys(changes).length === 0) {
          return `${who} updated class ${metadata?.class_id} at ${timestamp}.`;
        }
        const changeLines = Object.entries(changes).map(([field, { old, new: newVal }]) => {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
          return `  ${fieldName}: "${old}" → "${newVal}"`;
        });
        return `${who} updated the following class details at ${timestamp}:\n${changeLines.join('\n')}`;
      }
      case 'CLASS_DELETED': {
        const course = metadata?.course || 'a course';
        const section = metadata?.section || '';
        return `${who} deleted class "${metadata?.class_id}" (${course} - ${section}) at ${timestamp}.`;
      }
      case 'LESSON_PLAN_CREATED': {
        const topic = metadata?.topic || 'a lesson plan';
        const courseTitle = metadata?.course_title || 'the course';
        return `${who} created a lesson plan for "${topic}" (course: ${courseTitle}) at ${timestamp}.`;
      }
      case 'LESSON_PLAN_DELETED': {
        const topic = metadata?.topic || 'a lesson plan';
        return `${who} deleted the lesson plan "${topic}" at ${timestamp}.`;
      }
      case 'MATERIAL_CREATED': {
        const title = metadata?.title || 'a material';
        const courseTitle = metadata?.course_title || 'the course';
        return `${who} uploaded a new material "${title}" for ${courseTitle} at ${timestamp}.`;
      }
      case 'MATERIAL_DELETED': {
        const title = metadata?.title || 'a material';
        return `${who} deleted the material "${title}" at ${timestamp}.`;
      }

      // ========== COURSE ACTIONS ==========
      case 'COURSE_CREATED':
        return `${who} created a new course "${metadata?.course_code}" - ${metadata?.course_title} at ${timestamp}.`;
      case 'COURSE_UPDATED': {
        const changes = metadata?.changes;
        if (!changes || Object.keys(changes).length === 0) {
          return `${who} updated course "${metadata?.course_code}" at ${timestamp}.`;
        }
        const changeLines = Object.entries(changes).map(([field, { old, new: newVal }]) => {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
          return `  ${fieldName}: "${old}" → "${newVal}"`;
        });
        return `${who} updated the following course details for ${metadata?.course_code} at ${timestamp}:\n${changeLines.join('\n')}`;
      }
      case 'COURSE_DELETED':
        return `${who} deleted course "${metadata?.course_code}" - ${metadata?.course_title} at ${timestamp}.`;

      // ========== ROOM ACTIONS ==========
      case 'ROOM_CREATED':
        return `${who} created a new room "${metadata?.room_name}" (capacity: ${metadata?.capacity}) at ${timestamp}.`;
      case 'ROOM_UPDATED': {
        const changes = metadata?.changes;
        if (!changes || Object.keys(changes).length === 0) {
          return `${who} updated room "${metadata?.room_name}" (no changes) at ${timestamp}.`;
        }
        const changeLines = Object.entries(changes).map(([field, { old, new: newVal }]) => {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
          return `  ${fieldName}: "${old}" → "${newVal}"`;
        });
        const header = `${who} updated the following fields of room "${metadata?.room_name}" at ${timestamp}:`;
        const oldNewHeader = `Old → New`;
        return `${header}\n${oldNewHeader}\n${changeLines.join('\n')}`;
      }
      case 'ROOM_DELETED':
        return `${who} deleted room "${metadata?.room_name}" (originally capacity: ${metadata?.capacity}) at ${timestamp}.`;

      default:
        return `${who} performed ${action} at ${timestamp}.`;
    }
  }
}

module.exports = ActivityLogService;