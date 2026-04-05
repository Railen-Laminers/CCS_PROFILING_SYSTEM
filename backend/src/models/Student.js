const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  parent_guardian_name: {
    type: String,
    trim: true,
    default: null
  },
  emergency_contact: {
    type: String,
    trim: true,
    default: null
  },
  section: {
    type: String,
    trim: true,
    default: null
  },
  program: {
    type: String,
    trim: true,
    default: null
  },
  year_level: {
    type: Number,
    default: null
  },
  gpa: {
    type: Number,
    min: [0, 'GPA cannot be less than 0'],
    max: [5, 'GPA cannot be more than 5'],
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
    type: [String],
    default: []
  },
  programming_contests: {
    type: [String],
    default: []
  },
  blood_type: {
    type: String,
    trim: true,
    default: null
  },
  disabilities: {
    type: [String],
    default: []
  },
  medical_condition: {
    type: String,
    trim: true,
    default: null
  },
  allergies: {
    type: [String],
    default: []
  },
  sports_activities: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  organizations: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  behavior_discipline_records: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      warnings: 0,
      suspensions: 0,
      counseling: 0,
      incidents: '',
      counselingRecords: ''
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
studentSchema.index({ program: 1 });
studentSchema.index({ year_level: 1 });
studentSchema.index({ section: 1 });

// Virtual for academic records
studentSchema.virtual('academicRecords', {
  ref: 'AcademicRecord',
  localField: '_id',
  foreignField: 'student_id'
});

// Method to search students
studentSchema.statics.search = function(searchTerm) {
  return this.find().populate({
    path: 'user_id',
    match: {
      $or: [
        { firstname: { $regex: searchTerm, $options: 'i' } },
        { lastname: { $regex: searchTerm, $options: 'i' } },
        { user_id: { $regex: searchTerm, $options: 'i' } }
      ]
    }
  });
};

// Method to filter by program
studentSchema.statics.filterByProgram = function(program) {
  return this.find({ program });
};

// Method to filter by year level
studentSchema.statics.filterByYearLevel = function(yearLevel) {
  return this.find({ year_level: yearLevel });
};

// Method to filter by GPA range
studentSchema.statics.filterByGpaRange = function(min, max) {
  const query = {};
  if (min !== null && min !== undefined) {
    query.gpa = { $gte: min };
  }
  if (max !== null && max !== undefined) {
    query.gpa = { ...query.gpa, $lte: max };
  }
  return this.find(query);
};

// Method to filter by sports
studentSchema.statics.filterBySports = function(sports) {
  return this.find({
    'sports_activities.sportsPlayed': { $in: sports }
  });
};

// Method to filter by organizations
studentSchema.statics.filterByOrganizations = function(orgs) {
  return this.find({
    'organizations.clubs': { $in: orgs }
  });
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
