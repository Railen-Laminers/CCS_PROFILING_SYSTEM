const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  department: {
    type: String,
    trim: true,
    default: null
  },
  position: {
    type: String,
    trim: true,
    default: null
  },
  specialization: {
    type: String,
    trim: true,
    default: null
  },
  subjects_handled: {
    type: [String],
    default: []
  },
  teaching_schedule: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  research_projects: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  }
}, {
  timestamps: true
});

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
