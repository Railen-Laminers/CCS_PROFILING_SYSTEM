import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiFileText, 
  FiTrendingUp, 
  FiCalendar, 
  FiCheckCircle,
  FiFilter,
  FiDownload
} from 'react-icons/fi';

const AcademicAnalytics = () => {
  const { primaryColor } = useTheme();
  const [activeTab, setActiveTab] = useState(1); // Academic tab is active

  const tabs = ['Overview', 'Academic', 'Attendance', 'Custom Reports'];

  const statCards = [
    { label: 'Total Reports', icon: FiFileText, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Avg. GPA', icon: FiTrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Attendance Rate', icon: FiCalendar, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: 'Pass Rate', icon: FiCheckCircle, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  const coursePerformance = []; // Empty array for dynamic data

  const studentStatusCards = [
    { label: "Dean's List", count: '--' },
    { label: 'Honors', count: '--' },
    { label: 'Probation', count: '--' },
  ];

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

      {/* Main Content */}
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
    </div>
  );
};

export default AcademicAnalytics;
