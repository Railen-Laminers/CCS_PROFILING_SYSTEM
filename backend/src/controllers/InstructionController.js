const Class = require('../models/Class');
const LessonPlan = require('../models/LessonPlan');
const Material = require('../models/Material');
const Faculty = require('../models/Faculty');
const NotificationService = require('../services/NotificationService');
const ActivityLogService = require('../services/ActivityLogService');
const Course = require('../models/Course'); // for fetching course titles
const crypto = require('crypto');

class InstructionController {
  // ========== READ ENDPOINTS (NO LOGGING) ==========
  static async getClasses(req, res, next) {
    try {
      const filter = {};
      if (req.user.role === 'faculty') {
        const faculty = await Faculty.findOne({ user_id: req.user._id });
        if (faculty) filter.instructor_id = faculty._id;
      }
      if (req.query.instructor_id) filter.instructor_id = req.query.instructor_id;

      const classes = await Class.find(filter)
        .populate('course_id', 'course_code course_title units')
        .populate({
          path: 'instructor_id',
          populate: { path: 'user_id', select: 'firstname lastname' }
        })
        .populate('room_id', 'name type');
      res.status(200).json(classes);
    } catch (error) {
      next(error);
    }
  }

  static async getLessonPlans(req, res, next) {
    try {
      const lessonPlans = await LessonPlan.find()
        .populate('class_id')
        .populate('course_id', 'course_code course_title');
      res.status(200).json(lessonPlans);
    } catch (error) {
      next(error);
    }
  }

  static async getMaterials(req, res, next) {
    try {
      const materials = await Material.find()
        .populate('class_id')
        .populate('course_id', 'course_code course_title');
      res.status(200).json(materials);
    } catch (error) {
      next(error);
    }
  }

  static async getSectionCourses(req, res, next) {
    try {
      const { section } = req.params;
      if (!section) return res.status(400).json({ message: 'Section is required' });
      const classes = await Class.find({ section }).populate('course_id', 'course_title');
      const courseTitles = [...new Set(classes.filter(c => c.course_id).map(c => c.course_id.course_title))];
      res.status(200).json(courseTitles);
    } catch (error) {
      next(error);
    }
  }

  // ========== ACTION ENDPOINTS (WITH LOGGING) ==========

  static async hasConflict(classData, currentId = null) {
    const { room_id, instructor_id, schedule } = classData;
    const { date, startTime, endTime } = schedule;
    const conflictQuery = {
      'schedule.date': date,
      $or: [{ room_id }, { instructor_id }],
      _id: { $ne: currentId },
      'schedule.startTime': { $lt: endTime },
      'schedule.endTime': { $gt: startTime }
    };
    const conflict = await Class.findOne(conflictQuery)
      .populate('course_id', 'course_code')
      .populate('room_id', 'name')
      .populate({ path: 'instructor_id', populate: { path: 'user_id', select: 'firstname lastname' } });
    if (conflict) {
      if (conflict.room_id?._id.toString() === room_id) {
        return `Room ${conflict.room_id.name} is already booked for ${conflict.course_id.course_code} during this time.`;
      }
      if (conflict.instructor_id?._id.toString() === instructor_id) {
        const instructor = conflict.instructor_id.user_id;
        return `Instructor ${instructor.firstname} ${instructor.lastname} is already teaching ${conflict.course_id.course_code} during this time.`;
      }
    }
    return null;
  }

