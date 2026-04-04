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

        const avgGpaAggregation = await Student.aggregate([
            { $match: { gpa: { $ne: null } } },
            { $group: { _id: null, avgGpa: { $avg: '$gpa' } } }
        ]);
        const averageGpa = avgGpaAggregation.length > 0 ? avgGpaAggregation[0].avgGpa : 0;

        const gradeAggregation = await Student.aggregate([
            {
                $project: {
                    bin: {
                        $cond: [
                            { $gte: ['$gpa', 4.1] }, '4.1 - 5.0 (A)',
                            { $cond: [
                                { $gte: ['$gpa', 3.1] }, '3.1 - 4.0 (B)',
                                { $cond: [
                                    { $gte: ['$gpa', 2.1] }, '2.1 - 3.0 (C)',
                                    { $cond: [
                                        { $gte: ['$gpa', 1.1] }, '1.1 - 2.0 (D)', '0.0 - 1.0 (F)'
                                    ]}
                                ]}
                            ]}
                        ]
                    }
                }
            },
            {
                $group: { _id: '$bin', count: { $sum: 1 } }
            }
        ]);

        // Standardize output to include all buckets in order
        const buckets = [
            '4.1 - 5.0 (A)', 
            '3.1 - 4.0 (B)', 
            '2.1 - 3.0 (C)', 
            '1.1 - 2.0 (D)', 
            '0.0 - 1.0 (F)'
        ];
        const gradeDistribution = buckets.map(b => {
            const match = gradeAggregation.find(d => d._id === b);
            return { name: b, count: match ? match.count : 0 };
        });

        // 5. Top 5 Performing Students
        const topStudents = await Student.aggregate([
            { $match: { gpa: { $ne: null } } },
            { $sort: { gpa: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    _id: 0,
                    firstname: '$userDetails.firstname',
                    lastname: '$userDetails.lastname',
                    gpa: 1,
                    program: 1,
                    year_level: 1
                }
            }
        ]);

        // 6. Academic Standing Counts
        const academicStatsAggregation = await Student.aggregate([
            {
                $group: {
                  _id: null,
                  deansList: { $sum: { $cond: [{ $gte: ['$gpa', 3.5] }, 1, 0] } },
                  honors: { $sum: { $cond: [{ $and: [{ $gte: ['$gpa', 3.0] }, { $lt: ['$gpa', 3.5] }] }, 1, 0] } },
                  probation: { $sum: { $cond: [{ $lt: ['$gpa', 2.0] }, 1, 0] } }
                }
            }
        ]);
        const academicStats = academicStatsAggregation.length > 0 
            ? academicStatsAggregation[0] 
            : { deansList: 0, honors: 0, probation: 0 };

        return {
            enrollmentTrend: formattedTrend,
            departmentStats: departmentStats.filter(d => d.name),
            gradeDistribution,
            averageGpa,
            topStudents,
            academicStats
        };
    }
}

module.exports = new ReportsService();
