const AcademicRecordService = require('../services/AcademicRecordService');

class AcademicRecordController {
  /**
   * Fetch all academic records for a given student (by user_id/student_id)
   */
  static async index(req, res, next) {
    try {
      const { userId } = req.params;
      const result = await AcademicRecordService.getByUserId(userId);

      if (!result.found) {
        return res.status(404).json({
          message: 'Student profile not found.'
        });
      }

      res.status(200).json({
        academic_records: result.records
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Store a newly created academic record
   */
  static async store(req, res, next) {
    try {
      const { userId } = req.params;
      const result = await AcademicRecordService.create(userId, req.body);

      if (!result.found) {
        return res.status(404).json({
          message: 'Student profile not found.'
        });
      }

      res.status(201).json({
        message: 'Academic record created.',
        academic_record: result.record
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Display the specified resource
   */
  static async show(req, res, next) {
    try {
      const { id } = req.params;
      const record = await AcademicRecordService.findById(id);

      if (!record) {
        return res.status(404).json({
          message: 'Record not found.'
        });
      }

      res.status(200).json({
        academic_record: record
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the specified resource in storage
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const record = await AcademicRecordService.update(id, req.body);

      if (!record) {
        return res.status(404).json({
          message: 'Record not found.'
        });
      }

      res.status(200).json({
        message: 'Academic record updated.',
        academic_record: record
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove the specified resource from storage
   */
  static async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await AcademicRecordService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          message: 'Record not found.'
        });
      }

      res.status(200).json({
        message: 'Academic record deleted.'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AcademicRecordController;
