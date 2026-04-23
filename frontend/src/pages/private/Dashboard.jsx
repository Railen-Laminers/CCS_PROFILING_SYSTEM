import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import useDashboardStats from '../../hooks/useDashboardStats';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiActivity,
  FiAward,
  FiBookOpen,
  FiHeart,
  FiAlertTriangle,
  FiPieChart,
  FiBarChart2
} from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import EmptyState from '@/components/ui/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    studentCount, facultyCount, courseCount, eventCount,
    sportsCount, orgCount, medicalCount, disciplinaryCount,
    academicData, participationData, courseDistribution,
    loading: countsLoading
  } = useDashboardStats(user?.role);

  const recentActivities = [
    { id: 1, type: 'enrollment', message: 'New student John Doe enrolled in BS CS', time: '2 hours ago', icon: FiUsers, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 2, type: 'event', message: 'CCS Week schedule updated', time: '5 hours ago', icon: FiCalendar, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { id: 3, type: 'achievement', message: 'Team Alpha won 1st Place in Hackathon', time: '1 day ago', icon: FiAward, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { id: 4, type: 'academic', message: 'Midterm grades submitted by 80% of faculty', time: '2 days ago', icon: FiBookOpen, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { id: 5, type: 'system', message: 'System maintenance completed successfully', time: '3 days ago', icon: FiActivity, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ];

  const COLORS = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];

  if (!user) {
    return <div className="p-6 text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  // Formatting tooltips
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {payload[0].name}: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
      </div>

      {user.role === 'admin' && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Students */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {countsLoading ? '...' : studentCount !== null ? studentCount.toLocaleString() : '0'}
                </p>
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-1">Total Students</p>
              </div>
              <div className="bg-blue-100 rounded-xl p-3 shadow-inner">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            {/* Faculty */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {countsLoading ? '...' : facultyCount !== null ? facultyCount.toLocaleString() : '0'}
                </p>
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-1">Total Faculty</p>
              </div>
              <div className="bg-green-100 rounded-xl p-3 shadow-inner">
                <HiOutlineAcademicCap className="h-6 w-6 text-green-600" />
              </div>
            </div>

            {/* Events */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {countsLoading ? '...' : eventCount !== null ? eventCount.toLocaleString() : '0'}
                </p>
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-1">Total Events</p>
              </div>
              <div className="bg-orange-100 rounded-xl p-3 shadow-inner">
                <FiCalendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>

            {/* Active Courses */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {countsLoading ? '...' : courseCount !== null ? courseCount.toLocaleString() : '0'}
                </p>
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-1">Active Courses</p>
              </div>
              <div className="bg-indigo-100 rounded-xl p-3 shadow-inner">
                <FiBookOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>

            {/* Students in Sports */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {countsLoading ? '...' : sportsCount !== null ? sportsCount.toLocaleString() : '0'}
                </p>
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-1">Students in Sports</p>
              </div>
              <div className="bg-yellow-100 rounded-xl p-3 shadow-inner">
                <FiAward className="h-6 w-6 text-yellow-600" />
              </div>
            </div>

            {/* Students in Organizations */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {countsLoading ? '...' : orgCount !== null ? orgCount.toLocaleString() : '0'}
                </p>
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-1">In Organizations</p>
              </div>
              <div className="bg-purple-100 rounded-xl p-3 shadow-inner">
                <FiUserCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>

            {/* Medical Records */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {countsLoading ? '...' : medicalCount !== null ? medicalCount.toLocaleString() : '0'}
                </p>
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-1">Medical Records</p>
              </div>
              <div className="bg-rose-100 rounded-xl p-3 shadow-inner">
                <FiHeart className="h-6 w-6 text-rose-600" />
              </div>
            </div>

            {/* Disciplinary Records */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {countsLoading ? '...' : disciplinaryCount !== null ? disciplinaryCount.toLocaleString() : '0'}
                </p>
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-1">Disciplinary Records</p>
              </div>
              <div className="bg-amber-100 rounded-xl p-3 shadow-inner">
                <FiAlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Main Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Charts) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Row 1: Academic & Participation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Academic Performance Chart */}
                <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm min-w-0">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Academic Performance</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Average GPA by Year Level</p>
                  </div>
                  <div className="h-64">
                    {academicData.some(d => d.gpa > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={academicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Bar dataKey="gpa" fill="#FF6B00" radius={[4, 4, 0, 0]} barSize={48} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState 
                        size="md"
                        icon={FiBarChart2}
                        title="No GPA data recorded"
                        description="Complete academic records to see performance trends"
                        className="border-none shadow-none bg-transparent py-0"
                      />
                    )}
                  </div>
                </div>

                {/* Student Participation Pie Chart */}
                <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm min-w-0">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Student Participation</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Extracurricular involvement</p>
                  </div>
                  <div className="h-64">
                    {participationData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                          <Pie
                            data={participationData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            labelLine={true}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }) => {
                              const RADIAN = Math.PI / 180;
                              const radius = outerRadius + 25;
                              const x = cx + radius * Math.cos(-midAngle * RADIAN);
                              const y = cy + radius * Math.sin(-midAngle * RADIAN);
                              return (
                                <text 
                                  x={x} 
                                  y={y} 
                                  fill={COLORS[index % COLORS.length]} 
                                  textAnchor={x > cx ? 'start' : 'end'} 
                                  dominantBaseline="central"
                                  className="text-[10px] font-bold"
                                >
                                  {`${name} ${(percent * 100).toFixed(0)}%`}
                                </text>
                              );
                            }}
                          >
                            {participationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState 
                        size="md"
                        icon={FiPieChart}
                        title="No participation data"
                        description="Extracurricular involvement will appear here"
                        className="border-none shadow-none bg-transparent py-0"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Course Distribution Chart */}
              <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm min-w-0">
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Course Distribution</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total enrolled students per course</p>
                </div>
                <div className="h-64">
                  {courseDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={courseDistribution} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.2} />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} width={50} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Bar dataKey="students" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState 
                      size="md"
                      icon={FiBarChart2}
                      title="No student distribution data"
                      description="Enrolled students per program will be shown here"
                      className="border-none shadow-none bg-transparent py-0"
                    />
                  )}
                </div>
              </div>

            </div>

            {/* Right Column (Recent Activities) */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm h-full flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">System updates and logs</p>
                  </div>
                  <button className="text-xs text-brand-600 dark:text-brand-500 font-medium hover:underline">View All</button>
                </div>

                <div className="flex-1 overflow-hidden relative">
                  <div className="absolute top-4 bottom-4 left-5 w-px bg-gray-200 dark:bg-gray-800"></div>
                  <div className="space-y-6 relative z-10">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.bg}`}>
                          <activity.icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="pt-1">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
