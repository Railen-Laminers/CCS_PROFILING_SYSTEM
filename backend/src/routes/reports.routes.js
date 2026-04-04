const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/ReportsController');

/**
 * Route: GET /api/reports/analytics
 * Description: Get aggregated data for the charts in the analytics dashboard.
 */
router.get('/analytics', reportsController.getAnalytics);

module.exports = router;
