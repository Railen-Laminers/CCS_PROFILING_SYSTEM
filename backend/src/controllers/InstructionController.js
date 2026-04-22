const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const LessonPlan = require('../models/LessonPlan');
const Material = require('../models/Material');
const Faculty = require('../models/Faculty');
const NotificationService = require('../services/NotificationService');
const crypto = require('crypto');

class InstructionController {
  static async getClasses(req, res, next) {
    try {
      const filter = {};

      // If the user is a faculty member, default to their own classes
      if (req.user.role === 'faculty') {
        const faculty = await Faculty.findOne({ user_id: req.user._id });
        if (faculty) {
          filter.instructor_id = faculty._id;
        }
      }

      // Override if a specific instructor_id is provided in query (e.g., for admin)
      if (req.query.instructor_id) {
        filter.instructor_id = req.query.instructor_id;
      }

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

  static async hasConflict(classData, currentId = null) {
    const { room_id, instructor_id, schedule } = classData;
    const { date, startTime, endTime } = schedule;

    const conflictQuery = {
      'schedule.date': date,
      $or: [
        { room_id },
        { instructor_id }
      ],
      _id: { $ne: currentId },
      'schedule.startTime': { $lt: endTime },
      'schedule.endTime': { $gt: startTime }
    };

    const conflict = await Class.findOne(conflictQuery)
      .populate('course_id', 'course_code')
      .populate('room_id', 'name')
      .populate({
        path: 'instructor_id',
        populate: { path: 'user_id', select: 'firstname lastname' }
      });

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

      if (!repeat_weekly) {
        const conflictMsg = await InstructionController.hasConflict(req.body);
        if (conflictMsg) {
          return res.status(400).json({ message: conflictMsg, errors: { global: [conflictMsg] } });
        }
        const newClass = await Class.create(req.body);
        return res.status(201).json(newClass);
      }

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
          schedule: {
            ...req.body.schedule,
            date: dateStr
          }
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
      const conflictMsg = await InstructionController.hasConflict(req.body, req.params.id);
      if (conflictMsg) {
        return res.status(400).json({ message: conflictMsg, errors: { global: [conflictMsg] } });
      }
      const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedClass) return res.status(404).json({ message: 'Class not found' });
      res.status(200).json(updatedClass);
    } catch (error) {
      next(error);
    }
  }

  static async deleteClass(req, res, next) {
    try {
      const deletedClass = await Class.findByIdAndDelete(req.params.id);
      if (!deletedClass) return res.status(404).json({ message: 'Class not found' });
      res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async getAssignments(req, res, next) {
    try {
      const assignments = await Assignment.find().populate('class_id');
      res.status(200).json(assignments);
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

  static async createLessonPlan(req, res, next) {
    try {
      if (req.file) {
        req.body.attached_file = `/uploads/${req.file.filename}`;
      }
      const lessonPlan = await LessonPlan.create(req.body);

      // Notify admins and faculty about new lesson plan
      try {
        const Course = require('../models/Course');
        const User = require('../models/User');

        let courseTitle = 'Course';
        if (lessonPlan.course_id) {
          const course = await Course.findById(lessonPlan.course_id).select('course_title');
          if (course) courseTitle = course.course_title;
        }

        // Get current faculty member if exists
        const faculty = await Faculty.findOne({ user_id: req.user._id });
        const notifyUserIds = [];

        if (faculty) {
          notifyUserIds.push(faculty.user_id);
        }

        // Notify admins
        const adminIds = await NotificationService.getAdminUsers();
        notifyUserIds.push(...adminIds);

        if (notifyUserIds.length > 0) {
          const uniqueUserIds = [...new Set(notifyUserIds.map(id => id.toString()))];
          await NotificationService.notifyLessonCreated(
            lessonPlan._id,
            lessonPlan.topic,
            lessonPlan.course_id,
            uniqueUserIds
          );
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
      const lessonPlan = await LessonPlan.findByIdAndDelete(id);
      if (!lessonPlan) throw new Error('Lesson plan not found');
      res.status(200).json({ message: 'Lesson plan deleted successfully' });
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

  static async createMaterial(req, res, next) {
    try {
      const material = await Material.create(req.body);
      res.status(201).json(material);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMaterial(req, res, next) {
    try {
      const { id } = req.params;
      const material = await Material.findByIdAndDelete(id);
      if (!material) throw new Error('Material not found');
      res.status(200).json({ message: 'Material deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async getSectionCourses(req, res, next) {
    try {
      const { section } = req.params;
      if (!section) {
        return res.status(400).json({ message: 'Section is required' });
      }

      const classes = await Class.find({ section })
        .populate('course_id', 'course_title');

      const courseTitles = [...new Set(classes
        .filter(c => c.course_id)
        .map(c => c.course_id.course_title))];

      res.status(200).json(courseTitles);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InstructionController;