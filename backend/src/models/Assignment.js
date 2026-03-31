const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class ID is required']
  },
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  due_date: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'upcoming'],
    default: 'open'
  }
}, {
  timestamps: true
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
