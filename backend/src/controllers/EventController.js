const EventService = require('../services/EventService');

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
      await EventService.delete(id);
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
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required.' });
      }

      const event = await EventService.registerParticipant(id, user_id);
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
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required.' });
      }

      const event = await EventService.unregisterParticipant(id, user_id);
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
