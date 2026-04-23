const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const AcademicRecord = require('../models/AcademicRecord');
const Class = require('../models/Class');

class UserService {
  /**
   * Common user fields used for response formatting
   */
  static USER_FIELDS = [
    'id', 'firstname', 'middlename', 'lastname', 'user_id',
    'email', 'role', 'birth_date', 'contact_number', 'gender',
    'address', 'profile_picture', 'is_active', 'last_login_at'
  ];

  /**
   * User fields without last_login_at (used for create/update responses)
   */
  static USER_FIELDS_SHORT = [
    'id', 'firstname', 'middlename', 'lastname', 'user_id',
    'email', 'role', 'birth_date', 'contact_number', 'gender',
    'address', 'profile_picture', 'is_active'
  ];

  /**
   * Student-specific fields for mass operations
   */
  static STUDENT_FIELDS = [
    'parent_guardian_name', 'emergency_contact', 'section', 'program',
    'year_level', 'gpa', 'academic_awards',
    'quiz_bee_participations', 'programming_contests',
    'blood_type', 'disabilities',
    'medical_condition', 'allergies', 'sports_activities',
    'organizations', 'behavior_discipline_records'
  ];

  /**
   * Faculty-specific fields for mass operations
   */
  static FACULTY_FIELDS = [
    'department', 'position', 'specialization', 'subjects_handled',
    'teaching_schedule', 'research_projects'
  ];

  /**
   * Get all users with their role-specific profiles formatted for response
   */
  static async getAllUsers() {
    const users = await User.find().populate('student').populate('faculty');
    const usersWithPopulatedSubjects = await this._populateStudentSubjects(users);

    return usersWithPopulatedSubjects.map(user => {
      const userData = {};
      this.USER_FIELDS.forEach(field => {
        userData[field] = user[field];
      });

      if (user.role === 'student') {
        userData.student = user.student;
      } else if (user.role === 'faculty') {
        userData.faculty = user.faculty;
      }

      return userData;
    });
  }

  /**
   * Helper to populate current_subjects from Class schedule
   */
  static async _populateStudentSubjects(usersOrUser) {
    const isArray = Array.isArray(usersOrUser);
    const users = isArray ? usersOrUser : [usersOrUser];
    
    // Filter out students with sections
    const students = users
      .filter(u => u.role === 'student' && u.student && u.student.section)
      .map(u => u.student);
    
    if (students.length === 0) return usersOrUser;

    const sections = [...new Set(students.map(s => s.section))];
    const classes = await Class.find({ section: { $in: sections } }).populate('course_id');
    
    const sectionToSubjects = {};
    classes.forEach(c => {
      if (c.course_id && c.course_id.course_title) {
        if (!sectionToSubjects[c.section]) sectionToSubjects[c.section] = new Set();
        sectionToSubjects[c.section].add(c.course_id.course_title);
      }
    });

    students.forEach(s => {
      if (sectionToSubjects[s.section]) {
        s.current_subjects = Array.from(sectionToSubjects[s.section]);
      } else {
        s.current_subjects = [];
      }
    });

    return usersOrUser;
  }

  /**
   * Get all students with their profiles
   */
  static async getAllStudents() {
    const users = await User.find({ role: 'student' }).populate('student');
    await this._populateStudentSubjects(users);

    return users.map(user => {
      const userData = {};
      this.USER_FIELDS.forEach(field => {
        userData[field] = user[field];
      });

      return {
        user: userData,
        student: user.student
      };
    });
  }

  /**
   * Get all faculty with their profiles
   */
  static async getAllFaculty() {
    const users = await User.find({ role: 'faculty' }).populate('faculty');

    return users.map(user => {
      const userData = {};
      this.USER_FIELDS.forEach(field => {
        userData[field] = user[field];
      });

      return {
        user: userData,
        faculty: user.faculty
      };
    });
  }

  /**
   * Find a user by ID or user_id with their profile
   */
  static async findByIdentifier(identifier) {
    const user = await User.findOne({
      $or: [
        { _id: identifier },
        { user_id: identifier }
      ]
    }).populate('student').populate('faculty');

    if (!user) {
      throw new Error('User not found');
    }

    await this._populateStudentSubjects(user);

    const userData = {};
    this.USER_FIELDS.forEach(field => {
      userData[field] = user[field];
    });

    if (user.role === 'student') {
      userData.student = user.student;
    } else if (user.role === 'faculty') {
      userData.faculty = user.faculty;
    }

    return userData;
  }

  /**
   * Create a new user with their role-specific profile
   */
  static async createUser(data) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(data.password, salt); <======================Tinanggal kasi nagdodouble hashed

    // Create user
    const user = await User.create({
      firstname: data.firstname,
      middlename: data.middlename || null,
      lastname: data.lastname,
      user_id: data.user_id,
      email: data.email,
      password: data.password,
      role: data.role,
      birth_date: data.birth_date || null,
      contact_number: data.contact_number || null,
      gender: data.gender || null,
      address: data.address || null,
      profile_picture: data.profile_picture || null,
      is_active: data.is_active !== undefined ? data.is_active : true
    });

