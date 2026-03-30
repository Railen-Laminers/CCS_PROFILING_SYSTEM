const EventService = require('../services/EventService');

class EventController {
  /**
   * Display a listing of all events
   */
  static async index(req, res, next) {
    try {
      const events = await EventService.getAll();

      res.status(200).json({
        events
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
        event
      });
    } catch (error) {
      if (error.message === 'Event not found') {
        return res.status(404).json({
          message: error.message
        });
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
          start_datetime: event.start_datetime,
          end_datetime: event.end_datetime
        }
      });
    } catch (error) {
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
          start_datetime: event.start_datetime,
          end_datetime: event.end_datetime
        }
      });
    } catch (error) {
      if (error.message === 'Event not found') {
        return res.status(404).json({
          message: error.message
        });
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

      res.status(200).json({
        message: 'Event deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Event not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = EventController;