  static async createClass(req, res, next) {
    try {
      const { repeat_weekly, until_date } = req.body;

      // Single class
      if (!repeat_weekly) {
        const conflictMsg = await InstructionController.hasConflict(req.body);
        if (conflictMsg) {
          return res.status(400).json({ message: conflictMsg, errors: { global: [conflictMsg] } });
        }
        const newClass = await Class.create(req.body);

        // Log single class creation
        await ActivityLogService.logActivity({
          user: req.user,
          action: 'CLASS_CREATED',
          method: req.method,
          endpoint: req.originalUrl,
          target_resource: 'instruction',
          status_code: 201,
          ip_address: req.ip,
          user_agent: req.get('user-agent'),
          metadata: {
            class_id: newClass._id,
            course: newClass.course_id,
            section: newClass.section,
            date: newClass.schedule?.date,
            room: newClass.room_id,
            instructor: newClass.instructor_id
          }
        });
        return res.status(201).json(newClass);
      }

      // Recurring classes
      if (!until_date) {
        return res.status(400).json({ message: 'Until date is required for recurring classes.', errors: { until_date: ['Required'] } });
      }

      const series_id = crypto.randomUUID();
      const occurrences = [];
      let currentDate = new Date(req.body.schedule.date);
      const endDate = new Date(until_date);

      if (endDate <= currentDate) {
        return res.status(400).json({ message: 'Until date must be after start date.', errors: { until_date: ['Must be after start date'] } });
      }

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const classOccurrence = {
          ...req.body,
          series_id,
          schedule: { ...req.body.schedule, date: dateStr }
        };
        const conflictMsg = await InstructionController.hasConflict(classOccurrence);
        if (conflictMsg) {
          return res.status(400).json({
            message: `Conflict on ${dateStr}: ${conflictMsg}`,
            errors: { global: [`Conflict on ${dateStr}: ${conflictMsg}`] }
          });
        }
        occurrences.push(classOccurrence);
        currentDate.setDate(currentDate.getDate() + 7);
      }

      const createdClasses = await Class.insertMany(occurrences);

      // Log batch creation as one entry
      await ActivityLogService.logActivity({
        user: req.user,
        action: 'CLASS_CREATED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'instruction',
        status_code: 201,
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        metadata: {
          series_id,
          count: createdClasses.length,
          first_date: req.body.schedule.date,
          last_date: until_date,
          course: req.body.course_id,
          section: req.body.section
        }
      });

      res.status(201).json({
        message: `Successfully scheduled ${createdClasses.length} sessions.`,
        classes: createdClasses
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = [error.errors[key].message];
        });
        return res.status(400).json({ message: 'Validation Error', errors });
      }
      next(error);
    }
  }

  static async updateClass(req, res, next) {
    try {
      // Fetch current class before update (for change comparison)
      const currentClass = await Class.findById(req.params.id).lean();
      if (!currentClass) return res.status(404).json({ message: 'Class not found' });

      const conflictMsg = await InstructionController.hasConflict(req.body, req.params.id);
      if (conflictMsg) {
        return res.status(400).json({ message: conflictMsg, errors: { global: [conflictMsg] } });
      }

      const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedClass) return res.status(404).json({ message: 'Class not found' });

      // Build changes object – only for fields that were in request AND actually changed
      const changes = {};
      const relevantFields = ['course_id', 'section', 'schedule', 'room_id', 'instructor_id', 'max_students'];

      for (const field of relevantFields) {
        if (req.body.hasOwnProperty(field)) {
          let oldVal = currentClass[field];
          let newVal = updatedClass[field];
          // For schedule object, compare JSON stringified
          if (field === 'schedule') {
            oldVal = oldVal ? JSON.stringify(oldVal) : null;
            newVal = newVal ? JSON.stringify(newVal) : null;
          } else {
            oldVal = oldVal?.toString();
            newVal = newVal?.toString();
          }
          if (oldVal !== newVal) {
            changes[field] = {
              old: currentClass[field] || '(empty)',
              new: updatedClass[field] || '(empty)'
            };
          }
        }
      }

      // Only log if there are actual changes
      if (Object.keys(changes).length > 0) {
        await ActivityLogService.logActivity({
          user: req.user,
          action: 'CLASS_UPDATED',
          method: req.method,
          endpoint: req.originalUrl,
          target_resource: 'instruction',
          status_code: 200,
          ip_address: req.ip,
          user_agent: req.get('user-agent'),
          metadata: {
            class_id: updatedClass._id,
            changes
          }
        });
      }

      res.status(200).json(updatedClass);
    } catch (error) {
      next(error);
    }
  }

  static async deleteClass(req, res, next) {
    try {
      // Get class details before deletion (for metadata)
      const classToDelete = await Class.findById(req.params.id)
        .populate('course_id', 'course_code course_title')
        .lean();
      if (!classToDelete) return res.status(404).json({ message: 'Class not found' });

      await Class.findByIdAndDelete(req.params.id);

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'CLASS_DELETED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'instruction',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        metadata: {
          class_id: classToDelete._id,
          course: classToDelete.course_id?.course_title || classToDelete.course_id,
          section: classToDelete.section,
          date: classToDelete.schedule?.date
        }
      });

      res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async createLessonPlan(req, res, next) {
    try {
      if (req.file) {
        req.body.attached_file = `/uploads/${req.file.filename}`;
      }
      const lessonPlan = await LessonPlan.create(req.body);

      // Get course title for metadata
      let courseTitle = null;
      if (lessonPlan.course_id) {
        const course = await Course.findById(lessonPlan.course_id).select('course_title');
        if (course) courseTitle = course.course_title;
      }

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'LESSON_PLAN_CREATED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'instruction',
        status_code: 201,
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        metadata: {
          lesson_plan_id: lessonPlan._id,
          topic: lessonPlan.topic,
          course_id: lessonPlan.course_id,
          course_title: courseTitle
        }
      });

      // Existing notification code (kept as is)
      try {
        let courseTitleForNotif = 'Course';
        if (lessonPlan.course_id) {
          const course = await Course.findById(lessonPlan.course_id).select('course_title');
          if (course) courseTitleForNotif = course.course_title;
        }
        const faculty = await Faculty.findOne({ user_id: req.user._id });
        const notifyUserIds = [];
        if (faculty) notifyUserIds.push(faculty.user_id);
        const adminIds = await NotificationService.getAdminUsers();
        notifyUserIds.push(...adminIds);
        if (notifyUserIds.length > 0) {
          const uniqueUserIds = [...new Set(notifyUserIds.map(id => id.toString()))];
          await NotificationService.notifyLessonCreated(lessonPlan._id, lessonPlan.topic, lessonPlan.course_id, uniqueUserIds);
        }
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }

      res.status(201).json(lessonPlan);
    } catch (error) {
      next(error);
    }
  }

  static async deleteLessonPlan(req, res, next) {
    try {
      const { id } = req.params;
      const lessonPlan = await LessonPlan.findById(id).lean();
      if (!lessonPlan) return res.status(404).json({ message: 'Lesson plan not found' });

      await LessonPlan.findByIdAndDelete(id);

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'LESSON_PLAN_DELETED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'instruction',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        metadata: {
          lesson_plan_id: id,
          topic: lessonPlan.topic,
          course_id: lessonPlan.course_id
        }
      });

      res.status(200).json({ message: 'Lesson plan deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async createMaterial(req, res, next) {
    try {
      const material = await Material.create(req.body);

      let courseTitle = null;
      if (material.course_id) {
        const course = await Course.findById(material.course_id).select('course_title');
        if (course) courseTitle = course.course_title;
      }

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'MATERIAL_CREATED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'instruction',
        status_code: 201,
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        metadata: {
          material_id: material._id,
          title: material.title,
          course_id: material.course_id,
          course_title: courseTitle
        }
      });

      res.status(201).json(material);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMaterial(req, res, next) {
    try {
      const { id } = req.params;
      const material = await Material.findById(id).lean();
      if (!material) return res.status(404).json({ message: 'Material not found' });

      await Material.findByIdAndDelete(id);

      await ActivityLogService.logActivity({
        user: req.user,
        action: 'MATERIAL_DELETED',
        method: req.method,
        endpoint: req.originalUrl,
        target_resource: 'instruction',
        status_code: 200,
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        metadata: {
          material_id: id,
          title: material.title,
          course_id: material.course_id
        }
      });

      res.status(200).json({ message: 'Material deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InstructionController;