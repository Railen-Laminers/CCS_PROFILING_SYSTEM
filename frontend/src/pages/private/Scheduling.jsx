import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiCalendar, 
  FiHome, 
  FiAlertCircle, 
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiPlus
} from 'react-icons/fi';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Class Scheduling</h1>
          <p className="text-gray-500 mt-1">Manage weekly class schedules and room assignments</p>
        </div>
        <button 
          className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:brightness-90"
          style={{ backgroundColor: primaryColor }}
        >
          <FiPlus className="h-5 w-5" />
          <span>Add Schedule</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">0</p>
                <p className="text-gray-500 mt-1">{card.label}</p>
              </div>
              <div className={`${card.bgColor} rounded-lg p-3`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Controls */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <button 
            onClick={handlePreviousWeek}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiChevronLeft className="h-4 w-4" />
            <span>Previous Week</span>
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">{getWeekRange()}</h2>
            <p className="text-sm text-gray-500">Current Semester</p>
          </div>
          
          <button 
            onClick={handleNextWeek}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>Next Week</span>
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl shadow-sm overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          <div className="p-4 bg-gray-50 border-r border-gray-200">
            <span className="text-sm font-semibold text-gray-700">Time</span>
          </div>
          {days.map((day, index) => (
            <div key={index} className="p-4 bg-gray-50 border-r border-gray-200 last:border-r-0">
              <span className="text-sm font-semibold text-gray-700">{day}</span>
            </div>
          ))}
        </div>

        {/* Time Slots Grid */}
        <div className="grid grid-cols-7">
          {/* Time Column */}
          <div className="border-r border-gray-200">
            {timeSlots.map((time, index) => (
              <div 
                key={index} 
                className="h-16 px-4 flex items-start pt-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-xs text-gray-500 font-medium">{time}</span>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r border-gray-200 last:border-r-0">
              {timeSlots.map((time, timeIndex) => (
                <div 
                  key={timeIndex} 
                  className="h-16 border-b border-gray-100 last:border-b-0 relative"
                >
                  {/* Empty cell - event blocks can be positioned here absolutely */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
