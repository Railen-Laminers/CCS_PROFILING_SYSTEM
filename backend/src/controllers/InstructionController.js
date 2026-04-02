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
