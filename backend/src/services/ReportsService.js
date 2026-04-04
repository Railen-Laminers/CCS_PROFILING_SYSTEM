const User = require('../models/User');
const Student = require('../models/Student');
const AcademicRecord = require('../models/AcademicRecord');

/**
 * Service to handle data aggregation and analytics for the reports module.
 */
class ReportsService {
    /**
     * Aggregates and returns analytics data: enrollment trends, department stats, and grade distribution.
     * @returns {Promise<Object>} Formatted analytics data.
     */
    async getAnalyticsStats() {
        // 1. Enrollment Trend (Monthly Registrations for past 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const enrollmentTrend = await User.aggregate([
            {
                $match: {
                    role: 'student',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedTrend = enrollmentTrend.map(item => ({
            name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
            students: item.count
        }));

        // 2. Department Distribution
        const departmentStats = await Student.aggregate([
            {
                $group: {
                    _id: '$program',
                    value: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: '$_id',
                    value: 1,
                    _id: 0
                }
            }
        ]);

        // 3. Grade Distribution (Categorized by GPA)
        const gradeAggregation = await Student.aggregate([
            {
                $project: {
                    grade: {
                        $cond: [
                            { $gte: ['$gpa', 3.5] }, 'A',
                            { $cond: [
                                { $gte: ['$gpa', 3.0] }, 'B',
                                { $cond: [
                                    { $gte: ['$gpa', 2.5] }, 'C',
                                    { $cond: [
                                        { $gte: ['$gpa', 2.0] }, 'D', 'F'
                                    ]}
                                ]}
                            ]}
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$grade',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // Standardize output to include all grade buckets
        const gradeDistribution = ['A', 'B', 'C', 'D', 'F'].map(g => {
            const match = gradeAggregation.find(d => d.name === g);
            return { name: g, count: match ? match.count : 0 };
        });

        return {
            enrollmentTrend: formattedTrend,
            departmentStats: departmentStats.filter(d => d.name),
            gradeDistribution
        };
    }
}

module.exports = new ReportsService();
