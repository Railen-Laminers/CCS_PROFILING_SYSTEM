const Event = require('../models/Event');

class EventService {
  /**
   * Get all events with participant count
   */
  static async getAll() {
    return await Event.find()
      .populate('participants', 'firstname lastname email')
      .populate('invitations.user', 'firstname lastname email')
      .sort({ start_datetime: -1 });
  }

  /**
   * Find an event by ID or title (partial match)
   */
  static async findByIdentifier(search) {
    if (search.match(/^[0-9a-fA-F]{24}$/)) {
      const event = await Event.findById(search)
        .populate('participants', 'firstname lastname email')
        .populate('invitations.user', 'firstname lastname email');
      if (event) return event;
    }

    const event = await Event.findOne({
      title: { $regex: search, $options: 'i' }
    })
    .populate('participants', 'firstname lastname email')
    .populate('invitations.user', 'firstname lastname email');

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
      category: data.category || 'Extra-Curricular',
      venue: data.venue || null,
      max_participants: data.max_participants || null,
      status: data.status || 'Upcoming',
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

    // Only update allowed fields
    const allowedFields = ['title', 'description', 'category', 'venue', 'max_participants', 'status', 'start_datetime', 'end_datetime'];
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        event[field] = data[field];
      }
    });

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

  /**
   * Register a student (user) to an event
   */
  static async registerParticipant(eventId, userId) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if already registered
    if (event.participants.includes(userId)) {
      throw new Error('Student is already registered for this event.');
    }

    // Check max participant cap
    if (event.max_participants !== null && event.participants.length >= event.max_participants) {
      throw new Error(`This event has reached its maximum capacity of ${event.max_participants} participants.`);
    }

    event.participants.push(userId);
    await event.save();
    
    return await Event.findById(eventId)
      .populate('participants', 'firstname lastname email');
  }

  /**
   * Unregister a student (user) from an event
   */
  static async unregisterParticipant(eventId, userId) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const index = event.participants.indexOf(userId);
    if (index === -1) {
      throw new Error('Student is not registered for this event.');
    }

    event.participants.splice(index, 1);
    await event.save();

    return await Event.findById(eventId)
      .populate('participants', 'firstname lastname email');
  }

  /**
   * Get all curricular events for a specific student (by user document _id)
   */
  static async getCurricularEventsByUserId(userId) {
    return await Event.find({
      participants: userId,
      category: 'Curricular'
    })
    .sort({ start_datetime: -1 });
  }

  /**
   * Get all event participations for a specific student (by user document _id)
   */
  static async getEventsByUserId(userId) {
    return await Event.find({
      participants: userId
    })
    .sort({ start_datetime: -1 });
  }

  /**
   * Invite a student to an event
   */
  static async inviteParticipant(eventId, userId) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    // Check if already a participant
    if (event.participants.includes(userId)) {
      throw new Error('Student is already a participant in this event.');
    }

    // Check if already invited
    const existingInvitation = event.invitations.find(inv => inv.user.toString() === userId.toString());
    if (existingInvitation) {
      if (existingInvitation.status === 'pending') {
        throw new Error('Student already has a pending invitation.');
      } else {
        // Resend if declined
        existingInvitation.status = 'pending';
        existingInvitation.invited_at = Date.now();
      }
    } else {
      event.invitations.push({ user: userId, status: 'pending' });
    }

    await event.save();
    return await Event.findById(eventId)
      .populate('participants', 'firstname lastname email')
      .populate('invitations.user', 'firstname lastname email');
  }

  /**
   * Respond to an event invitation
   */
  static async respondToInvitation(eventId, userId, response) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    const invitationIndex = event.invitations.findIndex(inv => inv.user.toString() === userId.toString());
    if (invitationIndex === -1) {
      throw new Error('No invitation found for this student.');
    }

    if (response === 'accepted') {
      // Check capacity
      if (event.max_participants !== null && event.participants.length >= event.max_participants) {
        throw new Error(`This event has reached its maximum capacity.`);
      }
      
      // Move from invitations to participants
      event.participants.push(userId);
      event.invitations.splice(invitationIndex, 1);
    } else if (response === 'declined') {
      event.invitations[invitationIndex].status = 'declined';
    } else {
      throw new Error('Invalid response. Must be "accepted" or "declined".');
    }

    await event.save();
    return await Event.findById(eventId)
      .populate('participants', 'firstname lastname email')
      .populate('invitations.user', 'firstname lastname email');
  }

  /**
   * Get all pending invitations for a student
   */
  static async getInvitationsByUserId(userId) {
    return await Event.find({
      'invitations.user': userId,
      'invitations.status': 'pending'
    })
    .sort({ start_datetime: 1 });
  }
}

module.exports = EventService;
