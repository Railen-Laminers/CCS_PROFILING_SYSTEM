const AcademicRecord = require('../models/AcademicRecord');
const Student = require('../models/Student');
const Class = require('../models/Class');

class AcademicRecordService {
  /**
   * Get all academic records for a student by user_id
   */
  static async getByUserId(userId) {
    const student = await Student.findOne({ user_id: userId });

    if (!student) {
      return { found: false };
    }

    const records = await AcademicRecord.find({ student_id: student._id })
      .sort({ createdAt: -1 });

    if (student.section && records.length > 0) {
      const latestRecord = records[0];
      
      const classes = await Class.find({ section: student.section }).populate('course_id', 'course_title');
      const sectionSubjects = [...new Set(classes
        .filter(c => c.course_id)
        .map(c => c.course_id.course_title))];

      if (sectionSubjects.length > 0) {
        const currentStored = latestRecord.current_subjects || [];
        const needsUpdate = sectionSubjects.length !== currentStored.length || 
                           !sectionSubjects.every(s => currentStored.includes(s));

        if (needsUpdate) {
          latestRecord.current_subjects = sectionSubjects;
          await latestRecord.save();
          
          student.current_subjects = sectionSubjects;
          await student.save();
        }
      }
    }

    return {
      found: true,
      records
    };
  }

  /**
   * Create an academic record for a student by user_id
   */
  static async create(userId, data) {
    const student = await Student.findOne({ user_id: userId });

    if (!student) {
      return { found: false };
    }

    const record = await AcademicRecord.create({
      student_id: student._id,
      ...data
    });

    return {
      found: true,
      record
    };
  }

  /**
   * Find an academic record by ID
   */
  static async findById(id) {
    return await AcademicRecord.findById(id);
  }

  /**
   * Update an academic record
   */
  static async update(id, data) {
    const record = await AcademicRecord.findById(id);

    if (!record) {
      return null;
    }

    Object.assign(record, data);
    await record.save();
    return record;
  }

  /**
   * Delete an academic record
   */
  static async delete(id) {
    const record = await AcademicRecord.findById(id);

    if (!record) {
      return false;
    }

    await record.deleteOne();
    return true;
  }
}

module.exports = AcademicRecordService;
