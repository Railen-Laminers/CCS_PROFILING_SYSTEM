const ActivityLogService = require('../services/ActivityLogService');

class ActivityLogController {
  static async index(req, res, next) {
    try {
      const { userId, action, method, startDate, endDate, page, limit } = req.query;

      const result = await ActivityLogService.getLogs({
        userId,
        action,
        method,
        startDate,
        endDate,
        page,
        limit
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async myLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const result = await ActivityLogService.getUserLogs(req.user._id, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivityLogController;
