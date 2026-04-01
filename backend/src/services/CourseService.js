const Course = require('../models/Course');

class CourseService {
  /**
   * Get all courses with all curriculum metadata
   */
  static async getAll() {
    return await Course.find();
  }

  /**
   * Find a course by ID or course_code with full metadata
   */
  static async findByIdentifier(identifier) {
    const course = await Course.findOne({
      $or: [
        { _id: identifier },
        { course_code: identifier }
      ]
    });

    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }

  /**
   * Create a new course with full curriculum fields
   */
  static async create(data) {
    return await Course.create({
      units: data.units,
      course_code: data.course_code,
      course_title: data.course_title,
      year_level: data.year_level,
      semester: data.semester,
      syllabus: data.syllabus
    });
  }

  /**
   * Update an existing course
   */
  static async update(id, data) {
    const course = await Course.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }

    // Assign only allowed curriculum fields
    const allowedFields = ['units', 'course_code', 'course_title', 'year_level', 'semester', 'syllabus'];
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        course[field] = data[field];
      }
    });

    await course.save();
    return course;
  }

  /**
   * Delete a course
   */
  static async delete(id) {
    const course = await Course.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }

    await course.deleteOne();
  }
}

module.exports = CourseService;
