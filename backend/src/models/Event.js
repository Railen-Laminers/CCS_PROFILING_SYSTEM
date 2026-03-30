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
