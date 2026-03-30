const FacultySearchService = require('../services/FacultySearchService');

class FacultySearchController {
  /**
   * Paginated search for faculty with full filtering support
   */
  static async search(req, res, next) {
    try {
      const result = await FacultySearchService.search(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * List distinct departments from faculty entries
   */
  static async departments(req, res, next) {
    try {
      const departments = await FacultySearchService.getDistinctDepartments();
      res.status(200).json({ departments });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List distinct positions/ranks from faculty entries
   */
  static async positions(req, res, next) {
    try {
      const positions = await FacultySearchService.getDistinctPositions();
      res.status(200).json({ positions });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FacultySearchController;
