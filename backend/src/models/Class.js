const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: [true, 'Faculty ID is required']
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true
  },
  schedule: {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room is required']
  },
  students_count: {
    type: Number,
    default: 0
  },
  series_id: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
