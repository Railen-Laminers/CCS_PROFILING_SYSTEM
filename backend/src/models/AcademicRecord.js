const mongoose = require('mongoose');

const academicRecordSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required']
  },
  course_name: {
    type: String,
    trim: true,
    default: null
  },
  year_level: {
    type: String,
    trim: true,
    default: null
  },
  semester: {
    type: String,
    trim: true,
    default: null
  },
  gpa: {
    type: mongoose.Schema.Types.Decimal128,
    default: null
  },
  current_subjects: {
    type: [String],
    default: []
  },
  academic_awards: {
    type: [String],
    default: []
  },
  quiz_bee_participations: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  programming_contests: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  }
}, {
  timestamps: true
});

// Index for student_id
academicRecordSchema.index({ student_id: 1 });

const AcademicRecord = mongoose.model('AcademicRecord', academicRecordSchema);

module.exports = AcademicRecord;
