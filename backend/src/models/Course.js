const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  credits: {
    type: Number,
    required: [true, 'Credits are required']
  },
  course_code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    trim: true
  },
  course_title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  }
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
