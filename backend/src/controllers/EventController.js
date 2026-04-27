const EventService = require('../services/EventService');
const NotificationService = require('../services/NotificationService');
const ActivityLogService = require('../services/ActivityLogService');

// ----- Helpers for change detection (copied from UserController) -----
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

function formatValue(value, depth = 0) {
  if (value == null) return '(empty)';
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.length > 3 && depth === 0) {
      return `[${value.length} items]`;
    }
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
// -----------------------------------------------------------------

class EventController {
  /**
   * Display a listing of all events
   */
  static async index(req, res, next) {
    try {
      const events = await EventService.getAll();

      const transformedEvents = events.map(event => ({
        event_id: event._id,
        title: event.title,
        description: event.description,
        category: event.category,
        venue: event.venue,
        max_participants: event.max_participants,
        participant_count: event.participants?.length || 0,
        participants: event.participants || [],
        invitations: event.invitations || [],
        status: event.status,
        start_datetime: event.start_datetime,
        end_datetime: event.end_datetime
      }));

      res.status(200).json({
        events: transformedEvents
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Display the specified event by ID or title
   */
  static async show(req, res, next) {
    try {
      const { search } = req.params;
      const event = await EventService.findByIdentifier(search);

      res.status(200).json({
        event: {
          event_id: event._id,
          title: event.title,
          description: event.description,
          category: event.category,
          venue: event.venue,
          max_participants: event.max_participants,
          participant_count: event.participants?.length || 0,
          participants: event.participants || [],
          invitations: event.invitations || [],
          status: event.status,
          start_datetime: event.start_datetime,
          end_datetime: event.end_datetime
        }
      });
    } catch (error) {
      if (error.message === 'Event not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Store a newly created event
   */
  static async store(req, res, next) {
    try {
      const event = await EventService.create(req.body);

      // Log event creation
      await ActivityLogService.logActivity({
        user: req.user,
        action: 'EVENT_CREATED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'event',
        status_code: 201,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          event_id: event._id,
          event_title: event.title,
          event_category: event.category,
          start_datetime: event.start_datetime,
          end_datetime: event.end_datetime,
          venue: event.venue,
          max_participants: event.max_participants
        }
      });

      // Notify admins about new event
      try {
        await NotificationService.notifyEventCreated(
          event._id,
          event.title,
          event.description
        );
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }

      res.status(201).json({
        message: 'Event created successfully',
        event: {
          event_id: event._id,
          title: event.title,
          description: event.description,
          category: event.category,
          venue: event.venue,
          max_participants: event.max_participants,
          participant_count: 0,
          status: event.status,
          start_datetime: event.start_datetime,
          end_datetime: event.end_datetime
        }
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = [error.errors[key].message];
        });
        return res.status(400).json({ message: 'Validation error', errors });
      }
      next(error);
    }
  }

  /**
   * Update the specified event (only log changed fields)
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;

      // Fetch current event before update
      const Event = require('../models/Event');
      const currentEvent = await Event.findById(id).lean();
      if (!currentEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Perform update
      const updatedEvent = await EventService.update(id, req.body);

      // Build changes object – only fields that were in req.body AND actually changed
      const changes = {};
      const updatableFields = [
        'title', 'description', 'category', 'venue', 'max_participants',
        'start_datetime', 'end_datetime', 'status'
      ];

      for (const field of updatableFields) {
        if (req.body.hasOwnProperty(field)) {
          const oldVal = currentEvent[field];
          const newVal = updatedEvent[field];
          if (!deepEqual(oldVal, newVal)) {
            changes[field] = {
              old: formatValue(oldVal),
              new: formatValue(newVal)
            };
          }
        }
      }

      // Log only if there are actual changes
      if (Object.keys(changes).length > 0) {
        await ActivityLogService.logActivity({
          user: req.user,
          action: 'EVENT_UPDATED',
          method: req.method,
          endpoint: req.originalUrl,
          target_resource: 'event',
          status_code: 200,
          ip_address: req.ip,
          user_agent: req.get('user-agent') || null,
          metadata: {
            event_id: updatedEvent._id,
            event_title: updatedEvent.title,
            changes: changes
          }
        });
      }

      // Notify admins and participants about event update
      try {
        const participantIds = updatedEvent.participants?.map(p => p._id || p) || [];
        await NotificationService.notifyEventUpdated(
          updatedEvent._id,
          updatedEvent.title,
          participantIds
        );
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }

      res.status(200).json({
        message: 'Event updated successfully',
        event: {
          event_id: updatedEvent._id,
          title: updatedEvent.title,
          description: updatedEvent.description,
          category: updatedEvent.category,
          venue: updatedEvent.venue,
          max_participants: updatedEvent.max_participants,
          participant_count: updatedEvent.participants?.length || 0,
          status: updatedEvent.status,
          start_datetime: updatedEvent.start_datetime,
          end_datetime: updatedEvent.end_datetime
        }
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = [error.errors[key].message];
        });
        return res.status(400).json({ message: 'Validation error', errors });
      }
      if (error.message === 'Event not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Remove the specified event
   */
  static async destroy(req, res, next) {
    try {
      const { id } = req.params;

      // Get event details before deletion to log and notify
      const Event = require('../models/Event');
      const eventToDelete = await Event.findById(id).select('title participants');

      if (eventToDelete) {
        await ActivityLogService.logActivity({
          user: req.user,
          action: 'EVENT_DELETED',
          method: req.method,
          endpoint: req.originalUrl,
          target_resource: 'event',
          status_code: 200,
          ip_address: req.ip,
          user_agent: req.get('user-agent') || null,
          metadata: {
            event_id: id,
            event_title: eventToDelete.title
          }
        });
      }

      await EventService.delete(id);

      // Notify participants about cancellation
      if (eventToDelete) {
        try {
          const participantIds = eventToDelete.participants?.map(p => p._id || p) || [];
          if (participantIds.length > 0) {
            await NotificationService.notifyEventCancellation(
              participantIds,
              eventToDelete._id,
              eventToDelete.title
            );
          }
        } catch (notificationError) {
          console.error('Notification error:', notificationError);
        }
      }

      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      if (error.message === 'Event not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Register a student to an event
   */
  static async register(req, res, next) {
    try {
      const { id } = req.params;
      let { user_id } = req.body;

      // If the authenticated user is a student, force user_id to be their own ID
      if (req.user.role === 'student') {
        user_id = req.user._id;
      }

      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required.' });
      }

      const event = await EventService.registerParticipant(id, user_id);

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'EVENT_REGISTERED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'event',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          event_id: event._id,
          event_title: event.title,
          student_user_id: user_id
        }
      });

      // Send notification to student
      try {
        await NotificationService.notifyEventRegistration(user_id, event._id, event.title);
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }

      // Notify admins about student registration
      try {
        const User = require('../models/User');
        const student = await User.findById(user_id).select('firstname lastname');
        if (student) {
          await NotificationService.notifyAdminStudentRegistered(
            user_id,
            event._id,
            event.title,
            `${student.firstname} ${student.lastname}`
          );
        }
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }

      res.status(200).json({
        message: 'Student registered successfully.',
        participant_count: event.participants.length,
        participants: event.participants
      });
    } catch (error) {
      if (error.message.includes('already registered') || error.message.includes('maximum capacity')) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === 'Event not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Unregister a student from an event
   */
  static async unregister(req, res, next) {
    try {
      const { id } = req.params;
      let { user_id } = req.body;

      if (req.user.role === 'student') {
        user_id = req.user._id;
      }

      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required.' });
      }

      const event = await EventService.unregisterParticipant(id, user_id);

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'EVENT_UNREGISTERED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'event',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          event_id: event._id,
          event_title: event.title,
          student_user_id: user_id
        }
      });

      // Send notification to student
      try {
        await NotificationService.notifyEventUnregistration(user_id, event._id, event.title);
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }

      // Notify admins about student unregistration
      try {
        const User = require('../models/User');
        const student = await User.findById(user_id).select('firstname lastname');
        if (student) {
          await NotificationService.notifyAdminStudentUnregistered(
            user_id,
            event._id,
            event.title,
            `${student.firstname} ${student.lastname}`
          );
        }
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }

      res.status(200).json({
        message: 'Student unregistered successfully.',
        participant_count: event.participants.length,
        participants: event.participants
      });
    } catch (error) {
      if (error.message.includes('not registered')) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === 'Event not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Get all curricular events for a specific student
   */
  static async getStudentCurricularEvents(req, res, next) {
    try {
      const { userId } = req.params;
      const events = await EventService.getCurricularEventsByUserId(userId);

      const transformedEvents = events.map(event => ({
        event_id: event._id,
        title: event.title,
        category: event.category,
        start_datetime: event.start_datetime,
        status: event.status
      }));

      res.status(200).json({
        events: transformedEvents
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all events for a specific student
   */
  static async getStudentEvents(req, res, next) {
    try {
      const { userId } = req.params;
      const events = await EventService.getEventsByUserId(userId);

      const transformedEvents = events.map(event => ({
        event_id: event._id,
        title: event.title,
        category: event.category,
        start_datetime: event.start_datetime,
        status: event.status
      }));

      res.status(200).json({
        events: transformedEvents
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Invite a student to an event
   */
  static async invite(req, res, next) {
    try {
      const { id } = req.params;
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required.' });
      }

      const event = await EventService.inviteParticipant(id, user_id);

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'EVENT_INVITED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'event',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          event_id: event._id,
          event_title: event.title,
          invited_user_id: user_id
        }
      });

      // Notify student
      try {
        await NotificationService.notifyEventInvitation(user_id, event._id, event.title);
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }

      res.status(200).json({
        message: 'Invitation sent successfully.',
        invitations: event.invitations
      });
    } catch (error) {
      if (error.message.includes('already a participant') || error.message.includes('pending invitation')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Respond to an event invitation
   */
  static async respondInvitation(req, res, next) {
    try {
      const { id } = req.params;
      const { response } = req.body; // 'accepted' or 'declined'
      const user_id = req.user._id;

      const event = await EventService.respondToInvitation(id, user_id, response);

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'EVENT_INVITATION_RESPONDED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'event',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          event_id: event._id,
          event_title: event.title,
          response: response
        }
      });

      // Notify admin if accepted
      if (response === 'accepted') {
        try {
          const studentName = `${req.user.firstname} ${req.user.lastname}`;
          await NotificationService.notifyAdminStudentRegistered(
            user_id,
            event._id,
            event.title,
            studentName
          );
        } catch (notificationError) {
          console.error('Notification error:', notificationError);
        }
      }

      res.status(200).json({
        message: `Invitation ${response} successfully.`,
        event: {
          event_id: event._id,
          participants: event.participants,
          invitations: event.invitations
        }
      });
    } catch (error) {
      if (error.message.includes('No invitation found') || error.message.includes('capacity')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Get all invitations for the authenticated student
   */
  static async getStudentInvitations(req, res, next) {
    try {
      const userId = req.user._id;
      const events = await EventService.getInvitationsByUserId(userId);

      const transformedEvents = events.map(event => ({
        event_id: event._id,
        title: event.title,
        description: event.description,
        category: event.category,
        venue: event.venue,
        start_datetime: event.start_datetime,
        end_datetime: event.end_datetime,
        status: event.status
      }));

      res.status(200).json({
        invitations: transformedEvents
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EventController;