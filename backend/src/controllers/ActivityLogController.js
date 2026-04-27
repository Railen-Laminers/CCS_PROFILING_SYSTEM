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

  // CHANGED: added date clamping and returns availableDateRange
  static async myLogs(req, res, next) {
    try {
      let { action, method, startDate, endDate, page, limit } = req.query;

      // Get user's actual log date range
      const { firstLogDate, lastLogDate } = await ActivityLogService.getUserLogDateRange(req.user._id);

      // Clamp startDate to firstLogDate if necessary
      if (startDate) {
        let start = new Date(startDate);
        if (firstLogDate && start < new Date(firstLogDate)) {
          startDate = firstLogDate;
        }
      }
      // Clamp endDate to lastLogDate if necessary
      if (endDate) {
        let end = new Date(endDate);
        if (lastLogDate && end > new Date(lastLogDate)) {
          endDate = lastLogDate;
        }
      }

      const result = await ActivityLogService.getLogs({
        userId: req.user._id,
        action,
        method,
        startDate,
        endDate,
        page,
        limit
      });

      // Attach the allowed range for the frontend to use in date pickers
      res.status(200).json({
        ...result,
        availableDateRange: {
          from: firstLogDate,
          to: lastLogDate
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // NEW: separate endpoint to get only the date range
  static async myDateRange(req, res, next) {
    try {
      const { firstLogDate, lastLogDate } = await ActivityLogService.getUserLogDateRange(req.user._id);
      res.status(200).json({ from: firstLogDate, to: lastLogDate });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivityLogController;