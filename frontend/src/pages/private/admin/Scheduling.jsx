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
            <div className={`${card.bgColor} rounded-xl p-3 shadow-inner bg-opacity-10 dark:bg-opacity-10`}>
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
    { label: 'Total Classes', icon: FiCalendar, color: 'text-blue-600', bgColor: 'bg-blue-500' },
    { label: 'Available Rooms', icon: FiHome, color: 'text-green-600', bgColor: 'bg-green-500' },
    { label: 'Conflicts', icon: FiAlertCircle, color: 'text-red-600', bgColor: 'bg-red-500' },
    { label: 'Instructors', icon: FiUsers, color: 'text-purple-600', bgColor: 'bg-purple-500' },
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Class Scheduling</h1>
          <p className="text-[14px] text-gray-500 dark:text-zinc-500 mt-1">Manage weekly class schedules and room assignments</p>
        </div>
        <Button className="h-10 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold px-6 shadow-sm shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2">
          <FiPlus className="h-4 w-4" />
          <span>Add New Schedule</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <StatCards statCards={statCards} />

      {/* Calendar Controls & Grid Container */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Navigation Bar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePreviousWeek} 
                className="gap-2 w-full sm:w-auto h-10 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-zinc-400 rounded-xl hover:bg-white dark:hover:bg-[#252525] shadow-sm font-semibold"
            >
              <FiChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="text-center group">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-brand-500 transition-colors">{getWeekRange()}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <FiCalendar className="w-3.5 h-3.5 text-brand-500" />
                <p className="text-[11px] text-brand-500 font-bold uppercase tracking-[0.2em]">Academic Year 2024-2025</p>
              </div>
            </div>
            
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNextWeek} 
                className="gap-2 w-full sm:w-auto h-10 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-zinc-400 rounded-xl hover:bg-white dark:hover:bg-[#252525] shadow-sm font-semibold"
            >
              <span>Next</span>
              <FiChevronRight className="h-4 w-4" />
            </Button>
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
                      className="h-20 px-4 flex items-center justify-center border-b border-gray-100/50 dark:border-zinc-800/50 last:border-b-0"
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
                        className="h-20 border-b border-gray-100/50 dark:border-zinc-800/50 last:border-b-0 transition-colors hover:bg-brand-500/[0.03] dark:hover:bg-brand-500/[0.05]"
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
      </div>
    </div>
  );
};

export default Scheduling;
