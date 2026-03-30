const Student = require('../models/Student');
const User = require('../models/User');

class StudentSearchService {
  /**
   * Search and filter students with pagination
   */
  static async search(filters) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.per_page) || 15;
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

    // Execute query with pagination
    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('user_id')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

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
        current_page: page,
        last_page: Math.ceil(total / limit),
        per_page: limit,
        total
      }
    };
  }

  /**
   * Get distinct sports from all students
   */
  static async getDistinctSports() {
    const students = await Student.find({
      sports_activities: { $ne: null }
    }).select('sports_activities');

    const sports = new Set();
    students.forEach(student => {
      if (student.sports_activities && student.sports_activities.sportsPlayed) {
        student.sports_activities.sportsPlayed.forEach(sport => {
          sports.add(sport);
        });
      }
    });

    return Array.from(sports).sort();
  }

  /**
   * Get distinct organizations from all students
   */
  static async getDistinctOrganizations() {
    const students = await Student.find({
      organizations: { $ne: null }
    }).select('organizations');

    const orgs = new Set();
    students.forEach(student => {
      if (student.organizations && student.organizations.clubs) {
        student.organizations.clubs.forEach(club => {
          orgs.add(club);
        });
      }
    });

    return Array.from(orgs).sort();
  }
}

module.exports = StudentSearchService;
