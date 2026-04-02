const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  units: {
    type: Number,
    required: [true, 'Units are required']
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
  },
  year_level: {
    type: Number,
    min: 1,
    max: 4,
    required: [true, 'Year level is required']
  },
  semester: {
    type: Number,
    min: 1,
    max: 2,
    required: [true, 'Semester is required']
  },
  description: {
    type: String,
    trim: true
  },
  syllabus: {
    type: String, 
    trim: true
  },
  syllabus_file: {
    type: String, 
    trim: true
  },
  program: {
    type: String,
    enum: ['BSIT', 'BSCS'],
    required: [true, 'Program is required'],
    default: 'BSIT'
  }
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
