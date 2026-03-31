import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  FiBookOpen, 
  FiFileText, 
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser
} from 'react-icons/fi';
import useInstruction from '@/hooks/useInstruction';
import InstructionFilters from '@/components/filters/InstructionFilters';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

// --- Local Sub-components ---

const StatCards = ({ statCards }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    {statCards.map((card, index) => (
      <Card key={index} className="bg-white/70 backdrop-blur-md border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{card.count}</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
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

const TabNavigation = ({ tabs, activeTab, setActiveTab, primaryColor }) => (
  <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 mb-6 shadow-sm flex gap-1">
    {tabs.map((tab, index) => (
      <button
        key={index}
        onClick={() => setActiveTab(index)}
        className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
          activeTab === index
            ? 'text-white shadow-md transform scale-[1.02]'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
        style={activeTab === index ? { backgroundColor: primaryColor } : {}}
      >
        {tab}
      </button>
    ))}
  </div>
);

const ClassItem = ({ cls, primaryColor }) => (
  <Card className="bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-sm border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
    <CardContent className="p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Section */}
        <div className="flex items-center gap-5">
          <Badge 
            variant="purple"
            className="h-12 w-16 flex items-center justify-center text-sm font-bold shadow-sm group-hover:scale-105 transition-transform"
            style={{ backgroundColor: primaryColor }}
          >
            {cls.courseCode}
          </Badge>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors">
              {cls.courseTitle}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <FiUsers className="h-3.5 w-3.5 text-gray-400" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {cls.studentsCount} students enrolled
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-10">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg">
            <FiClock className="h-4 w-4 text-brand-500" />
            <span className="text-sm font-medium">{cls.schedule}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg">
            <FiMapPin className="h-4 w-4 text-brand-500" />
            <span className="text-sm font-medium">{cls.room}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg">
            <FiUser className="h-4 w-4 text-brand-500" />
            <span className="text-sm font-medium">{cls.instructor}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <Button 
            className="shadow-sm hover:brightness-110 active:scale-95 transition-all rounded-xl"
            style={{ backgroundColor: primaryColor }}
          >
            Details
          </Button>
          <Button variant="outline" className="rounded-xl">
            Manage
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// --- Main Component ---

const Instruction = () => {
  const { primaryColor } = useTheme();
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    tabs,
    statCards,
    filteredClasses
  } = useInstruction();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#121212] dark:to-[#1a1a1a] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Instruction <span style={{ color: primaryColor }}>Management</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">
          Orchestrate classes, assignments, and curriculum resources in one place.
        </p>
      </div>

      <StatCards statCards={statCards} />
      
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        primaryColor={primaryColor} 
      />

      <div className="space-y-6">
        {/* Classes Tab */}
        {activeTab === 0 && (
          <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
            <InstructionFilters 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              primaryColor={primaryColor} 
            />

            <div className="space-y-4">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls, index) => (
                  <ClassItem key={cls.id || index} cls={cls} primaryColor={primaryColor} />
                ))
              ) : (
                <EmptyState 
                  icon={<FiBookOpen className="h-12 w-12" />} 
                  title="No classes found"
                  description={searchQuery ? `No results match "${searchQuery}"` : "Add your first class to get started with instruction management."}
                  action={<Button style={{ backgroundColor: primaryColor }}>Add New Class</Button>}
                />
              )}
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 1 && (
          <EmptyState 
            icon={<FiFileText className="h-12 w-12" />} 
            title="No assignments found"
            description="Create your first assignment to start tracking student progress."
            action={<Button style={{ backgroundColor: primaryColor }}>New Assignment</Button>}
            className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border-white/20 rounded-3xl"
          />
        )}

        {/* Lesson Plans Tab */}
        {activeTab === 2 && (
          <EmptyState 
            icon={<FiCalendar className="h-12 w-12" />} 
            title="No lesson plans found"
            description="Structure your teaching by creating detailed lesson plans."
            action={<Button style={{ backgroundColor: primaryColor }}>Create Plan</Button>}
            className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border-white/20 rounded-3xl"
          />
        )}

        {/* Course Materials Tab */}
        {activeTab === 3 && (
          <EmptyState 
            icon={<FiBookOpen className="h-12 w-12" />} 
            title="No course materials found"
            description="Upload handouts, slides, and other resources for your students."
            action={<Button style={{ backgroundColor: primaryColor }}>Upload Material</Button>}
            className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border-white/20 rounded-3xl"
          />
        )}
      </div>
    </div>
  );
};

export default Instruction;
