const StudentSearchService = require('../services/StudentSearchService');

class StudentSearchController {
  /**
   * Paginated search with full filtering support
   */
  static async search(req, res, next) {
    try {
      const result = await StudentSearchService.search(req.query);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * List distinct sports from students' sports_activities JSON
   */
  static async sports(req, res, next) {
    try {
      const sports = await StudentSearchService.getDistinctSports();

      res.status(200).json({
        sports
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List distinct organizations (clubs) from students' organizations JSON
   */
  static async organizations(req, res, next) {
    try {
      const organizations = await StudentSearchService.getDistinctOrganizations();

      res.status(200).json({
        organizations
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StudentSearchController;
