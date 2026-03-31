import React from 'react';
import { 
  FiBookOpen, 
  FiFileText, 
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiUsers,
  FiPlus
} from 'react-icons/fi';
import useInstruction from '@/hooks/useInstruction';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { FiSearch } from 'react-icons/fi';

const StatCards = ({ statCards }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {statCards.map((card, index) => (
      <Card key={index} className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{card.count}</p>
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

const ClassItem = ({ cls }) => (
  <Card className="bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
    <CardContent className="p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-brand-500 text-white font-bold px-4 py-1.5 rounded-xl text-sm shadow-sm ring-1 ring-white/10">
            {cls.courseCode}
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors line-clamp-1 leading-tight">
              {cls.courseCode} - {cls.courseTitle}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <FiUsers className="w-4 h-4 text-gray-500" />
              <p className="text-[14px] font-medium text-gray-500 dark:text-zinc-500">
                {cls.studentsEnrolled || 35} students enrolled
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-12 flex-1 max-w-2xl px-6 border-l border-gray-100 dark:border-gray-800 ml-6 hidden lg:grid">
          <div className="flex items-center gap-3 text-gray-600 dark:text-zinc-400">
            <FiClock className="w-4 h-4 text-brand-500" />
            <span className="text-[14px] font-semibold">{cls.schedule}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-zinc-400">
            <FiMapPin className="w-4 h-4 text-brand-500" />
            <span className="text-[14px] font-semibold">{cls.room}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-zinc-400">
            <FiUser className="w-4 h-4 text-brand-500" />
            <span className="text-[14px] font-semibold truncate">{cls.instructor}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button 
            className="h-9 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[13px] font-semibold transition-all px-6 active:scale-95 shadow-sm"
          >
            Details
          </Button>
          <Button variant="outline" className="h-9 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-[#333] hover:text-brand-500 rounded-lg text-[13px] font-semibold px-6 transition-all active:scale-95">
            Manage
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AssignmentItem = ({ assignment }) => (
  <Card className="bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
    <CardContent className="p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className={`p-2.5 rounded-lg border shadow-sm ${assignment.status === 'open' ? 'bg-green-500/10 border-green-500/20' : 'bg-gray-500/10 border-gray-500/20'}`}>
            <FiFileText className={`w-[18px] h-[18px] ${assignment.status === 'open' ? 'text-green-500' : 'text-gray-500'}`} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors">
                {assignment.title}
              </h3>
              <Badge className={`${assignment.status === 'open' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-zinc-500/20 text-zinc-500 border-zinc-500/30'} rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
                {assignment.status}
              </Badge>
            </div>
            <p className="text-[14px] text-gray-500 dark:text-zinc-500 mt-0.5">Course: <span className="text-brand-500 font-semibold">{assignment.class_id?.course_id?.course_code || 'N/A'}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-12 ml-6">
          <div className="flex items-center gap-2.5 text-gray-500 dark:text-zinc-400">
            <FiCalendar className="w-4 h-4 text-brand-500" />
            <span className="text-[14px] font-medium italic">Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-500 dark:text-zinc-400">
            <FiUsers className="w-4 h-4 text-brand-500" />
            <span className="text-[14px] font-medium">Submitted: <span className="text-gray-900 dark:text-white font-semibold">32/45</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button className="h-9 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[13px] font-semibold px-6 shadow-sm active:scale-95">
            Submissions
          </Button>
          <Button variant="ghost" className="h-9 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 dark:hover:bg-[#333] rounded-lg text-[13px] font-semibold px-6 transition-all active:scale-95">
            Edit
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LessonPlanItem = ({ plan }) => (
  <Card className="bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl group">
    <CardContent className="p-5">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20">
            <FiCalendar className="w-5 h-5 text-brand-500" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 mb-0.5 leading-tight">{plan.topic}</h3>
            <p className="text-[12px] font-semibold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-2 py-0.5 rounded">
              {plan.class_id?.course_id?.course_code || 'GENERAL'}
            </p>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-zinc-800/50 px-3 py-1 rounded-md text-xs font-bold text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700">
          Week {plan.week_number || 1}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Objectives</p>
          <p className="text-[14px] text-gray-700 dark:text-zinc-300 line-clamp-2">{plan.objectives}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Date & Duration</p>
          <div className="flex items-center gap-4 text-[14px] text-gray-600 dark:text-zinc-400">
            <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(plan.date).toLocaleDateString()}</span>
            <span className="italic">90 minutes duration</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800/50">
        <Button className="h-9 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[13px] font-semibold shadow-sm active:scale-95 transition-all">
          View Detail
        </Button>
        <Button variant="outline" className="h-9 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-zinc-300 rounded-lg text-[13px] font-semibold hover:bg-gray-100 dark:hover:bg-[#333] transition-all active:scale-95">
          Edit Plan
        </Button>
      </div>
    </CardContent>
  </Card>
);

const MaterialItem = ({ material }) => {
  const getFileIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'pdf': return <FiFileText className="h-6 w-6 text-red-500" />;
      case 'docx': return <FiFileText className="h-6 w-6 text-blue-500" />;
      case 'slides': return <FiBookOpen className="h-6 w-6 text-orange-500" />;
      default: return <FiFileText className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <Card className="bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl group">
      <CardContent className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-brand-500/10 border border-brand-500/20 group-hover:scale-110 transition-transform duration-300">
              {getFileIcon(material.type)}
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors">
                {material.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-2 py-0.5 rounded">
                  {material.type}
                </span>
                <p className="text-[13px] text-gray-500 dark:text-zinc-500">
                  Course: <span className="text-gray-700 dark:text-zinc-300 font-semibold">{material.class_id?.course_id?.course_code || 'N/A'}</span>
                  <span className="mx-2 opacity-30">•</span>
                  Added: {new Date(material.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 bg-brand-500 hover:bg-brand-400 text-white rounded-lg text-[13px] font-semibold px-8 shadow-sm active:scale-95 transition-all outline-none">
              Download
            </button>
            <button className="h-9 text-gray-500 hover:text-gray-900 border border-gray-200 dark:border-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white rounded-lg px-6 text-[13px] font-semibold transition-all outline-none active:scale-95">
              Preview
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Component ---

const Instruction = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    tabs,
    statCards,
    filteredClasses,
    assignments,
    lessonPlans,
    materials,
    loading,
    error
  } = useInstruction();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Instruction Management</h1>
        <div className="flex items-center gap-3">
          <button
            className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2">
              <FiPlus className="w-4 h-4" /> Add New Class
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
          </button>
        </div>
      </div>

      <StatCards statCards={statCards} />
      
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="space-y-6">
        {/* Classes Tab */}
        {activeTab === 0 && (
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="relative group max-w-sm ml-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400 dark:text-zinc-500 group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search classes..."
            className="block w-full h-10 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls, index) => (
              <ClassItem key={cls.id || index} cls={cls} />
            ))
          ) : (
            <EmptyState 
              icon={<FiBookOpen className="w-12 h-12 text-gray-300 dark:text-zinc-700" />} 
              title={searchQuery ? `No results match "${searchQuery}"` : "No classes found in the database."}
              className="bg-gray-50 dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800 rounded-2xl py-16 shadow-none"
            />
          )}
        </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 1 && (
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="space-y-4">
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <AssignmentItem key={assignment._id || index} assignment={assignment} />
                ))
              ) : (
                <EmptyState 
                  icon={<FiFileText className="w-12 h-12 text-gray-300 dark:text-zinc-700" />} 
                  title="No assignments found in the database."
                  className="bg-gray-50 dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800 rounded-2xl py-16 shadow-none"
                />
              )}
            </div>
          </div>
        )}

        {/* Lesson Plans Tab */}
        {activeTab === 2 && (
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="space-y-4">
              {lessonPlans.length > 0 ? (
                lessonPlans.map((plan, index) => (
                  <LessonPlanItem key={plan._id || index} plan={plan} />
                ))
              ) : (
                <EmptyState 
                  icon={<FiCalendar className="w-12 h-12 text-gray-300 dark:text-zinc-700" />} 
                  title="No lesson plans found in the database."
                  className="bg-gray-50 dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800 rounded-2xl py-16 shadow-none"
                />
              )}
            </div>
          </div>
        )}

        {/* Course Materials Tab */}
        {activeTab === 3 && (
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="space-y-4">
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <MaterialItem key={material._id || index} material={material} />
                ))
              ) : (
                <EmptyState 
                  icon={<FiBookOpen className="w-12 h-12 text-gray-300 dark:text-zinc-700" />} 
                  title="No course materials found in the database."
                  className="bg-gray-50 dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800 rounded-2xl py-16 shadow-none"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instruction;
