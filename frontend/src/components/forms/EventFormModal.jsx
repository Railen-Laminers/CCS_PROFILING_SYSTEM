import React from 'react';
import { 
  FiX, 
  FiPlus, 
  FiEdit, 
  FiTag, 
  FiCalendar, 
  FiMapPin, 
  FiUsers, 
  FiClock 
} from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

const EventFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  formData, 
  formErrors, 
  submitLoading, 
  handleInputChange 
}) => {
  if (!isOpen) return null;

  const editingEvent = !!initialData;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
              {editingEvent ? <FiEdit className="w-6 h-6 text-brand-500" /> : <FiPlus className="w-6 h-6 text-brand-500" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Event Management</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-8 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Event Title</label>
              <div className="relative group">
                <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${formErrors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'}`}
                  placeholder="e.g. Department Assembly"
                  required
                />
              </div>
              {formErrors.title && <p className="text-red-500 text-xs font-medium ml-1">{formErrors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all resize-none"
                placeholder="Describe the details of the event..."
              ></textarea>
            </div>

            {/* Category + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Category</label>
                <div className="relative group">
                  <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all appearance-none"
                  >
                    <option value="Curricular">Curricular</option>
                    <option value="Extra-Curricular">Extra-Curricular</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Status</label>
                <div className="relative group">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all appearance-none"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Venue */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Venue (Optional)</label>
              <div className="relative group">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  placeholder="e.g. Auditorium, Room 302"
                />
              </div>
            </div>

            {/* Max Participants Toggle */}
            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${formData.has_max_participants ? 'bg-brand-500' : 'bg-gray-200 dark:bg-zinc-800'} relative`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${formData.has_max_participants ? 'translate-x-4' : 'translate-x-0'} shadow-sm`} />
                </div>
                <input 
                  type="checkbox" 
                  name="has_max_participants" 
                  className="hidden" 
                  checked={formData.has_max_participants} 
                  onChange={handleInputChange} 
                />
                <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">Limit Participants</span>
              </label>

              {formData.has_max_participants && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Max Participants</label>
                  <div className="relative group">
                    <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    <input
                      type="number"
                      name="max_participants"
                      min="1"
                      value={formData.max_participants}
                      onChange={handleInputChange}
                      className={`w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${formErrors.max_participants ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'}`}
                      placeholder="e.g. 50"
                    />
                  </div>
                  {formErrors.max_participants && <p className="text-red-500 text-xs font-medium ml-1">{formErrors.max_participants}</p>}
                </div>
              )}
            </div>

            {/* Start + End DateTime */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Start Date & Time</label>
                <div className="relative group">
                  <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                  <input
                    type="datetime-local"
                    name="start_datetime"
                    value={formData.start_datetime}
                    onChange={handleInputChange}
                    className={`w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${formErrors.start_datetime ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'}`}
                    required
                  />
                </div>
                {formErrors.start_datetime && <p className="text-red-500 text-xs font-medium ml-1">{formErrors.start_datetime}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">End Date & Time</label>
                <div className="relative group">
                  <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                  <input
                    type="datetime-local"
                    name="end_datetime"
                    value={formData.end_datetime}
                    onChange={handleInputChange}
                    className={`w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${formErrors.end_datetime ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'}`}
                    required
                  />
                </div>
                {formErrors.end_datetime && <p className="text-red-500 text-xs font-medium ml-1">{formErrors.end_datetime}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              disabled={submitLoading} 
              className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[11px]"
            >
              Cancel
            </Button>
            <button
              type="submit"
              disabled={submitLoading}
              className="flex-[2] h-12 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                editingEvent ? 'Save Changes' : 'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
