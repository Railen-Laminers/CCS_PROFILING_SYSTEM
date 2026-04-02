const mongoose = require('mongoose');

const lessonPlanSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: false
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Lesson date is required']
  },
  attached_file: {
    type: String, // URL/Path to the uploaded file
    trim: true
  }
}, {
  timestamps: true
});

const LessonPlan = mongoose.model('LessonPlan', lessonPlanSchema);

module.exports = LessonPlan;
