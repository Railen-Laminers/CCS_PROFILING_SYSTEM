import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiPlus, FiTrash2, FiEdit3 } from 'react-icons/fi';
import { Card } from '@/components/ui/Card';
import { roomAPI, instructionAPI } from '@/services/api';
import ClassFormModal from '@/components/forms/ClassFormModal';
import { useToast } from '@/contexts/ToastContext';

// React Big Calendar imports
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // start on Monday
  getDay,
  locales,
});

const CustomEvent = ({ event }) => {
  const cls = event.resource;
  return (
    <div className="flex flex-col h-full justify-center overflow-hidden p-1.5 pl-2.5 group relative">
      <div className="flex justify-between items-start">
        <span className="font-semibold text-xs tracking-tight truncate text-gray-900 dark:text-gray-100">
          {cls.course_id?.course_code || 'Course'}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); cls.onEdit && cls.onEdit(); }} 
            className="text-gray-400 hover:text-brand-500 rounded p-0.5">
            <FiEdit3 size={12} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); cls.onDelete && cls.onDelete(); }} 
            className="text-gray-400 hover:text-red-500 rounded p-0.5">
            <FiTrash2 size={12} />
          </button>
        </div>
      </div>
      <div className="text-[10px] truncate font-medium text-gray-500 dark:text-gray-400">
        {cls.section} • {cls.instructor_id?.user?.lastname || 'Instructor'}
      </div>
    </div>
  );
};

const SchedulingRoomDetail = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [room, setRoom] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentView, setCurrentView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDeleteClass = async (classId) => {
    if(window.confirm('Delete this class schedule?')) {
      try {
        await instructionAPI.deleteClass(classId);
        showToast('Class deleted', 'info');
        fetchData();
      } catch(e) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rooms, allClasses] = await Promise.all([
        roomAPI.getRooms(),
        instructionAPI.getClasses() 
      ]);
      const currentRoom = rooms.find(r => r._id === roomId);
      setRoom(currentRoom);
      
      const roomClasses = allClasses.filter(c => c.room_id && c.room_id._id === roomId);
      
      // Parse to Big Calendar format
      const parsedEvents = roomClasses.map(cls => {
        const dateString = cls.schedule?.date;
        const startString = cls.schedule?.startTime;
        const endString = cls.schedule?.endTime;
        
        let start = new Date();
        let end = new Date();
        
        if (dateString && startString && endString) {
            start = new Date(`${dateString}T${startString}:00`);
            end = new Date(`${dateString}T${endString}:00`);
        }

        return {
          id: cls._id,
          title: cls.course_id?.course_code || 'Class',
          start,
          end,
          resource: {
            ...cls,
            onEdit: () => handleSelectEvent({ resource: cls }),
            onDelete: () => handleDeleteClass(cls._id)
          }
        };
      });

      setEvents(parsedEvents);
    } catch (err) {
      showToast('Failed to load schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roomId]);

  const handleClassSubmit = async (classData, classId) => {
    if (classId) {
      await instructionAPI.updateClass(classId, classData);
      showToast('Class updated successfully', 'success');
    } else {
      await instructionAPI.createClass(classData);
      showToast('Class scheduled successfully', 'success');
    }
    fetchData(); 
  };
  
  const handleSelectEvent = (event) => {
    setSelectedClass(event.resource);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/scheduling')}
            className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:text-brand-500 transition-colors shadow-sm"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {room ? room.name : 'Loading Room...'}
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              {room ? `${room.type} • Capacity: ${room.capacity}` : 'Scheduling Details'}
            </p>
          </div>
        </div>

        <button
          onClick={() => { setSelectedClass(null); setIsModalOpen(true); }}
          className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
        >
          <FiPlus className="h-4 w-4 relative z-10" /> 
          <span className="relative z-10 tracking-wide text-xs uppercase">Schedule Class</span>
          <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
        </button>
      </div>

      <Card className="overflow-hidden shadow-sm p-4 relative bg-white dark:bg-[#1E1E1E] border-none">
        {loading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="relative border-brand-500 w-12 h-12 rounded-full border-t-2 animate-spin"></div>
          </div>
        ) : (
          <div className="h-[700px] font-sans rbc-theme-container">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={['month', 'week', 'day', 'agenda']}
              view={currentView}
              onView={(view) => setCurrentView(view)}
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              allDaySlot={false}
              step={30}
              timeslots={2}
              onSelectEvent={handleSelectEvent}
              components={{
                event: CustomEvent
              }}
              eventPropGetter={(event) => {
                return {
                  className: 'bg-white dark:bg-[#252525] border border-gray-200 dark:border-zinc-800 rounded shadow-sm hover:border-gray-300 dark:hover:border-zinc-600 transition-colors mx-[2px] mt-[1px]',
                  style: {
                    backgroundColor: 'transparent', // Overridden by Tailwind bg class
                    borderColor: 'transparent',
                    color: 'inherit'
                  }
                };
              }}
            />
          </div>
        )}
      </Card>

      <ClassFormModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedClass(null); }}
        onSuccess={handleClassSubmit}
        initialData={selectedClass}
        roomId={roomId}
      />
    </div>
  );
};

export default SchedulingRoomDetail;
