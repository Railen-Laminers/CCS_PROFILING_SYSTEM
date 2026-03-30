const Event = require('../models/Event');

class EventService {
  /**
   * Get all events
   */
  static async getAll() {
    return await Event.find().select('_id title description start_datetime end_datetime');
  }

  /**
   * Find an event by ID or title (partial match)
   */
  static async findByIdentifier(search) {
    // Check if search is a valid ObjectId
    if (search.match(/^[0-9a-fA-F]{24}$/)) {
      const event = await Event.findById(search).select('_id title description start_datetime end_datetime');
      if (event) return event;
    }

    // Search by title (partial match)
    const event = await Event.findOne({
      title: { $regex: search, $options: 'i' }
    }).select('_id title description start_datetime end_datetime');

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  /**
   * Create a new event
   */
  static async create(data) {
    return await Event.create({
      title: data.title,
      description: data.description,
      start_datetime: data.start_datetime,
      end_datetime: data.end_datetime
    });
  }

  /**
   * Update an existing event
   */
  static async update(id, data) {
    const event = await Event.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }

    Object.assign(event, data);
    await event.save();
    return event;
  }

  /**
   * Delete an event
   */
  static async delete(id) {
    const event = await Event.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }

    await event.deleteOne();
  }
}

module.exports = EventService;
