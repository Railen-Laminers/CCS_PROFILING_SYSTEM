const Course = require('../models/Course');

class CourseService {
  /**
   * Get all courses
   */
  static async getAll() {
    return await Course.find().select('_id credits course_code course_title');
  }

  /**
   * Find a course by ID or course_code
   */
  static async findByIdentifier(identifier) {
    const course = await Course.findOne({
      $or: [
        { _id: identifier },
        { course_code: identifier }
      ]
    }).select('_id credits course_code course_title');

    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }

  /**
   * Create a new course
   */
  static async create(data) {
    return await Course.create({
      credits: data.credits,
      course_code: data.course_code,
      course_title: data.course_title
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

    Object.assign(course, data);
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
