import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  FiFileText, 
  FiTrendingUp, 
  FiCalendar, 
  FiCheckCircle,
  FiFilter,
  FiDownload,
  FiBarChart2,
  FiActivity
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

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

  const coursePerformance = [];
  const attendanceCourses = [];
  const customReports = [];

  const renderEmptyState = (message = "No data available") => (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
      <div className="bg-gray-100 dark:bg-zinc-800/50 p-4 rounded-full mb-4">
        <FiBarChart2 className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500 dark:text-zinc-400 font-medium">{message}</p>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">View and analyze academic performance data</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none gap-2">
            <FiFilter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button className="flex-1 sm:flex-none gap-2">
            <FiDownload className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <Card key={index} className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 mt-1">{card.label}</p>
                </div>
                <div className={`${card.bgColor} dark:bg-opacity-10 p-3 rounded-xl`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-100/50 dark:bg-zinc-900/50 p-1.5 rounded-xl flex gap-1">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === index
                ? 'bg-white dark:bg-zinc-800 text-brand-500 shadow-sm'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiActivity className="w-5 h-5 text-blue-500" />
                  Enrollment Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {renderEmptyState()}
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiBarChart2 className="w-5 h-5 text-green-500" />
                  Students by Department
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {renderEmptyState()}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-lg">Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {renderEmptyState()}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-6">
            <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Course Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-700 dark:text-zinc-300">CS-10{index + 1}</span>
                        <span className="text-gray-500 dark:text-zinc-400">Not available</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-200 dark:bg-zinc-700 rounded-full animate-pulse"
                          style={{ width: `${Math.random() * 40 + 30}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Dean\'s List', 'Honors', 'Probation'].map((label, index) => (
                <Card key={index} className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50 text-center">
                  <CardContent className="pt-6">
                    <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">{label}</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">0</p>
                    <p className="text-xs text-brand-500 font-medium mt-1">Students</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-lg">Attendance by Course</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              {renderEmptyState("Attendance data will be populated once classes begin")}
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Available Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-brand-500/10 p-3 rounded-xl">
                        <FiFileText className="h-6 w-6 text-brand-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">Report Template {index + 1}</h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Generated analytics for the current academic period.</p>
                        <div className="mt-4 flex items-center gap-3">
                           <Button size="sm" variant="outline" className="gap-2">
                             <FiDownload className="w-3.5 h-3.5" />
                             Generate
                           </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
