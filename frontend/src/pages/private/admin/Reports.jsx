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
import { EmptyState } from '../../../components/ui/EmptyState';

const StatCards = ({ statCards }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {statCards.map((card, index) => (
      <Card key={index} className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">--</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-1">{card.label}</p>
            </div>
            <div className={`${card.bgColor} rounded-xl p-3 shadow-inner bg-opacity-10 dark:bg-opacity-10`}>
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
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ['Overview', 'Academic', 'Attendance', 'Custom Reports'];

  const statCards = [
    { label: 'Total Reports', icon: FiFileText, color: 'text-blue-600', bgColor: 'bg-blue-500' },
    { label: 'Avg. GPA', icon: FiTrendingUp, color: 'text-green-600', bgColor: 'bg-green-500' },
    { label: 'Attendance Rate', icon: FiCalendar, color: 'text-orange-600', bgColor: 'bg-orange-500' },
    { label: 'Pass Rate', icon: FiCheckCircle, color: 'text-purple-600', bgColor: 'bg-purple-500' },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Reports & Analytics</h1>
          <p className="text-[14px] text-gray-500 dark:text-zinc-500 mt-1">View and analyze academic performance data</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="ghost" className="flex-1 sm:flex-none gap-2 h-10 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-zinc-400 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252525]">
            <FiFilter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button className="flex-1 sm:flex-none gap-2 h-10 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 px-6">
            <FiDownload className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
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
            <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <CardTitle className="text-[16px] font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <FiActivity className="w-4 h-4 text-blue-500" />
                  </div>
                  Enrollment Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72 p-0">
                <EmptyState 
                  icon={<FiActivity className="w-10 h-10 text-gray-300 dark:text-zinc-700" />} 
                  title="Aggregation pending..."
                  className="h-full bg-transparent shadow-none"
                />
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <CardTitle className="text-[16px] font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
                  <div className="bg-green-500/10 p-2 rounded-lg">
                    <FiBarChart2 className="w-4 h-4 text-green-500" />
                  </div>
                  Students by Department
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72 p-0">
                <EmptyState 
                  icon={<FiPieChart className="w-10 h-10 text-gray-300 dark:text-zinc-700" />} 
                  title="No department data found"
                  className="h-full bg-transparent shadow-none"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <CardTitle className="text-[16px] font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
                  <div className="bg-orange-500/10 p-2 rounded-lg">
                    <FiTrendingUp className="w-4 h-4 text-orange-500" />
                  </div>
                  Grade Distribution Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80 p-0">
                <EmptyState 
                  icon={<FiBarChart2 className="w-12 h-12 text-gray-300 dark:text-zinc-700" />} 
                  title="Chart will be displayed once grades are released"
                  className="h-full bg-transparent shadow-none"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-8">
            <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-[17px] font-bold">Course Performance metrics</CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="space-y-8">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-800 dark:text-zinc-200 bg-gray-50 dark:bg-zinc-800/50 px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-700">CS-10{index + 1} - Core Curriculum</span>
                        <Badge variant="outline" className="text-[11px] font-bold text-gray-400">NOT CALCULATED</Badge>
                      </div>
                      <div className="h-2.5 bg-gray-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800">
                        <div 
                          className="h-full bg-brand-500/30 dark:bg-brand-500/20 rounded-full"
                          style={{ width: `${Math.random() * 20 + 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Dean\'s List', color: 'text-brand-500', icon: FiActivity },
                { label: 'Honors', color: 'text-blue-500', icon: FiTrendingUp },
                { label: 'Probation', color: 'text-red-500', icon: FiInfo }
              ].map((item, index) => (
                <Card key={index} className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl text-center hover:shadow-md transition-shadow group">
                  <CardContent className="pt-8 pb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 mb-4 group-hover:scale-110 transition-transform">
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-[0.2em]">{item.label}</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white mt-3 tracking-tighter">0</p>
                    <p className="text-[13px] text-gray-400 dark:text-zinc-500 font-medium mt-2">Active Students</p>
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
                icon={<FiCalendar className="w-14 h-14 text-gray-300 dark:text-zinc-700" />} 
                title="Populating attendance records..."
                description="Records will be synchronized once classes are in progress."
                className="h-full bg-transparent shadow-none"
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
                <Card key={index} className="bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-5">
                      <div className="bg-brand-500/10 p-3.5 rounded-2xl group-hover:scale-110 transition-transform flex items-center justify-center border border-brand-500/20">
                        <FiFileText className="h-6 w-6 text-brand-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[16px] font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">Analytical report v{index + 1}.0</h3>
                        <p className="text-[14px] text-gray-500 dark:text-zinc-500 mt-1 lines-clamp-2">Standardized report generated based on the current academic period metrics.</p>
                        <div className="mt-6 flex items-center gap-3">
                           <Button className="h-9 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[12px] font-bold px-6 shadow-sm active:scale-95 transition-all">
                             <FiDownload className="w-3.5 h-3.5 mr-2" />
                             Generate Report
                           </Button>
                           <Button variant="ghost" className="h-9 text-gray-400 hover:text-gray-900 dark:hover:text-white text-[12px] font-bold px-4">Preview</Button>
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
