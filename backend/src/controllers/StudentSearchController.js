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

  /**
   * List distinct skills from students' sports_activities JSON
   */
  static async skills(req, res, next) {
    try {
      const skills = await StudentSearchService.getDistinctSkills();

      res.status(200).json({
        skills
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List distinct sections from students
   */
  static async sections(req, res, next) {
    try {
      const { program, year_level } = req.query;
      const sections = await StudentSearchService.getDistinctSections(program, year_level);
      res.status(200).json({ sections });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get the count of active students in a specific section
   */
  static async sectionCount(req, res, next) {
    try {
      const { section } = req.query;
      if (!section) {
        return res.status(400).json({ message: 'Section query parameter is required.' });
      }
      const count = await StudentSearchService.getStudentCountBySection(section);
      res.status(200).json({ section, count });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StudentSearchController;
