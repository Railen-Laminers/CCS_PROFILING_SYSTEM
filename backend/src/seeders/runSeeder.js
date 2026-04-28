const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Event = require('../models/Event');
const Class = require('../models/Class');
const LessonPlan = require('../models/LessonPlan');
const Material = require('../models/Material');
const Room = require('../models/Room');
const AcademicRecord = require('../models/AcademicRecord');
const SystemSettings = require('../models/SystemSettings');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    console.log('🧹 Clearing existing data...');
    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Course.deleteMany({});
    await Event.deleteMany({});
    await Class.deleteMany({});
    await LessonPlan.deleteMany({});
    await Material.deleteMany({});
    await Room.deleteMany({});
    await AcademicRecord.deleteMany({});
    await SystemSettings.deleteMany({});

    console.log('👤 Creating Admin User...');
    // Create Admin User
    const admin = await User.create({
      firstname: 'Admin',
      middlename: 'Test',
      lastname: 'User',
      user_id: '1234567',
      email: 'admin@gmail.com',
      password: 'password',
      role: 'admin',
      birth_date: '2000-01-01',
      contact_number: '09123456789',
      gender: 'male',
      address: 'Admin Address',
      is_active: true
    });

    console.log('⚙️ Initializing System Settings...');
    await SystemSettings.create({
      academicYear: '2023-2024',
      semester: '1st Semester',
      interfaceLanguage: 'English - North America'
    });

    // Create 1000 Students with details
    console.log('🌱 Generating 1000 student records...');

    // Helper functions for random data generation
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'Chris', 'Jessica', 'David', 'Sarah', 'James', 'Linda', 'Robert', 'Patricia', 'Charles', 'Jennifer', 'Joseph', 'Maria', 'Thomas', 'Susan', 'Daniel', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    const middleInitials = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const programs = ['BSIT', 'BSCS', 'BSIS'];
    const genders = ['male', 'female'];
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const sports = ['Basketball', 'Volleyball', 'Swimming', 'Chess', 'Badminton', 'Soccer', 'Table Tennis', 'Lawn Tennis'];
    const orgs = ['Google Developer Student Chapter', 'Tech Society', 'Student Council', 'Photography Club', 'Game Development Club', 'Red Cross Youth', 'Literary Guild'];
    const cities = ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig', 'Caloocan'];
    const streets = ['Mabini', 'Taft', 'Rizal', 'Aurora', 'Bonifacio', 'EDSA'];
    const allergies = ['Peanuts', 'Dust', 'Pollen', 'Shellfish', 'None'];
    const medicalConditions = ['Asthma', 'None', 'Hypertension', 'Migraine'];

    const studentUsersData = [];
    const currentYear = new Date().getFullYear();

    for (let i = 1; i <= 1000; i++) {
      const firstname = getRandomElement(firstNames);
      const lastname = getRandomElement(lastNames);
      const entryYear = currentYear - getRandomInt(0, 3); // For 1st to 4th year students
      const user_id = `${entryYear}${String(i).padStart(4, '0')}`;
      studentUsersData.push({
        firstname,
        middlename: getRandomElement(middleInitials) + '.',
        lastname,
        user_id,
        email: `${firstname.toLowerCase()}.${lastname.toLowerCase()}${i}@ccs.edu`,
        password: 'password',
        role: 'student',
        birth_date: `${getRandomInt(1998, 2005)}-${String(getRandomInt(1, 12)).padStart(2, '0')}-${String(getRandomInt(1, 28)).padStart(2, '0')}`,
        contact_number: `09${getRandomInt(100000000, 999999999)}`,
        gender: getRandomElement(genders),
        address: `${getRandomInt(1, 1000)} ${getRandomElement(streets)} Street, ${getRandomElement(cities)}`,
        is_active: Math.random() > 0.1 // 90% active
      });
    }

    console.log('🎓 Creating 1000 Student Users...');
    const createdStudentUsers = await User.create(studentUsersData);

    const studentProfiles = [];
    for (let i = 0; i < createdStudentUsers.length; i++) {
      const user = createdStudentUsers[i];
      const entryYear = parseInt(user.user_id.substring(0, 4));
      const year_level = Math.max(1, Math.min(4, currentYear - entryYear + 1));
      const program = getRandomElement(programs);
      const sectionLetter = getRandomElement(['A', 'B', 'C', 'D']);
      const section = `${program.replace('BS', '')}-${year_level}${sectionLetter}`;

      studentProfiles.push({
        user_id: user._id,
        parent_guardian_name: `${getRandomElement(firstNames)} ${user.lastname}`,
        emergency_contact: `09${getRandomInt(100000000, 999999999)}`,
        section,
        program,
        year_level,
        gpa: (Math.random() * (3.0) + 1.0).toFixed(2), // GPA between 1.0 and 4.0
        current_subjects: [],
        academic_awards: [],
        quiz_bee_participations: [],
        programming_contests: [],
        blood_type: getRandomElement(bloodTypes),
        disabilities: [],
        medical_condition: getRandomElement(medicalConditions),
        allergies: [getRandomElement(allergies)],
        sports_activities: { sportsPlayed: [getRandomElement(sports)], achievements: '' },
        organizations: { clubs: [getRandomElement(orgs)], positions: ['Member'] },
        behavior_discipline_records: { warnings: 0, suspensions: 0, counseling: 0, incidents: '', counselingRecords: '' }
      });
    }

    console.log('📝 Creating 1000 Student Profiles...');
    await Student.insertMany(studentProfiles);

    // Create Faculty Users
    const facultyUsersData = [
      {
        firstname: 'Dr. Elena',
        middlename: 'Perez',
        lastname: 'Villanueva',
        user_id: 'FACULTY001',
        email: 'elena.villanueva@ccs.edu',
        password: 'password',
        role: 'faculty',
        birth_date: '1985-03-12',
        contact_number: '09123456799',
        gender: 'female',
        address: '999 University Avenue, Manila',
        is_active: true
      },
      {
        firstname: 'Prof. Mark',
        middlename: 'Thomas',
        lastname: 'Angeles',
        user_id: 'FACULTY002',
        email: 'mark.angeles@ccs.edu',
        password: 'password',
        role: 'faculty',
        birth_date: '1988-07-22',
        contact_number: '09123456798',
        gender: 'male',
        address: '456 College Road, Manila',
        is_active: true
      },
      {
        firstname: 'Ms. Sarah',
        middlename: 'Jane',
        lastname: 'Castillo',
        user_id: 'FACULTY003',
        email: 'sarah.castillo@ccs.edu',
        password: 'password',
        role: 'faculty',
        birth_date: '1992-11-05',
        contact_number: '09123456797',
        gender: 'female',
        address: '789 Education Street, Quezon City',
        is_active: true
      },
      {
        firstname: 'Engr. James',
        middlename: 'Michael',
        lastname: 'Ramos',
        user_id: 'FACULTY004',
        email: 'james.ramos@ccs.edu',
        password: 'password',
        role: 'faculty',
        birth_date: '1990-04-18',
        contact_number: '09123456796',
        gender: 'male',
        address: '321 Science Avenue, Makati City',
        is_active: true
      },
      {
        firstname: 'Dr. Grace',
        middlename: 'Ann',
        lastname: 'Diaz',
        user_id: 'FACULTY005',
        email: 'grace.diaz@ccs.edu',
        password: 'password',
        role: 'faculty',
        birth_date: '1987-09-30',
        contact_number: '09123456795',
        gender: 'female',
        address: '654 Technology Lane, Mandaluyong City',
        is_active: true
      }
    ];

    const facultyProfiles = [
      {
        user_id: null, // To be filled
        department: 'College of Computer Studies',
        position: 'Associate Professor',
        specialization: 'Database Systems and Data Science',
        subjects_handled: ['IT 301 - Database Management Systems 1', 'IT 201 - Data Structures & Algorithms', 'CS 101 - Fundamental of Computing'],
        teaching_schedule: [
          { day: 'Monday', time: '08:00 - 10:00', room: 'Lab 101' },
          { day: 'Wednesday', time: '08:00 - 10:00', room: 'Lab 101' },
          { day: 'Friday', time: '10:00 - 12:00', room: 'Room 201' }
        ],
        research_projects: [
          { title: 'AI-Based Academic Performance Prediction System', year: 2024, status: 'Completed' },
          { title: 'Machine Learning Applications in Education', year: 2025, status: 'Ongoing' }
        ]
      },
      {
        user_id: null,
        department: 'College of Computer Studies',
        position: 'Assistant Professor',
        specialization: 'Web Development and Mobile Apps',
        subjects_handled: ['IT 205 - Web Development Fundamentals', 'IT 350 - Software Engineering', 'IT 405 - Integrative Programming'],
        teaching_schedule: [
          { day: 'Tuesday', time: '09:00 - 12:00', room: 'Lab 102' },
          { day: 'Thursday', time: '09:00 - 12:00', room: 'Lab 102' }
        ],
        research_projects: [
          { title: 'Progressive Web Applications', year: 2024, status: 'Completed' }
        ]
      },
      {
        user_id: null,
        department: 'College of Computer Studies',
        position: 'Instructor',
        specialization: 'Computer Programming',
        subjects_handled: ['IT 101 - Introduction to Computing', 'IT 102 - Computer Programming 1', 'IT 103 - Discrete Mathematics'],
        teaching_schedule: [
          { day: 'Monday', time: '13:00 - 16:00', room: 'Room 301' },
          { day: 'Wednesday', time: '13:00 - 16:00', room: 'Room 301' },
          { day: 'Friday', time: '08:00 - 11:00', room: 'Lab 103' }
        ],
        research_projects: []
      },
      {
        user_id: null,
        department: 'College of Computer Studies',
        position: 'Assistant Professor',
        specialization: 'Computer Networks and Security',
        subjects_handled: ['IT 401 - Computer Networks', 'IT 440 - Capstone Project 1', 'IT 450 - Information Security'],
        teaching_schedule: [
          { day: 'Tuesday', time: '14:00 - 17:00', room: 'Lab 104' },
          { day: 'Thursday', time: '14:00 - 17:00', room: 'Lab 104' }
        ],
        research_projects: [
          { title: 'Network Security Analysis', year: 2025, status: 'Ongoing' }
        ]
      },
      {
        user_id: null,
        department: 'College of Computer Studies',
        position: 'Associate Professor',
        specialization: 'Data Science and Analytics',
        subjects_handled: ['IT 301 - Database Management Systems 1', 'IT 355 - Data Science', 'IT 360 - Business Intelligence'],
        teaching_schedule: [
          { day: 'Monday', time: '10:00 - 13:00', room: 'Lab 105' },
          { day: 'Wednesday', time: '10:00 - 13:00', room: 'Lab 105' },
          { day: 'Friday', time: '14:00 - 17:00', room: 'Lab 105' }
        ],
        research_projects: [
          { title: 'Big Data Analytics in Education', year: 2024, status: 'Completed' },
          { title: 'Predictive Analytics for Student Success', year: 2025, status: 'Ongoing' }
        ]
      }
    ];

    // Create IT-related courses (Curriculum)
    const courseData = [
      { units: 3, course_code: 'IT 101', course_title: 'Introduction to Computing', year_level: 1, semester: 1, syllabus: 'Week 1: History of Computing\nWeek 2: Hardware Basics\nWeek 3: Operating Systems Overview' },
      { units: 3, course_code: 'IT 102', course_title: 'Computer Programming 1', year_level: 1, semester: 1, syllabus: 'Week 1: Visual Basic Environment\nWeek 2: Variables & Types\nWeek 3: Control Structures' },
      { units: 3, course_code: 'IT 103', course_title: 'Discrete Mathematics', year_level: 1, semester: 2, syllabus: 'Logic, Sets, Relations, Functions, and Boolean Algebra.' },
      { units: 3, course_code: 'IT 201', course_title: 'Data Structures & Algorithms', year_level: 2, semester: 1, syllabus: 'Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs.' },
      { units: 3, course_code: 'IT 205', course_title: 'Web Development Fundamentals', year_level: 2, semester: 1, syllabus: 'Week 1: HTML5 Semantics\nWeek 2: CSS Layouts flexbox/grid\nWeek 3: Client-side storage' },
      { units: 3, course_code: 'IT 301', course_title: 'Database Management Systems 1', year_level: 3, semester: 1, syllabus: 'Normalization, ER Diagrams, SQL Queries, and Transactions.' },
      { units: 3, course_code: 'IT 350', course_title: 'Software Engineering', year_level: 3, semester: 2, syllabus: 'Agile vs Waterfall, Requirements gathering, Modeling, Testing.' },
      { units: 4, course_code: 'IT 405', course_title: 'Integrative Programming', year_level: 4, semester: 1, syllabus: 'RESTful APIs, Microservices, Middleware, and Cloud Integration.' },
      { units: 3, course_code: 'IT 440', course_title: 'Capstone Project 1', year_level: 4, semester: 1, syllabus: 'Topic defense, Literature review, Methodology.' }
    ];

    console.log('👨‍🏫 Creating Faculty Users...');
    const createdFacultyUsers = await User.create(facultyUsersData);

    // Map user_ids to faculty profiles
    for (let i = 0; i < createdFacultyUsers.length; i++) {
      facultyProfiles[i].user_id = createdFacultyUsers[i]._id;
    }

    console.log('📋 Creating Faculty Profiles...');
    await Faculty.insertMany(facultyProfiles);

    console.log('📚 Creating Courses...');
    await Course.insertMany(courseData);

    console.log('📅 Creating Events...');
    await Event.create({
      title: 'Annual Tech Conference 2026',
      description: 'Join us for the biggest tech conference of the year featuring industry experts and networking opportunities.',
      start_datetime: '2026-05-15 09:00:00',
      end_datetime: '2026-05-17 18:00:00'
    });

    await Event.create({
      title: 'Web Development Workshop',
      description: 'Hands-on workshop covering modern web development frameworks and best practices.',
      start_datetime: '2026-03-25 10:00:00',
      end_datetime: '2026-03-25 17:00:00'
    });

    await Event.create({
      title: 'Data Science Symposium',
      description: 'Explore the latest trends in AI, machine learning, and data analytics.',
      start_datetime: '2026-04-10 08:30:00',
      end_datetime: '2026-04-12 16:30:00'
    });

    await Event.create({
      title: 'Cybersecurity Bootcamp',
      description: 'Intensive training on security fundamentals, ethical hacking, and threat detection.',
      start_datetime: '2026-06-05 09:00:00',
      end_datetime: '2026-06-07 18:00:00'
    });

    await Event.create({
      title: 'Mobile App Development Hackathon',
      description: '48-hour hackathon to build innovative mobile applications. Prizes for top teams!',
      start_datetime: '2026-07-20 08:00:00',
      end_datetime: '2026-07-22 20:00:00'
    });

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:');
    console.error(error);
    process.exit(1);
  }
};

// Run seeder with proper error handling
const run = async () => {
  try {
    await connectDB();
    await seedData();
  } catch (error) {
    console.error('❌ Fatal error during seeding:');
    console.error(error);
    process.exit(1);
  }
};

run();