import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  FiFileText, 
  FiTrendingUp, 
  FiCalendar, 
  FiCheckCircle,
  FiFilter,
  FiDownload,
  FiBook,
  FiUsers,
  FiBarChart2,
  FiCalendar as FiCalendarIcon,
  FiDownload as FiDownloadIcon
} from 'react-icons/fi';

const Reports = () => {
  const { primaryColor } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ['Overview', 'Academic', 'Attendance', 'Custom Reports'];

  const statCards = [
    { label: 'Total Reports', icon: FiFileText, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Avg. GPA', icon: FiTrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Attendance Rate', icon: FiCalendar, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: 'Pass Rate', icon: FiCheckCircle, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  const coursePerformance = []; // Empty array for dynamic data

  const studentStatusCards = [
    { label: "Dean's List", count: '0' },
    { label: 'Honors', count: '0' },
    { label: 'Probation', count: '0' },
  ];

  const attendanceCourses = []; // Empty array for dynamic data

  const customReports = []; // Empty array for dynamic data

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">View and analyze academic performance data</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <FiFilter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button 
            className="px-4 py-2 text-white rounded-lg flex items-center gap-2 hover:brightness-90 transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            <FiDownload className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">--</p>
                <p className="text-gray-500 mt-1">{card.label}</p>
              </div>
              <div className={`${card.bgColor} rounded-lg p-3`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-2 mb-6 shadow-sm">
        <div className="flex gap-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === index
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === index ? { backgroundColor: primaryColor } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Trend (Line Chart) */}
          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Enrollment Trend</h3>
            <div className="h-64 relative">
              {/* Chart Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-full h-full border-l-2 border-b-2 border-gray-300 relative">
                    {/* Y-axis labels */}
                    <div className="absolute -left-8 top-0 text-xs text-gray-400">100</div>
                    <div className="absolute -left-8 top-1/4 text-xs text-gray-400">75</div>
                    <div className="absolute -left-8 top-1/2 text-xs text-gray-400">50</div>
                    <div className="absolute -left-8 top-3/4 text-xs text-gray-400">25</div>
                    <div className="absolute -left-8 bottom-0 text-xs text-gray-400">0</div>
                    
                    {/* X-axis labels */}
                    <div className="absolute -bottom-6 left-0 text-xs text-gray-400">Jan</div>
                    <div className="absolute -bottom-6 left-1/5 text-xs text-gray-400">Feb</div>
                    <div className="absolute -bottom-6 left-2/5 text-xs text-gray-400">Mar</div>
                    <div className="absolute -bottom-6 left-3/5 text-xs text-gray-400">Apr</div>
                    <div className="absolute -bottom-6 left-4/5 text-xs text-gray-400">May</div>
                    <div className="absolute -bottom-6 right-0 text-xs text-gray-400">Jun</div>
                    
                    {/* No data placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">No data available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Students by Department (Pie Chart) */}
          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Students by Department</h3>
            <div className="h-64 flex items-center justify-center">
              {/* Pie Chart Placeholder */}
              <div className="relative">
                <div className="w-48 h-48 rounded-full border-4 border-gray-200 bg-gray-50 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No data available</p>
                </div>
                {/* Legend placeholder */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm text-gray-500">Department A</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm text-gray-500">Department B</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm text-gray-500">Department C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grade Distribution (Bar Chart) */}
          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h3>
            <div className="h-64 relative">
              {/* Bar Chart Placeholder */}
              <div className="absolute inset-0 flex items-end justify-around px-8 pb-8">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-gray-200"></div>
                  <div className="border-b border-gray-200"></div>
                  <div className="border-b border-gray-200"></div>
                  <div className="border-b border-gray-200"></div>
                  <div className="border-b border-gray-200"></div>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-around px-8">
                  <span className="text-sm text-gray-500 font-medium">A</span>
                  <span className="text-sm text-gray-500 font-medium">B</span>
                  <span className="text-sm text-gray-500 font-medium">C</span>
                  <span className="text-sm text-gray-500 font-medium">D</span>
                  <span className="text-sm text-gray-500 font-medium">F</span>
                </div>
                
                {/* No data placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No data available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="space-y-6">
          {/* Course Performance Card */}
          <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Course Performance</h2>
            
            {coursePerformance.length > 0 ? (
              <div className="space-y-4">
                {coursePerformance.map((course, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-20 text-sm font-medium text-gray-700">{course.code}</span>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${course.percentage}%`,
                          backgroundColor: primaryColor 
                        }}
                      />
                    </div>
                    <span className="w-12 text-sm font-medium text-gray-700 text-right">{course.percentage}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center gap-4 animate-pulse">
                    <div className="w-20 h-4 bg-gray-200 rounded" />
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gray-300"
                        style={{ width: `${Math.random() * 60 + 20}%` }}
                      />
                    </div>
                    <div className="w-12 h-4 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studentStatusCards.map((status, index) => (
              <div 
                key={index} 
                className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm text-center"
              >
                <p className="text-sm font-medium text-gray-500 mb-2">{status.label}</p>
                <p className="text-4xl font-bold text-gray-800 mb-1">{status.count}</p>
                <p className="text-sm text-gray-500">students</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Attendance by Course</h2>
          
          {attendanceCourses.length > 0 ? (
            <div className="h-80 relative">
              {/* Chart with data */}
              <div className="absolute inset-0 flex items-end justify-around px-8 pb-12 pt-8">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-8 pt-8 pb-12">
                  <div className="border-b border-dotted border-gray-300"></div>
                  <div className="border-b border-dotted border-gray-300"></div>
                  <div className="border-b border-dotted border-gray-300"></div>
                  <div className="border-b border-dotted border-gray-300"></div>
                  <div className="border-b border-dotted border-gray-300"></div>
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-8 bottom-12 flex flex-col justify-between text-xs text-gray-400">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                
                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-around px-16 pb-12 pt-8">
                  {attendanceCourses.map((course, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div 
                        className="w-12 rounded-t-lg transition-all duration-300"
                        style={{ 
                          height: `${course.attendance}%`,
                          backgroundColor: primaryColor 
                        }}
                      />
                      <span className="text-xs text-gray-500 font-medium">{course.code}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span className="text-sm text-gray-600">attendance</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 relative animate-pulse">
              {/* Skeleton loading state */}
              <div className="absolute inset-0 flex items-end justify-around px-8 pb-12 pt-8">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-8 pt-8 pb-12">
                  <div className="border-b border-dotted border-gray-300"></div>
                  <div className="border-b border-dotted border-gray-300"></div>
                  <div className="border-b border-dotted border-gray-300"></div>
                  <div className="border-b border-dotted border-gray-300"></div>
                  <div className="border-b border-dotted border-gray-300"></div>
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-8 bottom-12 flex flex-col justify-between text-xs text-gray-400">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                
                {/* Skeleton bars */}
                <div className="absolute inset-0 flex items-end justify-around px-16 pb-12 pt-8">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div 
                        className="w-12 bg-gray-300 rounded-t-lg"
                        style={{ height: `${Math.random() * 60 + 20}%` }}
                      />
                      <div className="w-12 h-3 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gray-300" />
                  <span className="text-sm text-gray-600">attendance</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Available Reports</h2>
          
          {customReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customReports.map((report, index) => (
                <div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${report.iconBg} rounded-lg p-3`}>
                      <report.icon className={`h-6 w-6 ${report.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{report.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                      <p className="text-xs text-gray-400 mt-2">Last generated: {report.lastGenerated}</p>
                    </div>
                    <button 
                      className="px-4 py-2 text-white rounded-lg flex items-center gap-2 hover:brightness-90 transition-colors"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <FiDownloadIcon className="h-4 w-4" />
                      <span>Generate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-200 rounded-lg p-3">
                      <div className="h-6 w-6 bg-gray-300 rounded" />
                    </div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="h-10 w-24 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
