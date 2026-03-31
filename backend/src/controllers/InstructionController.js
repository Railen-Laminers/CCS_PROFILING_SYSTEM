const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const LessonPlan = require('../models/LessonPlan');
const Material = require('../models/Material');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const User = require('../models/User');

class InstructionController {
  // ─── Classes ───────────────────────────────────────────────────────────────

  static async getClasses(req, res, next) {
    try {
      const classes = await Class.find()
        .populate('course_id', 'course_code course_title')
        .populate({
          path: 'instructor_id',
          populate: { path: 'user_id', select: 'firstname lastname' }
        });
      res.status(200).json(classes);
    } catch (error) {
      next(error);
    }
  }

  static async createClass(req, res, next) {
    try {
      const newClass = await Class.create(req.body);
      const populated = await Class.findById(newClass._id)
        .populate('course_id', 'course_code course_title')
        .populate({
          path: 'instructor_id',
          populate: { path: 'user_id', select: 'firstname lastname' }
        });
      res.status(201).json(populated);
    } catch (error) {
      next(error);
    }
  }

  static async updateClass(req, res, next) {
    try {
      const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate('course_id', 'course_code course_title')
        .populate({
          path: 'instructor_id',
          populate: { path: 'user_id', select: 'firstname lastname' }
        });
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async deleteClass(req, res, next) {
    try {
      await Class.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // ─── Assignments ───────────────────────────────────────────────────────────

  static async getAssignments(req, res, next) {
    try {
      const assignments = await Assignment.find().populate({
        path: 'class_id',
        populate: { path: 'course_id', select: 'course_code course_title' }
      });
      res.status(200).json(assignments);
    } catch (error) {
      next(error);
    }
  }

  static async createAssignment(req, res, next) {
    try {
      const assignment = await Assignment.create(req.body);
      const populated = await Assignment.findById(assignment._id).populate({
        path: 'class_id',
        populate: { path: 'course_id', select: 'course_code course_title' }
      });
      res.status(201).json(populated);
    } catch (error) {
      next(error);
    }
  }

  static async updateAssignment(req, res, next) {
    try {
      const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate({
          path: 'class_id',
          populate: { path: 'course_id', select: 'course_code course_title' }
        });
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async deleteAssignment(req, res, next) {
    try {
      await Assignment.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // ─── Lesson Plans ──────────────────────────────────────────────────────────

  static async getLessonPlans(req, res, next) {
    try {
      const lessonPlans = await LessonPlan.find().populate({
        path: 'class_id',
        populate: { path: 'course_id', select: 'course_code course_title' }
      });
      res.status(200).json(lessonPlans);
    } catch (error) {
      next(error);
    }
  }

  static async createLessonPlan(req, res, next) {
    try {
      const plan = await LessonPlan.create(req.body);
      const populated = await LessonPlan.findById(plan._id).populate({
        path: 'class_id',
        populate: { path: 'course_id', select: 'course_code course_title' }
      });
      res.status(201).json(populated);
    } catch (error) {
      next(error);
    }
  }

  static async updateLessonPlan(req, res, next) {
    try {
      const updated = await LessonPlan.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate({
          path: 'class_id',
          populate: { path: 'course_id', select: 'course_code course_title' }
        });
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async deleteLessonPlan(req, res, next) {
    try {
      await LessonPlan.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Lesson plan deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // ─── Materials ─────────────────────────────────────────────────────────────

  static async getMaterials(req, res, next) {
    try {
      const materials = await Material.find().populate({
        path: 'class_id',
        populate: { path: 'course_id', select: 'course_code course_title' }
      });
      res.status(200).json(materials);
    } catch (error) {
      next(error);
    }
  }

  static async createMaterial(req, res, next) {
    try {
      const material = await Material.create(req.body);
      const populated = await Material.findById(material._id).populate({
        path: 'class_id',
        populate: { path: 'course_id', select: 'course_code course_title' }
      });
      res.status(201).json(populated);
    } catch (error) {
      next(error);
    }
  }

  static async updateMaterial(req, res, next) {
    try {
      const updated = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate({
          path: 'class_id',
          populate: { path: 'course_id', select: 'course_code course_title' }
        });
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMaterial(req, res, next) {
    try {
      await Material.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Material deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InstructionController;

