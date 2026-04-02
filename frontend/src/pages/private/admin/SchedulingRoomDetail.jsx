import React from 'react';
import { FiChevronLeft, FiPlus, FiTrash2, FiEdit3 } from 'react-icons/fi';
import { Card } from '@/components/ui/Card';
import ClassFormModal from '@/components/forms/ClassFormModal';
import { Calendar } from 'react-big-calendar';
import { localizer } from '@/lib/schedulingHelpers';
import { useSchedulingRoomDetail } from '@/hooks/useSchedulingRoomDetail';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
    const {
        room,
        roomId,
        events,
        loading,
        isModalOpen,
        setIsModalOpen,
        selectedClass,
        setSelectedClass,
        currentView,
        currentDate,
        handleClassSubmit,
        handleSelectEvent,
        handleViewChange,
        handleNavigate,
        handleCloseModal,
        navigate,
    } = useSchedulingRoomDetail();

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
              onView={handleViewChange}
              date={currentDate}
              onNavigate={handleNavigate}
              allDaySlot={false}
              step={30}
              timeslots={2}
              onSelectEvent={handleSelectEvent}
              components={{
                event: CustomEvent
              }}
              eventPropGetter={() => ({
                className: 'bg-white dark:bg-[#252525] border border-gray-200 dark:border-zinc-800 rounded shadow-sm hover:border-gray-300 dark:hover:border-zinc-600 transition-colors mx-[2px] mt-[1px]'
              })}
            />
          </div>
        )}
      </Card>

      <ClassFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleClassSubmit}
        initialData={selectedClass}
        roomId={roomId}
      />
    </div>
  );
};

export default SchedulingRoomDetail;
