const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  middlename: {
    type: String,
    trim: true,
    default: null
  },
  lastname: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  user_id: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'faculty'],
    required: [true, 'Role is required']
  },
  birth_date: {
    type: Date,
    default: null
  },
  contact_number: {
    type: String,
    trim: true,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: null
  },
  address: {
    type: String,
    trim: true,
    default: null
  },
  profile_picture: {
    type: String,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  },
  last_login_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for student profile
userSchema.virtual('student', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'user_id',
  justOne: true
});

// Virtual for faculty profile
userSchema.virtual('faculty', {
  ref: 'Faculty',
  localField: '_id',
  foreignField: 'user_id',
  justOne: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user with profile
userSchema.methods.toJSONWithProfile = async function() {
  const user = this.toObject();
  delete user.password;
  
  if (this.role === 'student') {
    await this.populate('student');
    user.student = this.student;
  } else if (this.role === 'faculty') {
    await this.populate('faculty');
    user.faculty = this.faculty;
  }
  
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
