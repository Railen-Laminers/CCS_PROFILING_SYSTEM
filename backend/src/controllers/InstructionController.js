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
        });
      res.status(200).json(classes);
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
      const lessonPlans = await LessonPlan.find().populate('class_id');
      res.status(200).json(lessonPlans);
    } catch (error) {
      next(error);
    }
  }

  static async getMaterials(req, res, next) {
    try {
      const materials = await Material.find().populate('class_id');
      res.status(200).json(materials);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InstructionController;
