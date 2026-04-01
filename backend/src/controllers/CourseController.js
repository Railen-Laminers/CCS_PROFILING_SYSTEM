const CourseService = require('../services/CourseService');

class CourseController {
  /**
   * List all courses with curriculum metadata
   */
  static async index(req, res, next) {
    try {
      const courses = await CourseService.getAll();
      res.status(200).json({
        courses: courses
      });
    } catch (error) {
      console.error(' [CourseController.index] Error:', error);
      next(error);
    }
  }

  /**
   * Show a single course with metadata
   */
  static async show(req, res, next) {
    try {
      const { id } = req.params;
      const course = await CourseService.findByIdentifier(id);

      res.status(200).json({
        course: course
      });
    } catch (error) {
      console.error(' [CourseController.show] Error:', error);
      if (error.message === 'Course not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Create a new course with curriculum metadata
   */
  static async store(req, res, next) {
    try {
      // Log outgoing request for debugging 400s
      console.log(' [CourseController.store] Creating course with body:', req.body);
      
      const course = await CourseService.create(req.body);

      res.status(201).json({
        message: 'Course created successfully',
        course: course
      });
    } catch (error) {
      console.error(' [CourseController.store] Error details:', error);

      // Handle duplicate course code
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'Course code already exists in the curriculum.',
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
        
        // Return first validation error as main message for toast
        const firstError = Object.values(error.errors)[0]?.message || 'Validation failed';

        return res.status(400).json({
          message: firstError,
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
        course: course
      });
    } catch (error) {
      console.error(' [CourseController.update] Error details:', error);

      // Handle duplicate course code
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'Course code already exists.',
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
        
        const firstError = Object.values(error.errors)[0]?.message || 'Validation failed';

        return res.status(400).json({
          message: firstError,
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
      console.error(' [CourseController.destroy] Error:', error);
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
