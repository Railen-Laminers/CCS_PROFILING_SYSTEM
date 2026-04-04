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
  FiActivity,
  FiPieChart,
  FiInfo
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import { useReports } from '../../../hooks/useReports';
import { EnrollmentTrendChart, DepartmentDistributionChart, GradeDistributionChart } from '../../../components/charts/ReportCharts';

import { FiRefreshCw } from 'react-icons/fi';

const StatCards = ({ statCards }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {statCards.map((card, index) => (
      <Card key={index} className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{card.value}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-1">{card.label}</p>
            </div>
            <div className={`${card.bgColor} rounded-xl p-3 shadow-inner`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex space-x-2 mb-8 overflow-x-auto p-2 bg-gray-100 dark:bg-[#252525] rounded-[1.25rem] border border-gray-200 dark:border-gray-800 scrollbar-hide shadow-inner relative overflow-hidden">
    {tabs.map((tab, index) => (
      <button
        key={index}
        onClick={() => setActiveTab(index)}
        className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all rounded-[1.25rem] relative z-10 focus:outline-none ${
          activeTab === index
            ? 'bg-white dark:bg-[#1E1E1E] text-brand-600 dark:text-brand-500 shadow-sm ring-1 ring-zinc-200 dark:ring-white/10 backdrop-blur-md'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-[#2C2C2C]'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const Reports = () => {
  const { primaryColor } = useTheme();
  const { analyticsData, loading, error, refresh } = useReports();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Overview', 'Academic', 'Attendance', 'Custom Reports'];

  const statCards = [
    { label: 'Total Students', icon: FiFileText, color: 'text-blue-600', bgColor: 'bg-blue-100', value: analyticsData.enrollmentTrend?.reduce((acc, curr) => acc + curr.students, 0) || 0 },
    { label: 'Avg. GPA', icon: FiTrendingUp, color: 'text-green-600', bgColor: 'bg-green-100', value: analyticsData.averageGpa ? analyticsData.averageGpa.toFixed(2) : '0.00' },
    { label: 'Attendance Rate', icon: FiCalendar, color: 'text-orange-600', bgColor: 'bg-orange-100', value: 'N/A' },
    { label: 'Pass Rate', icon: FiCheckCircle, color: 'text-purple-600', bgColor: 'bg-purple-100', value: 'N/A' },
];

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl">
        <FiInfo className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        <button onClick={refresh} className="mt-4 text-sm font-bold text-brand-500 hover:underline">Try Again</button>
      </div>
    );
  }


  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Reports & Analytics</h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-[#252525] shadow-sm transition-all active:scale-95 disabled:opacity-50 flex-1 sm:flex-none justify-center"
          >
            <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-[#252525] shadow-sm transition-all active:scale-95 disabled:opacity-50 flex-1 sm:flex-none justify-center">
            <FiFilter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button
            className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 flex-1 sm:flex-none justify-center"
          >
            <span className="relative z-10 flex items-center gap-2">
              <FiDownload className="h-4 w-4" /> Export Data
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatCards statCards={statCards} />

      {/* Navigation Tabs */}
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <FiActivity className="w-4 h-4 text-blue-500" />
                  </div>
                  Student Registration History
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72 p-6">
                {analyticsData.enrollmentTrend?.length > 0 ? (
                  <EnrollmentTrendChart data={analyticsData.enrollmentTrend} />
                ) : (
                  <EmptyState 
                    size="md"
                    icon={FiActivity} 
                    title={loading ? "Loading data..." : "No registration history data"}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                  <div className="bg-green-500/10 p-2 rounded-lg">
                    <FiBarChart2 className="w-4 h-4 text-green-500" />
                  </div>
                  Students by Department
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72 p-6">
                {analyticsData.departmentStats?.length > 0 ? (
                  <DepartmentDistributionChart data={analyticsData.departmentStats} />
                ) : (
                  <EmptyState 
                    size="md"
                    icon={FiPieChart} 
                    title={loading ? "Loading data..." : "No department distribution data"}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl lg:col-span-2 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                  <div className="bg-orange-500/10 p-2 rounded-lg">
                    <FiTrendingUp className="w-4 h-4 text-orange-500" />
                  </div>
                  Grade Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80 p-6">
                {analyticsData.gradeDistribution?.length > 0 ? (
                  <GradeDistributionChart data={analyticsData.gradeDistribution} />
                ) : (
                  <EmptyState 
                    size="md"
                    icon={FiBarChart2} 
                    title={loading ? "Loading data..." : "No grade distribution data"}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-8">
            <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <CardTitle className="text-[17px] font-bold flex items-center gap-3">
                  <div className="bg-brand-500/10 p-2 rounded-lg">
                    <FiTrendingUp className="w-4 h-4 text-brand-500" />
                  </div>
                  Top Performing Students (Top 5)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {analyticsData.topStudents?.length > 0 ? (
                    analyticsData.topStudents.map((student, index) => (
                      <div key={index} className="space-y-3 group">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-gray-700">
                              #{index + 1}
                            </span>
                            <div>
                              <p className="font-bold text-gray-800 dark:text-zinc-200">{student.firstname} {student.lastname}</p>
                              <p className="text-[11px] text-zinc-500 uppercase tracking-wider">{student.program} • Year {student.year_level}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[12px] font-black border-brand-500/50 text-brand-500 bg-brand-500/5 px-2 py-1">
                            {student.gpa?.toFixed(2)} GPA
                          </Badge>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800/50">
                          <div 
                            className="h-full bg-brand-500 rounded-full transition-all duration-1000 ease-out group-hover:bg-brand-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                            style={{ width: `${(student.gpa / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState 
                      size="sm"
                      icon={FiTrendingUp} 
                      title="No academic records yet"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Dean\'s List (GPA 3.5+)', color: 'text-brand-500', icon: FiActivity, value: analyticsData.academicStats?.deansList || 0 },
                { label: 'Honors (GPA 3.0-3.49)', color: 'text-blue-500', icon: FiTrendingUp, value: analyticsData.academicStats?.honors || 0 },
                { label: 'Probation (GPA < 2.0)', color: 'text-red-500', icon: FiInfo, value: analyticsData.academicStats?.probation || 0 }
              ].map((item, index) => (
                <Card key={index} className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl text-center hover:shadow-md transition-shadow group">
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 mb-3 group-hover:scale-110 transition-transform">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest">{item.label}</p>
                      <p className="text-2xl font-black text-gray-900 dark:text-white mt-1 tracking-tight">{item.value}</p>
                      <p className="text-[12px] text-gray-400 dark:text-zinc-500 font-medium mt-1">Active Students</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-[17px] font-bold">Attendance Analytics by Course</CardTitle>
            </CardHeader>
            <CardContent className="h-96 p-0">
              <EmptyState 
                size="md"
                icon={FiCalendar} 
                title="Populating records..."
                description="Records will be synchronized once classes are in progress."
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Available Report Templates</h2>
              <Button size="sm" variant="ghost" className="text-brand-500 font-bold text-xs uppercase tracking-widest hover:bg-brand-500/10">Browse Library</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-5">
                      <div className="bg-brand-500/10 p-3.5 rounded-2xl group-hover:scale-110 transition-transform flex items-center justify-center border border-brand-500/20">
                        <FiFileText className="h-6 w-6 text-brand-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[16px] font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">Analytical report v{index + 1}.0</h3>
                        <p className="text-[14px] text-gray-500 dark:text-zinc-500 mt-1 lines-clamp-2">Standardized report generated based on the current academic period metrics.</p>
                        <div className="mt-6 flex items-center gap-3">
                           <button
                             className="relative group overflow-hidden rounded-xl bg-brand-500 px-6 py-2 text-[12px] font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                           >
                             <span className="relative z-10 flex items-center gap-2">
                               <FiDownload className="w-3.5 h-3.5" /> Generate Report
                             </span>
                             <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
                           </button>
                           <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-[12px] font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-none transition-all active:scale-95">
                             Preview
                           </button>
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
