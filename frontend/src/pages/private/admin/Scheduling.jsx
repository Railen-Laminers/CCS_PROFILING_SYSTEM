import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  FiCalendar, 
  FiHome, 
  FiAlertCircle, 
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiClock
} from 'react-icons/fi';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

const StatCards = ({ statCards }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {statCards.map((card, index) => (
      <Card key={index} className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">0</p>
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

const Scheduling = () => {
  const { primaryColor } = useTheme();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const statCards = [
    { label: 'Total Classes', icon: FiCalendar, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Available Rooms', icon: FiHome, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Conflicts', icon: FiAlertCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
    { label: 'Instructors', icon: FiUsers, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [];
  for (let hour = 7; hour <= 18; hour++) {
    timeSlots.push(`${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`);
  }

  const getWeekRange = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 5);
    
    const startMonth = start.toLocaleString('default', { month: 'long' });
    const endMonth = end.toLocaleString('default', { month: 'long' });
    const year = start.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${year}`;
    }
    return `${startMonth} - ${endMonth} ${year}`;
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Class Scheduling</h1>
        </div>
        <button
          className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
        >
          <span className="relative z-10 flex items-center gap-2">
            <FiPlus className="h-4 w-4" /> Add New Schedule
          </span>
          <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
        </button>
      </div>

      {/* Stats Grid */}
      <StatCards statCards={statCards} />

      {/* Calendar Controls & Grid Container */}
      <Card className="overflow-hidden shadow-sm">
        {/* Navigation Bar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <button 
                onClick={handlePreviousWeek} 
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-[#252525] shadow-sm transition-all active:scale-95 disabled:opacity-50 w-full sm:w-auto justify-center"
            >
              <FiChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back</span>
            </button>
            
            <div className="text-center group">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-brand-500 transition-colors">{getWeekRange()}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <FiCalendar className="w-3.5 h-3.5 text-brand-500" />
                <p className="text-[11px] text-brand-500 font-bold uppercase tracking-[0.2em]">Academic Year 2024-2025</p>
              </div>
            </div>
            
            <button 
                onClick={handleNextWeek} 
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-[#252525] shadow-sm transition-all active:scale-95 disabled:opacity-50 w-full sm:w-auto justify-center group"
            >
              <span>Next</span>
              <FiChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Weekly Schedule Grid */}
        <div className="p-0">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="min-w-[1000px]">
              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-gray-100 dark:border-zinc-800">
                <div className="p-4 bg-gray-100 dark:bg-[#252525] border-r border-gray-100 dark:border-zinc-800 flex items-center justify-center">
                  <FiClock className="w-4 h-4 text-gray-400 dark:text-zinc-600" />
                </div>
                {days.map((day, index) => (
                  <div key={index} className="p-4 bg-gray-100 dark:bg-[#252525] border-r border-gray-100 dark:border-zinc-800 last:border-r-0 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 dark:text-zinc-400">{day}</span>
                  </div>
                ))}
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-7 relative">
                {/* Time Column */}
                <div className="border-r border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/10">
                  {timeSlots.map((time, index) => (
                    <div 
                      key={index} 
                      className="h-16 px-4 flex items-center justify-center border-b border-gray-100/50 dark:border-zinc-800/50 last:border-b-0"
                    >
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase whitespace-nowrap">{time}</span>
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {days.map((day, dayIndex) => (
                  <div key={dayIndex} className="border-r border-gray-100 dark:border-zinc-800 last:border-r-0 relative group">
                    {timeSlots.map((time, timeIndex) => (
                      <div 
                        key={timeIndex} 
                        className="h-16 border-b border-gray-100/50 dark:border-zinc-800/50 last:border-b-0 transition-colors hover:bg-brand-500/[0.03] dark:hover:bg-brand-500/[0.05]"
                      >
                        {/* Empty cell */}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Scheduling;
