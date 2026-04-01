import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  FiCalendar, 
  FiHome, 
  FiAlertCircle, 
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiPlus
} from 'react-icons/fi';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

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
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Class Scheduling</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Manage weekly class schedules and room assignments</p>
        </div>
        <Button className="gap-2">
          <FiPlus className="h-5 w-5" />
          <span>Add Schedule</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <Card key={index} className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
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

      {/* Calendar Controls */}
      <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button variant="secondary" size="sm" onClick={handlePreviousWeek} className="gap-2 w-full sm:w-auto">
              <FiChevronLeft className="h-4 w-4" />
              <span>Previous Week</span>
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{getWeekRange()}</h2>
              <p className="text-xs text-brand-500 font-semibold uppercase tracking-wider mt-0.5">Current Semester</p>
            </div>
            
            <Button variant="secondary" size="sm" onClick={handleNextWeek} className="gap-2 w-full sm:w-auto">
              <span>Next Week</span>
              <FiChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule Grid */}
      <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
                <div className="p-4 bg-gray-50/50 dark:bg-zinc-900/50 border-r border-gray-200 dark:border-gray-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Time</span>
                </div>
                {days.map((day, index) => (
                  <div key={index} className="p-4 bg-gray-50/50 dark:bg-zinc-900/50 border-r border-gray-200 dark:border-gray-800 last:border-r-0 text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">{day}</span>
                  </div>
                ))}
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-7 relative">
                {/* Time Column */}
                <div className="border-r border-gray-200 dark:border-gray-800">
                  {timeSlots.map((time, index) => (
                    <div 
                      key={index} 
                      className="h-16 px-4 flex items-start pt-2 border-b border-gray-100 dark:border-gray-800/50 last:border-b-0"
                    >
                      <span className="text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase">{time}</span>
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {days.map((day, dayIndex) => (
                  <div key={dayIndex} className="border-r border-gray-200 dark:border-gray-800 last:border-r-0 relative group">
                    {timeSlots.map((time, timeIndex) => (
                      <div 
                        key={timeIndex} 
                        className="h-16 border-b border-gray-100 dark:border-gray-800/50 last:border-b-0 transition-colors hover:bg-brand-500/5 dark:hover:bg-brand-500/5"
                      >
                        {/* Empty cell */}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scheduling;