    const response = {
      message: `${data.role.charAt(0).toUpperCase() + data.role.slice(1)} created successfully`,
      user: {}
    };

    this.USER_FIELDS_SHORT.forEach(field => {
      response.user[field] = user[field];
    });

    // Create role-specific profile
    if (data.role === 'student') {
      const studentData = { user_id: user._id };
      this.STUDENT_FIELDS.forEach(field => {
        studentData[field] = data[field] || null;
      });

      const studentProfile = await Student.create(studentData);
      
      // Populate dynamic subjects for response
      const populatedUser = await this._populateStudentSubjects({ role: 'student', student: studentProfile });
      response.student = populatedUser.student;

      // Create initial academic record for history tracking
      await AcademicRecord.create({
        student_id: studentProfile._id,
        course_name: data.program || null,
        year_level: data.year_level || null,
        semester: 'First Semester',
        gpa: data.gpa || null,
        current_subjects: studentProfile.current_subjects || [],
        academic_awards: data.academic_awards || [],
        quiz_bee_participations: data.quiz_bee_participations || [],
        programming_contests: data.programming_contests || []
      });
    } else {
      const facultyData = { user_id: user._id };
      this.FACULTY_FIELDS.forEach(field => {
        facultyData[field] = data[field] || null;
      });
      response.faculty = await Faculty.create(facultyData);
    }

