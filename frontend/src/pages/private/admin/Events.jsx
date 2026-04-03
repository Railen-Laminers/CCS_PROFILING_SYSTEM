import React from 'react';
import useEvents from '../../../hooks/useEvents';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiCalendar, 
  FiClock, 
  FiInfo, 
  FiSearch 
} from 'react-icons/fi';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';

const EventItem = ({ event, onEdit, onDelete, formatDateTime }) => (
  <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
    <CardContent className="p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20 group-hover:scale-110 transition-transform duration-300">
            <FiCalendar className="w-6 h-6 text-brand-500" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors line-clamp-1 leading-tight">
              {event.title}
            </h3>
            <p className="text-[14px] text-gray-500 dark:text-zinc-500 mt-1 line-clamp-1 max-w-md">
              {event.description || 'No description available'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 flex-1 max-w-xl px-6 border-l border-gray-100 dark:border-gray-800 ml-6 hidden lg:grid">
          <div className="flex items-center gap-3 text-gray-600 dark:text-zinc-400">
            <FiClock className="w-4 h-4 text-brand-500" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Starts</span>
              <span className="text-[13px] font-semibold">{formatDateTime(event.start_datetime)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-zinc-400">
            <FiClock className="w-4 h-4 text-brand-500" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Ends</span>
              <span className="text-[13px] font-semibold">{formatDateTime(event.end_datetime)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button 
            onClick={() => onEdit(event)}
            variant="ghost"
            className="h-9 w-9 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all active:scale-95 shadow-none"
          >
            <FiEdit className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => onDelete(event.event_id)}
            variant="ghost"
            className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all active:scale-95 shadow-none"
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
          <button 
            className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-[13px] font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-[#252525] shadow-sm transition-all active:scale-95 ml-2"
          >
            View Details
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const EventsPage = () => {
  const {
    events,
    loading,
    error,
    modalOpen,
    editingEvent,
    formData,
    formErrors,
    submitLoading,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    handleInputChange,
    formatDateTime,
  } = useEvents();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-500"></div>
          <p className="text-sm font-medium text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Events Management</h1>
        </div>
        <button
          onClick={openCreateModal}
          className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
        >
          <span className="relative z-10 flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Add New Event
          </span>
          <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[14px] px-6 py-4 rounded-2xl mb-8 font-medium">
          {error}
        </div>
      )}

      {/* Events List Container */}
      <Card className="p-6 shadow-sm border-gray-200 dark:border-gray-800 rounded-2xl">
        <div className="relative group max-w-sm ml-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400 dark:text-zinc-500 group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search events..."
            className="block w-full h-10 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all shadow-sm"
          />
        </div>

        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <EventItem 
                key={event.event_id} 
                event={event} 
                onEdit={openEditModal} 
                onDelete={handleDelete}
                formatDateTime={formatDateTime}
              />
            ))
          ) : (
            <EmptyState 
              icon={FiCalendar} 
              title="No events found in the database."
            />
          )}
        </div>
      </Card>

      {/* Modal for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 relative">
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-gray-50 dark:bg-zinc-800 p-2 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                  {editingEvent ? <FiEdit className="text-brand-500" /> : <FiPlus className="text-brand-500" />}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1" htmlFor="title">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`block w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] border transition-all rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      formErrors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                    }`}
                    placeholder="E.g. Department Assembly"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-xs mt-1 font-medium ml-1">{formErrors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 bg-gray-50 dark:bg-[#18181B] border transition-all rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none ${
                      formErrors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                    }`}
                    placeholder="Describe the details of the event..."
                  ></textarea>
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1 font-medium ml-1">{formErrors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1" htmlFor="start_datetime">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      id="start_datetime"
                      name="start_datetime"
                      value={formData.start_datetime}
                      onChange={handleInputChange}
                      className={`block w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] border transition-all rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                        formErrors.start_datetime ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                      }`}
                    />
                    {formErrors.start_datetime && (
                      <p className="text-red-500 text-xs mt-1 font-medium ml-1">{formErrors.start_datetime}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1" htmlFor="end_datetime">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      id="end_datetime"
                      name="end_datetime"
                      value={formData.end_datetime}
                      onChange={handleInputChange}
                      className={`block w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] border transition-all rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                        formErrors.end_datetime ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                      }`}
                    />
                    {formErrors.end_datetime && (
                      <p className="text-red-500 text-xs mt-1 font-medium ml-1">{formErrors.end_datetime}</p>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={closeModal}
                    disabled={submitLoading}
                    className="h-11 px-8 rounded-xl font-bold transition-all shadow-none"
                  >
                    Cancel
                  </Button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="relative group overflow-hidden rounded-xl bg-brand-500 px-10 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2 min-w-[140px] justify-center disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {submitLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        editingEvent ? 'Save Changes' : 'Create Event'
                      )}
                    </span>
                    {!submitLoading && <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>}
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
