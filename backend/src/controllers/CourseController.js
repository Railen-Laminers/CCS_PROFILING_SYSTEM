const CourseService = require('../services/CourseService');

class CourseController {
  /**
   * List all courses
   */
  static async index(req, res, next) {
    try {
      const courses = await CourseService.getAll();

      // Transform _id to course_id for consistency
      const transformedCourses = courses.map(course => ({
        course_id: course._id,
        credits: course.credits,
        course_code: course.course_code,
        course_title: course.course_title
      }));

      res.status(200).json({
        courses: transformedCourses
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Show a single course based on course_id or course_code
   */
  static async show(req, res, next) {
    try {
      const { id } = req.params;
      const course = await CourseService.findByIdentifier(id);

      res.status(200).json({
        course: {
          course_id: course._id,
          credits: course.credits,
          course_code: course.course_code,
          course_title: course.course_title
        }
      });
    } catch (error) {
      if (error.message === 'Course not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Create a new course
   */
  static async store(req, res, next) {
    try {
      const course = await CourseService.create(req.body);

      res.status(201).json({
        message: 'Course created successfully',
        course: {
          course_id: course._id,
          credits: course.credits,
          course_code: course.course_code,
          course_title: course.course_title
        }
      });
    } catch (error) {
      // Handle duplicate course code
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'Course code already exists',
          errors: {
            course_code: ['Course code already exists']
          }
        });
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = [error.errors[key].message];
        });
        return res.status(400).json({
          message: 'Validation error',
          errors
        });
      }

      next(error);
    }
  }

  /**
   * Update an existing course
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const course = await CourseService.update(id, req.body);

      res.status(200).json({
        message: 'Course updated successfully',
        course: {
          course_id: course._id,
          credits: course.credits,
          course_code: course.course_code,
          course_title: course.course_title
        }
      });
    } catch (error) {
      // Handle duplicate course code
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'Course code already exists',
          errors: {
            course_code: ['Course code already exists']
          }
        });
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = [error.errors[key].message];
        });
        return res.status(400).json({
          message: 'Validation error',
          errors
        });
      }

      if (error.message === 'Course not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Delete a course
   */
  static async destroy(req, res, next) {
    try {
      const { id } = req.params;
      await CourseService.delete(id);

      res.status(200).json({
        message: 'Course deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Course not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = CourseController;