    return response;
  }

  /**
   * Update an existing user and their role-specific profile
   */
  static async updateUser(identifier, userData, profileData) {
    const user = await User.findOne({
      $or: [
        { _id: identifier },
        { user_id: identifier }
      ]
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Hash password if provided
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    // Update user
    Object.assign(user, userData);
    await user.save();

    // Update profile
    let profile = null;
    if (user.role === 'student') {
      const student = await Student.findOne({ user_id: user._id });
      if (student) {
        Object.assign(student, profileData);
        await student.save();
        profile = student;

        // Populate dynamic subjects for response
        await this._populateStudentSubjects({ role: 'student', student: student });
        profile = student;

        // Sync with the most recent academic record to maintain consistency
        const academicFields = [
          'gpa', 'current_subjects', 'academic_awards', 
          'quiz_bee_participations', 'programming_contests',
          'program', 'year_level'
        ];
        const hasAcademicUpdates = academicFields.some(field => profileData[field] !== undefined) || profileData.section !== undefined;

        if (hasAcademicUpdates) {
          const latestRecord = await AcademicRecord.findOne({ student_id: student._id }).sort({ createdAt: -1 });
          if (latestRecord) {
            if (profileData.gpa !== undefined) latestRecord.gpa = profileData.gpa;
            latestRecord.current_subjects = student.current_subjects; // Always sync with student's current subjects
            if (profileData.academic_awards !== undefined) latestRecord.academic_awards = profileData.academic_awards;
            if (profileData.quiz_bee_participations !== undefined) latestRecord.quiz_bee_participations = profileData.quiz_bee_participations;
            if (profileData.programming_contests !== undefined) latestRecord.programming_contests = profileData.programming_contests;
            if (profileData.program !== undefined) latestRecord.course_name = profileData.program;
            if (profileData.year_level !== undefined) latestRecord.year_level = profileData.year_level;
            await latestRecord.save();
          }
        }
      }
    } else if (user.role === 'faculty') {
      const faculty = await Faculty.findOne({ user_id: user._id });
      if (faculty) {
        Object.assign(faculty, profileData);
        await faculty.save();
        profile = faculty;
      }
    }

    const response = {
      message: 'User updated successfully',
      user: {}
    };

    this.USER_FIELDS_SHORT.forEach(field => {
      response.user[field] = user[field];
    });

    if (user.role === 'student') {
      response.student = profile;
    } else if (user.role === 'faculty') {
      response.faculty = profile;
    }

    return response;
  }

  /**
   * Delete a user (must be inactive and not the current admin)
   */
  static async deleteUser(identifier, currentUserId) {
    const user = await User.findOne({
      $or: [
        { _id: identifier },
        { user_id: identifier }
      ]
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user._id.toString() === currentUserId) {
      throw new Error('You cannot delete your own account.');
    }

    if (user.is_active && user.role === 'student') {
      throw new Error('User must be deactivated before deletion.');
    }

    if (user.role === 'student') {
      await Student.deleteOne({ user_id: user._id });
    } else if (user.role === 'faculty') {
      await Faculty.deleteOne({ user_id: user._id });
    }

    await user.deleteOne();
  }

  // static async importStudentsFromExcel(file) {
  //   const XLSX = require('xlsx');

  //   // Read the Excel file
  //   const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  //   const sheetName = workbook.SheetNames[0];
  //   const worksheet = workbook.Sheets[sheetName];
  //   const data = XLSX.utils.sheet_to_json(worksheet);

  //   let importedCount = 0;
  //   const errors = [];

  //   // Process each row
  //   for (const row of data) {
  //     try {
  //       // Map Excel columns to your data structure
  //       const studentData = {
  //         firstname: row['First Name'] || row['firstname'],
  //         lastname: row['Last Name'] || row['lastname'],
  //         middlename: row['Middle Name'] || row['middlename'] || '',
  //         email: row['Email'] || row['email'],
  //         user_id: row['Student ID'] || row['user_id'] || this.generateStudentId(),
  //         role: 'student',
  //         password: row['Password'] || row['password'] || 'password', // You might want to generate or use a default
  //         birth_date: row['Birth Date'] || row['birth_date'] || null,
  //         contact_number: row['Contact Number'] || row['contact_number'] || null,
  //         gender: row['Gender'] || row['gender'] || null,
  //         address: row['Address'] || row['address'] || null,
  //         program: row['Program'] || row['program'] || null,
  //         year_level: row['Year Level'] || row['year_level'] || null,
  //         section: row['Section'] || row['section'] || null,
  //         gpa: row['GPA'] || row['gpa'] || null,
  //         blood_type: row['Blood Type'] || row['blood_type'] || null,
  //         is_active: true
  //       };

  //       // Create the user
  //       await this.createUser(studentData);
  //       importedCount++;
  //     } catch (error) {
  //       errors.push({
  //         row: row,
  //         error: error.message
  //       });
  //       console.error(`Failed to import student: ${error.message}`);
  //     }
  //   }

  //   return { importedCount, errors };
  // }

  // // Helper method to generate student ID if not provided
  // static generateStudentId() {
  //   const year = new Date().getFullYear();
  //   const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  //   return `STU-${year}-${random}`;
  // }

  // ADD THIS METHOD to UserService.js - Replace your existing importStudentsFromExcel
  static async importStudentsFromExcel(file) {
    const XLSX = require('xlsx');

    // Read the Excel file
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let importedCount = 0;
    const errors = [];

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      try {
        // MODIFIED: Map Excel columns to match exactly what createUser expects
        const studentData = {
          // Required fields for user creation
          firstname: row['First Name'] || row['firstname'],
          lastname: row['Last Name'] || row['lastname'],
          middlename: row['Middle Name'] || row['middlename'] || '',
          email: row['Email'] || row['email'],
          user_id: row['Student ID'] || row['user_id'] || this.generateStudentId(),
          role: 'student',
          password: row['Password'] || row['password'] || 'defaultpassword123', // Default password if not provided

          // Optional user fields
          birth_date: row['Birth Date'] || row['birth_date'] || null,
          contact_number: row['Contact Number'] || row['contact_number'] || null,
          gender: row['Gender'] || row['gender'] || null,
          address: row['Address'] || row['address'] || null,

          // Student-specific fields (these will be passed to student profile)
          program: row['Program'] || row['program'] || null,
          year_level: row['Year Level'] || row['year_level'] || null,
          section: row['Section'] || row['section'] || null,
          gpa: row['GPA'] || row['gpa'] || null,
          blood_type: row['Blood Type'] || row['blood_type'] || null,

          // MODIFIED: Add these to avoid null errors in student profile creation
          parent_guardian_name: row['Parent/Guardian Name'] || row['parent_guardian_name'] || '',
          emergency_contact: row['Emergency Contact'] || row['emergency_contact'] || '',
          disabilities: row['Disabilities'] || row['disabilities'] || '',
          medical_condition: row['Medical Condition'] || row['medical_condition'] || '',
          allergies: row['Allergies'] || row['allergies'] || '',

          // MODIFIED: Initialize empty arrays for fields that expect arrays
          sports_activities: [],
          organizations: [],
          behavior_discipline_records: [],
          current_subjects: [],
          academic_awards: [],
          events_participated: [],
          quiz_bee_participations: [],
          programming_contests: [],

          is_active: true
        };

        // ADDED: Log what we're about to create
        console.log(`Processing row ${i + 1}: ${studentData.firstname} ${studentData.lastname} (${studentData.email})`);

        // Create the user using your existing createUser method
        const result = await this.createUser(studentData);

        // ADDED: Check if student profile was created
        if (result.student) {
          importedCount++;
          console.log(`✓ Successfully imported student ${i + 1}: ${studentData.firstname} ${studentData.lastname}`);
        } else {
          // This shouldn't happen if createUser works properly
          throw new Error('Student profile was not created');
        }

      } catch (error) {
        // ADDED: Better error logging
        console.error(`✗ Failed to import row ${i + 1}:`, error.message);
        console.error('Row data:', row);

        errors.push({
          rowNumber: i + 1,
          row: row,
          error: error.message
        });
      }
    }

    console.log(`Import completed: ${importedCount} successful, ${errors.length} failed`);
    return { importedCount, errors };
  }

  // Helper method to generate student ID if not provided (KEEP THIS AS IS)
  static generateStudentId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `STU-${year}-${random}`;
  }
}

module.exports = UserService;
