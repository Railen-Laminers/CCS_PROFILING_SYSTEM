const Faculty = require('../models/Faculty');
const User = require('../models/User');

class FacultySearchService {
  /**
   * Search and filter faculty with pagination
   */
  static async search(filters) {
    const page = parseInt(filters.page) || 1;
    const limit = filters.paginate === 'false' ? 0 : (parseInt(filters.per_page) || 15);
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Search by name, email or user_id
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      const users = await User.find({
        role: 'faculty',
        $or: [
          { firstname: searchRegex },
          { lastname: searchRegex },
          { user_id: searchRegex },
          { email: searchRegex },
          { $expr: { $regexMatch: { input: { $concat: ['$firstname', ' ', '$lastname'] }, regex: filters.search, options: 'i' } } }
        ]
      }).select('_id');

      const userIds = users.map(u => u._id);
      query.user_id = { $in: userIds };
    }

    // Filter by department
    if (filters.department) {
      query.department = filters.department;
    }

    // Filter by position
    if (filters.position) {
      query.position = filters.position;
    }

    // Filter by gender
    if (filters.gender) {
      const users = await User.find({
        role: 'faculty',
        gender: filters.gender
      }).select('_id');

      const userIds = users.map(u => u._id);
      
      if (query.user_id) {
        // Intersect with existing search results
        const existingIds = query.user_id.$in;
        query.user_id.$in = existingIds.filter(id => userIds.some(uid => uid.equals(id)));
      } else {
        query.user_id = { $in: userIds };
      }
    }

    // Execute query
    let facultyQuery = Faculty.find(query)
      .populate('user_id')
      .sort({ _id: -1 });

    // Conditional pagination
    if (filters.paginate !== 'false') {
      facultyQuery = facultyQuery.skip(skip).limit(limit);
    }

    const facultyList = await facultyQuery;

    // Get total for metadata
    let total;
    if (filters.paginate === 'false') {
      total = facultyList.length;
    } else {
      const countResult = await Faculty.countDocuments(query);
      total = countResult;
    }

    // Format response
    const formattedFaculty = facultyList.filter(f => f.user_id).map(f => {
      const user = f.user_id;
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
        faculty: f
      };
    });

    return {
      faculty: formattedFaculty,
      meta: {
        current_page: filters.paginate === 'false' ? 1 : page,
        last_page: filters.paginate === 'false' ? 1 : Math.ceil(total / limit),
        per_page: filters.paginate === 'false' ? total : (limit || total),
        total
      }
    };
  }

  /**
   * Get distinct departments from all faculty
   */
  static async getDistinctDepartments() {
    const departments = await Faculty.distinct('department');
    return departments.filter(Boolean).sort();
  }

  /**
   * Get distinct positions/ranks from all faculty
   */
  static async getDistinctPositions() {
    const positions = await Faculty.distinct('position');
    return positions.filter(Boolean).sort();
  }
}

module.exports = FacultySearchService;
