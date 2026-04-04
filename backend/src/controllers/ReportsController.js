const reportsService = require('../services/ReportsService');

/**
 * Controller to handle analytics reporting for the admin dashboard.
 */
exports.getAnalytics = async (req, res) => {
    try {
        const stats = await reportsService.getAnalyticsStats();

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching analytics in ReportsController:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics data',
            error: error.message
        });
    }
};
