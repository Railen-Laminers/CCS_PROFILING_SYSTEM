const CourseService = require('../services/CourseService');
const ActivityLogService = require('../services/ActivityLogService');
const Course = require('../models/Course'); // needed for fetching old course data

class CourseController {
  /**
   * List all courses – NO LOGGING (read endpoint)
   */
  static async index(req, res, next) {
    try {
      const courses = await CourseService.getAll();
      res.status(200).json({ courses });
    } catch (error) {
      console.error(' [CourseController.index] Error:', error);
      next(error);
    }
  }

  /**
   * Show a single course – NO LOGGING (read endpoint)
   */
  static async show(req, res, next) {
    try {
      const { id } = req.params;
      const course = await CourseService.findByIdentifier(id);
      res.status(200).json({ course });
    } catch (error) {
      console.error(' [CourseController.show] Error:', error);
      if (error.message === 'Course not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Create a new course – WITH LOGGING
   */
  static async store(req, res, next) {
    try {
      console.log(' [CourseController.store] Creating course with body:', req.body);

      if (req.file) {
        req.body.syllabus_file = `/uploads/${req.file.filename}`;
      }

      const course = await CourseService.create(req.body);

      // Log the creation
      await ActivityLogService.logActivity({
        user: req.user,
        action: 'COURSE_CREATED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'course',
        status_code: 201,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          course_id: course._id,
          course_code: course.course_code,
          course_title: course.course_title
        }
      });

      res.status(201).json({
        message: 'Course created successfully',
        course: course
      });
    } catch (error) {
      console.error(' [CourseController.store] Error details:', error);

      if (error.code === 11000) {
        return res.status(400).json({
          message: 'Course code already exists in the curriculum.',
          errors: { course_code: ['Course code already exists'] }
        });
      }

      if (error.name === 'ValidationError') {
        const errors = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = [error.errors[key].message];
        });
        const firstError = Object.values(error.errors)[0]?.message || 'Validation failed';
        return res.status(400).json({ message: firstError, errors });
      }

      next(error);
    }
  }

  /**
   * Update an existing course – WITH LOGGING (only changed fields)
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;

      // 1. Fetch the current course before update (for comparison)
      const currentCourse = await Course.findById(id).lean();
      if (!currentCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // 2. Prepare update data
      const updateData = { ...req.body };
      if (req.file) {
        updateData.syllabus_file = `/uploads/${req.file.filename}`;
      }

      // 3. Perform update
      const updatedCourse = await CourseService.update(id, updateData);

      // 4. Build changes object – only fields present in req.body that actually changed
      const changes = {};
      const editableFields = [
        'course_code', 'course_title', 'description', 'units', 'hours_per_week',
        'lecture_hours', 'lab_hours', 'prerequisites', 'co_requisites', 'syllabus_file',
        'year_level', 'semester', 'program'
      ];

      for (const field of editableFields) {
        // Check if field was provided in request body (or syllabus_file via file upload)
        if (req.body.hasOwnProperty(field) || (field === 'syllabus_file' && req.file)) {
          const newValue = field === 'syllabus_file' && req.file ? updateData.syllabus_file : req.body[field];
          const oldValue = currentCourse[field];

          // Compare (handle null/undefined/empty string)
          const oldStr = oldValue == null ? '' : String(oldValue);
          const newStr = newValue == null ? '' : String(newValue);

          if (oldStr !== newStr) {
            changes[field] = {
              old: oldValue == null || oldValue === '' ? '(empty)' : oldValue,
              new: newValue == null || newValue === '' ? '(empty)' : newValue
            };
          }
        }
      }

      // 5. Log only if there are actual changes
      if (Object.keys(changes).length > 0) {
        await ActivityLogService.logActivity({
          user: req.user,
          action: 'COURSE_UPDATED',
          method: req.method,
          endpoint: req.originalUrl,
          target_resource: 'course',
          status_code: 200,
          ip_address: req.ip,
          user_agent: req.get('user-agent') || null,
          metadata: {
            course_id: updatedCourse._id,
            course_code: updatedCourse.course_code,
            changes: changes
          }
        });
      }

      res.status(200).json({
        message: 'Course updated successfully',
        course: updatedCourse
      });
    } catch (error) {
      console.error(' [CourseController.update] Error details:', error);

      if (error.code === 11000) {
        return res.status(400).json({
          message: 'Course code already exists.',
          errors: { course_code: ['Course code already exists'] }
        });
      }

      if (error.name === 'ValidationError') {
        const errors = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = [error.errors[key].message];
        });
        const firstError = Object.values(error.errors)[0]?.message || 'Validation failed';
        return res.status(400).json({ message: firstError, errors });
      }

      if (error.message === 'Course not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  /**
   * Delete a course – WITH LOGGING
   */
  static async destroy(req, res, next) {
    try {
      const { id } = req.params;

      // Get course details before deletion (for metadata)
      const courseToDelete = await Course.findById(id).lean();
      if (!courseToDelete) {
        return res.status(404).json({ message: 'Course not found' });
      }

      await CourseService.delete(id);

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'COURSE_DELETED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'course',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
        metadata: {
          course_id: courseToDelete._id,
          course_code: courseToDelete.course_code,
          course_title: courseToDelete.course_title
        }
      });

      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error(' [CourseController.destroy] Error:', error);
      if (error.message === 'Course not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = CourseController;