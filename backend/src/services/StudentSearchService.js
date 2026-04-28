const Student = require('../models/Student');
const User = require('../models/User');

class StudentSearchService {
  /**
   * Search and filter students with pagination
   */
  static async search(filters) {
    const page = parseInt(filters.page) || 1;
    const limit = filters.paginate === 'false' ? 0 : (parseInt(filters.per_page) || 15);
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Search by name or user_id
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      const users = await User.find({
        role: 'student',
        $or: [
          { firstname: searchRegex },
          { lastname: searchRegex },
          { user_id: searchRegex },
          { $expr: { $regexMatch: { input: { $concat: ['$firstname', ' ', '$lastname'] }, regex: filters.search, options: 'i' } } }
        ]
      }).select('_id');

      const userIds = users.map(u => u._id);
      query.user_id = { $in: userIds };
    }

    // Filter by program
    if (filters.program) {
      query.program = filters.program;
    }

    // Filter by year level
    if (filters.year_level) {
      query.year_level = parseInt(filters.year_level);
    }

    // Filter by gender
    if (filters.gender) {
      const users = await User.find({
        role: 'student',
        gender: filters.gender
      }).select('_id');

      const userIds = users.map(u => u._id);
      query.user_id = query.user_id 
        ? { $in: query.user_id.$in.filter(id => userIds.some(uid => uid.equals(id))) }
        : { $in: userIds };
    }

    // Filter by GPA range
    if (filters.gpa_min !== undefined || filters.gpa_max !== undefined) {
      query.gpa = {};
      if (filters.gpa_min !== undefined) {
        query.gpa.$gte = parseFloat(filters.gpa_min);
      }
      if (filters.gpa_max !== undefined) {
        query.gpa.$lte = parseFloat(filters.gpa_max);
      }
    }

    // Filter by sports
    if (filters.sports && filters.sports.length > 0) {
      query['sports_activities.sportsPlayed'] = { $in: filters.sports };
    }

    // Filter by organizations
    if (filters.organizations && filters.organizations.length > 0) {
      query['organizations.clubs'] = { $in: filters.organizations };
    }

    // Filter by skills (now includes quiz bee and programming contests)
    if (filters.skills && filters.skills.length > 0) {
      query.$or = [
        { 'quiz_bee_participations': { $in: filters.skills } },
        { 'programming_contests': { $in: filters.skills } }
      ];
    }

    // Execute query
    let studentsQuery = Student.find(query)
      .populate('user_id')
      .sort({ _id: -1 });

    // Conditional pagination
    if (filters.paginate !== 'false') {
      studentsQuery = studentsQuery.skip(skip).limit(limit);
    }

    const students = await studentsQuery;

    // Get total for metadata
    let total;
    if (filters.paginate === 'false') {
      total = students.length;
    } else {
      const countResult = await Student.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $count: 'total' }
      ]);
      total = countResult.length > 0 ? countResult[0].total : 0;
    }

    // Format response
    const formattedStudents = students.filter(student => student.user_id).map(student => {
      const user = student.user_id;
      return {
        user: {
          id: user._id,
          firstname: user.firstname,
          middlename: user.middlename,
          lastname: user.lastname,
          user_id: user.user_id,
          email: user.email,
          birth_date: user.birth_date,
          contact_number: user.contact_number,
          gender: user.gender,
          address: user.address,
          profile_picture: user.profile_picture,
          is_active: user.is_active,
          last_login_at: user.last_login_at
        },
        student: student
      };
    });

    return {
      students: formattedStudents,
      meta: {
        current_page: filters.paginate === 'false' ? 1 : page,
        last_page: filters.paginate === 'false' ? 1 : Math.ceil(total / limit),
        per_page: filters.paginate === 'false' ? total : limit,
        total
      }
    };
  }

  /**
   * Get distinct sports from all students
   */
  static async getDistinctSports() {
    const sports = await Student.distinct('sports_activities.sportsPlayed');
    return sports.sort();
  }

  /**
   * Get distinct organizations from all students
   */
  static async getDistinctOrganizations() {
    const orgs = await Student.distinct('organizations.clubs');
    return orgs.sort();
  }

  /**
   * Get distinct skills from all students
   */
  static async getDistinctSkills() {
    const [quizBee, programming] = await Promise.all([
      Student.distinct('quiz_bee_participations'),
      Student.distinct('programming_contests')
    ]);
    
    // Combine and get unique values, filtering out nulls/empties
    const combined = [...new Set([...quizBee, ...programming])];
    return combined.filter(s => s && typeof s === 'string').map(s => s.trim()).filter(Boolean).sort();
  }

  /**
   * Get distinct sections from all students
   */
  static async getDistinctSections(program, year_level) {
    let query = {};
    
    if (program && typeof program === 'string') {
      const trimmedProgram = program.trim();
      // Normalize program: support both BSIT and full name
      const normalizedProgram = trimmedProgram === 'BSIT' ? 
        { $in: ['BSIT', 'Bachelor of Science in Information Technology'] } :
        trimmedProgram === 'BSCS' ?
        { $in: ['BSCS', 'Bachelor of Science in Computer Science'] } :
        trimmedProgram === 'BSIS' ?
        { $in: ['BSIS', 'Bachelor of Science in Information Systems'] } :
        trimmedProgram;
      query.program = normalizedProgram;
    }
    
    if (year_level && !isNaN(parseInt(year_level, 10))) {
      query.year_level = parseInt(year_level, 10);
    }
    
    try {
      const sections = await Student.distinct('section', query);
      return (sections || []).filter(s => s && typeof s === 'string').sort();
    } catch (error) {
      console.error('Error fetching distinct sections:', error);
      return [];
    }
  }

  /**
   * Count active students in a specific section
   */
  static async getStudentCountBySection(section) {
    const students = await Student.find({ section }).populate('user_id', 'is_active');
    const activeStudents = students.filter(s => s.user_id && s.user_id.is_active);
    return activeStudents.length;
  }
}

module.exports = StudentSearchService;
