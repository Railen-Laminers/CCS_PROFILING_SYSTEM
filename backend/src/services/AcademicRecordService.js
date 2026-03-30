const AcademicRecord = require('../models/AcademicRecord');
const Student = require('../models/Student');

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
