const User = require('../models/User');
const Student = require('../models/Student');
const AcademicRecord = require('../models/AcademicRecord');

/**
 * Get aggregated analytics data for the reports dashboard.
 */
exports.getAnalytics = async (req, res) => {
  try {
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

    // Format enrollmentTrend for the chart
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedTrend = enrollmentTrend.map(item => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      students: item.count
    }));

    // 2. Department Distribution (CS vs IT)
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

    // 3. Grade Distribution Stats (A, B, C, D, F)
    const gradeDistribution = await Student.aggregate([
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

    // Ensure all grades exist even with 0 count
    const allGrades = ['A', 'B', 'C', 'D', 'F'].map(g => {
      const match = gradeDistribution.find(d => d.name === g);
      return { name: g, count: match ? match.count : 0 };
    });

    res.status(200).json({
      success: true,
      data: {
        enrollmentTrend: formattedTrend,
        departmentStats: departmentStats.filter(d => d.name), // filter out nulls
        gradeDistribution: allGrades
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
};
