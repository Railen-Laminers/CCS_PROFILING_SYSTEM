const EventService = require('../services/EventService');
const NotificationService = require('../services/NotificationService');

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
   * Update the specified event
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const event = await EventService.update(id, req.body);

      // Notify admins and participants about event update
      try {
        const participantIds = event.participants?.map(p => p._id || p) || [];
        await NotificationService.notifyEventUpdated(
          event._id,
          event.title,
          participantIds
        );
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }

      res.status(200).json({
        message: 'Event updated successfully',
        event: {
          event_id: event._id,
          title: event.title,
          description: event.description,
          category: event.category,
          venue: event.venue,
          max_participants: event.max_participants,
          participant_count: event.participants?.length || 0,
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
      
      // Get event details before deletion to notify participants
      const Event = require('../models/Event');
      const eventToDelete = await Event.findById(id).select('title participants');
      
      await EventService.delete(id);
      
      // Notify participants about event cancellation
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
}

module.exports = EventController;