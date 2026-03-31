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
  schedule: {
    type: String,
    required: [true, 'Schedule is required'],
    trim: true
  },
  room: {
    type: String,
    required: [true, 'Room is required'],
    trim: true
  },
  students_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
