const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const LessonPlan = require('../models/LessonPlan');
const Material = require('../models/Material');

class InstructionController {
  static async getClasses(req, res, next) {
    try {
      const classes = await Class.find()
        .populate('course_id', 'course_code course_title')
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

    // Build conflict query
    const conflictQuery = {
      'schedule.date': date,
      $or: [
        { room_id },
        { instructor_id }
      ],
      // Exclude current class if updating
      _id: { $ne: currentId },
      // Overlap logic: (newStart < existingEnd) && (existingStart < newEnd)
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
      const conflictMsg = await InstructionController.hasConflict(req.body);
      if (conflictMsg) {
        return res.status(400).json({ message: conflictMsg, errors: { global: [conflictMsg] } });
      }
      const newClass = await Class.create(req.body);
      res.status(201).json(newClass);
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
}

module.exports = InstructionController;
