const mongoose = require('mongoose');

const lessonPlanSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class ID is required']
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
  }
}, {
  timestamps: true
});

const LessonPlan = mongoose.model('LessonPlan', lessonPlanSchema);

module.exports = LessonPlan;
