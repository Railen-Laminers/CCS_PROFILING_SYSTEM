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
        quiz_bee_participations: Math.random() > 0.7 ? [getRandomElement(['Math Quiz Bee', 'Science Quiz Bee', 'IT Quiz Bee', 'History Quiz Bee', 'Regionals', 'National Level'])] : [],
        programming_contests: Math.random() > 0.8 ? [getRandomElement(['Hackathon 2024', 'Coding Cup', 'Code Sprint', 'Logic Master', 'Vite Hackathon', 'React Challenge'])] : [],
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

    // Comprehensive Curriculum Data (BSIT, BSCS, BSIS)
    const courseData = [
      // BSIT - Year 1
      { units: 3, course_code: 'IT 111', course_title: 'Introduction to Computing', year_level: 1, semester: 1, program: 'BSIT', syllabus: 'History of Computing, Hardware, Software, and Digital Literacy.' },
      { units: 3, course_code: 'IT 112', course_title: 'Computer Programming 1', year_level: 1, semester: 1, program: 'BSIT', syllabus: 'Logic formulation and basic C++ programming.' },
      { units: 3, course_code: 'IT 121', course_title: 'Computer Programming 2', year_level: 1, semester: 2, program: 'BSIT', syllabus: 'Advanced C++ and introductory data structures.' },
      { units: 3, course_code: 'IT 122', course_title: 'Discrete Mathematics', year_level: 1, semester: 2, program: 'BSIT', syllabus: 'Set theory, logic, and proof techniques for IT.' },
      
      // BSIT - Year 2
      { units: 3, course_code: 'IT 211', course_title: 'Data Structures & Algorithms', year_level: 2, semester: 1, program: 'BSIT', syllabus: 'Stacks, Queues, Trees, and Sorting algorithms.' },
      { units: 3, course_code: 'IT 212', course_title: 'Web Development 1', year_level: 2, semester: 1, program: 'BSIT', syllabus: 'HTML5, CSS3, and JavaScript fundamentals.' },
      { units: 3, course_code: 'IT 221', course_title: 'Database Management Systems 1', year_level: 2, semester: 2, program: 'BSIT', syllabus: 'Relational databases, SQL, and Normalization.' },
      { units: 3, course_code: 'IT 222', course_title: 'Object Oriented Programming', year_level: 2, semester: 2, program: 'BSIT', syllabus: 'Java programming and design patterns.' },
      { units: 3, course_code: 'IT 223', course_title: 'Networking 1', year_level: 2, semester: 2, program: 'BSIT', syllabus: 'OSI Model, TCP/IP, and basic routing.' },

      // BSIT - Year 3
      { units: 3, course_code: 'IT 311', course_title: 'Software Engineering', year_level: 3, semester: 1, program: 'BSIT', syllabus: 'SDLC, Agile methodologies, and project documentation.' },
      { units: 3, course_code: 'IT 312', course_title: 'Mobile Development', year_level: 3, semester: 1, program: 'BSIT', syllabus: 'Android and iOS development using React Native.' },
      { units: 3, course_code: 'IT 321', course_title: 'Information Assurance and Security', year_level: 3, semester: 2, program: 'BSIT', syllabus: 'Cryptography, Risk Management, and Cybersecurity.' },
      { units: 3, course_code: 'IT 322', course_title: 'Human Computer Interaction', year_level: 3, semester: 2, program: 'BSIT', syllabus: 'UI/UX design principles and user testing.' },
      { units: 3, course_code: 'IT 323', course_title: 'Capstone Project 1', year_level: 3, semester: 2, program: 'BSIT', syllabus: 'Proposal and requirements gathering.' },

      // BSIT - Year 4
      { units: 3, course_code: 'IT 411', course_title: 'Capstone Project 2', year_level: 4, semester: 1, program: 'BSIT', syllabus: 'Implementation and system testing.' },
      { units: 3, course_code: 'IT 412', course_title: 'Social and Professional Issues', year_level: 4, semester: 1, program: 'BSIT', syllabus: 'IT Ethics and legal frameworks.' },
      { units: 3, course_code: 'IT 421', course_title: 'Integrative Programming', year_level: 4, semester: 2, program: 'BSIT', syllabus: 'System integration and middleware.' },

      // BSCS - Year 1
      { units: 3, course_code: 'CS 111', course_title: 'Computer Science Fundamentals', year_level: 1, semester: 1, program: 'BSCS', syllabus: 'Foundations of computing and computational thinking.' },
      { units: 3, course_code: 'CS 112', course_title: 'Programming Fundamentals', year_level: 1, semester: 1, program: 'BSCS', syllabus: 'C programming and memory management.' },
      { units: 3, course_code: 'CS 121', course_title: 'Object Oriented Programming', year_level: 1, semester: 2, program: 'BSCS', syllabus: 'C++ and OOP principles.' },
      { units: 3, course_code: 'CS 122', course_title: 'Discrete Structures', year_level: 1, semester: 2, program: 'BSCS', syllabus: 'Mathematical structures for computer science.' },

      // BSCS - Year 2
      { units: 3, course_code: 'CS 211', course_title: 'Algorithms & Complexity', year_level: 2, semester: 1, program: 'BSCS', syllabus: 'Big O notation, Graph theory, and Dynamic Programming.' },
      { units: 3, course_code: 'CS 212', course_title: 'Computer Architecture', year_level: 2, semester: 1, program: 'BSCS', syllabus: 'Digital logic and assembly language.' },
      { units: 3, course_code: 'CS 221', course_title: 'Operating Systems', year_level: 2, semester: 2, program: 'BSCS', syllabus: 'Processes, Threads, and Memory Management.' },
      { units: 3, course_code: 'CS 222', course_title: 'Theory of Computation', year_level: 2, semester: 2, program: 'BSCS', syllabus: 'Automata theory and formal languages.' },

      // BSCS - Year 3
      { units: 3, course_code: 'CS 311', course_title: 'Software Engineering', year_level: 3, semester: 1, program: 'BSCS', syllabus: 'Formal methods and software quality.' },
      { units: 3, course_code: 'CS 312', course_title: 'Artificial Intelligence', year_level: 3, semester: 1, program: 'BSCS', syllabus: 'Search algorithms, ML, and Neural Networks.' },
      { units: 3, course_code: 'CS 321', course_title: 'Database Systems', year_level: 3, semester: 2, program: 'BSCS', syllabus: 'Internals of DBMS and query optimization.' },
      { units: 3, course_code: 'CS 322', course_title: 'CS Thesis 1', year_level: 3, semester: 2, program: 'BSCS', syllabus: 'Research methodology and topic selection.' },

      // BSCS - Year 4
      { units: 3, course_code: 'CS 411', course_title: 'CS Thesis 2', year_level: 4, semester: 1, program: 'BSCS', syllabus: 'Full research implementation.' },
      { units: 3, course_code: 'CS 412', course_title: 'Computer Graphics', year_level: 4, semester: 1, program: 'BSCS', syllabus: 'Rendering pipelines and OpenGL.' },
      { units: 3, course_code: 'CS 421', course_title: 'Parallel and Distributed Systems', year_level: 4, semester: 2, program: 'BSCS', syllabus: 'Distributed computing models.' },

      // BSIS - Year 1
      { units: 3, course_code: 'IS 111', course_title: 'Introduction to Information Systems', year_level: 1, semester: 1, program: 'BSIS', syllabus: 'Role of IS in modern business.' },
      { units: 3, course_code: 'IS 112', course_title: 'Business Processes', year_level: 1, semester: 1, program: 'BSIS', syllabus: 'Process modeling and organizational structures.' },
      { units: 3, course_code: 'IS 121', course_title: 'IT Infrastructure', year_level: 1, semester: 2, program: 'BSIS', syllabus: 'Hardware, Networks, and Cloud services.' },
      { units: 3, course_code: 'IS 122', course_title: 'Personal Productivity Tools', year_level: 1, semester: 2, program: 'BSIS', syllabus: 'Advanced office apps and scripting.' },

      // BSIS - Year 2
      { units: 3, course_code: 'IS 211', course_title: 'Database Systems', year_level: 2, semester: 1, program: 'BSIS', syllabus: 'Data modeling for business applications.' },
      { units: 3, course_code: 'IS 212', course_title: 'Enterprise Architecture', year_level: 2, semester: 1, program: 'BSIS', syllabus: 'IT alignment with business goals.' },
      { units: 3, course_code: 'IS 221', course_title: 'Systems Analysis and Design', year_level: 2, semester: 2, program: 'BSIS', syllabus: 'Requirements elicitation and UML.' },
      { units: 3, course_code: 'IS 222', course_title: 'IS Strategy, Management and Acquisition', year_level: 2, semester: 2, program: 'BSIS', syllabus: 'Strategic planning and IT procurement.' },

      // BSIS - Year 3
      { units: 3, course_code: 'IS 311', course_title: 'Project Management', year_level: 3, semester: 1, program: 'BSIS', syllabus: 'PMP principles and tools.' },
      { units: 3, course_code: 'IS 312', course_title: 'Decision Support Systems', year_level: 3, semester: 1, program: 'BSIS', syllabus: 'BI and Data Analytics for decision making.' },
      { units: 3, course_code: 'IS 321', course_title: 'E-Business', year_level: 3, semester: 2, program: 'BSIS', syllabus: 'E-commerce models and digital marketing.' },
      { units: 3, course_code: 'IS 322', course_title: 'IS Thesis 1', year_level: 3, semester: 2, program: 'BSIS', syllabus: 'IS research and case studies.' },

      // BSIS - Year 4
      { units: 3, course_code: 'IS 411', course_title: 'IS Thesis 2', year_level: 4, semester: 1, program: 'BSIS', syllabus: 'Final IS research presentation.' },
      { units: 3, course_code: 'IS 412', course_title: 'IT Audit and Controls', year_level: 4, semester: 1, program: 'BSIS', syllabus: 'Risk management and internal controls.' },
      { units: 3, course_code: 'IS 421', course_title: 'Quality Management', year_level: 4, semester: 2, program: 'BSIS', syllabus: 'TQM and Six Sigma in IT.' }
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