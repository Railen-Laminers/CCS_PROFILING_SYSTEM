const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: null
  },
  category: {
    type: String,
    enum: ['Curricular', 'Extra-Curricular'],
    default: 'Extra-Curricular'
  },
  venue: {
    type: String,
    trim: true,
    default: null
  },
  max_participants: {
    type: Number,
    default: null // null = unlimited
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  start_datetime: {
    type: Date,
    required: [true, 'Start datetime is required']
  },
  end_datetime: {
    type: Date,
    required: [true, 'End datetime is required']
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
