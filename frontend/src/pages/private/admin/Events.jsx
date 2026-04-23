import React, { useState } from 'react';
import useEvents from '../../../hooks/useEvents';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiCalendar, 
  FiClock, 
  FiSearch,
  FiUsers,
  FiMapPin,
  FiTag,
  FiUserPlus,
  FiUserMinus
} from 'react-icons/fi';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import EventFormModal from '../../../components/forms/EventFormModal';
import EventFilters from '../../../components/filters/EventFilters';

const statusColors = {
  'Upcoming': 'orange',
  'Ongoing': 'green',
  'Completed': 'gray',
  'Cancelled': 'red'
};

const EventItem = ({ event, onEdit, onDelete, onViewParticipants, formatDateTime }) => (
  <Card className="bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
    <CardContent className="p-5">
      <div className="flex flex-col gap-4">
        {/* Top row: Title + Badges + Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20 group-hover:scale-110 transition-transform duration-300">
              <FiCalendar className="w-5 h-5 text-brand-500" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors truncate leading-tight">
                {event.title}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-zinc-500 mt-0.5 truncate max-w-md">
                {event.description || 'No description available'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={event.category === 'Curricular' ? 'purple' : 'orange'}>
              {event.category}
            </Badge>
            <Badge variant={statusColors[event.status] || 'gray'}>
              {event.status}
            </Badge>
          </div>
        </div>

        {/* Bottom row: Meta + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-[12px] text-gray-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 text-brand-500" />
              <span className="font-medium">{formatDateTime(event.start_datetime)}</span>
              <span className="text-gray-300 dark:text-zinc-600">→</span>
              <span className="font-medium">{formatDateTime(event.end_datetime)}</span>
            </div>
            {event.venue && (
              <div className="flex items-center gap-1.5">
                <FiMapPin className="w-3.5 h-3.5 text-brand-500" />
                <span className="font-medium">{event.venue}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <FiUsers className="w-3.5 h-3.5 text-brand-500" />
              <span className="font-semibold">{event.participant_count || 0}</span>
              {event.max_participants !== null && event.max_participants !== undefined ? (
                <span className="text-gray-400">/ {event.max_participants}</span>
              ) : (
                <span className="text-gray-400">registered</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewParticipants(event)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/5 hover:bg-brand-500/10 border border-brand-500/10 text-brand-500 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95"
            >
              <FiUsers className="w-3.5 h-3.5" /> Participants
            </button>
            <Button 
              onClick={() => onEdit(event)}
              variant="ghost"
              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all active:scale-95 shadow-none"
            >
              <FiEdit className="w-3.5 h-3.5" />
            </Button>
            <Button 
              onClick={() => onDelete(event.event_id)}
              variant="ghost"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all active:scale-95 shadow-none"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ParticipantModal = ({ event, students, isOpen, onClose, onInvite, onUnregister }) => {
  const [activeTab, setActiveTab] = useState('invite');
  const [studentSearch, setStudentSearch] = useState('');
  
  if (!isOpen || !event) return null;

  const participantIds = (event.participants || []).map(p => (typeof p === 'object' ? p._id : p));
  const invitedIds = (event.invitations || []).map(i => (typeof i.user === 'object' ? i.user._id : i.user));
  
  const availableStudents = students.filter(s => {
    const userId = s.user?._id || s.user?.id;
    if (!userId) return false;
    const isRegistered = participantIds.includes(userId);
    const isInvited = invitedIds.includes(userId);
    if (isRegistered || isInvited) return false;
    if (!studentSearch.trim()) return true;
    const fullName = `${s.user?.firstname || ''} ${s.user?.lastname || ''}`.toLowerCase();
    return fullName.includes(studentSearch.toLowerCase());
  });

  const registeredParticipants = (event.participants || []).filter(p => typeof p === 'object');
  const pendingInvitations = (event.invitations || []).filter(i => i.status === 'pending' && typeof i.user === 'object');

  const isFull = event.max_participants !== null && event.max_participants !== undefined && participantIds.length >= event.max_participants;

  const tabs = [
    { id: 'invite', label: 'Invite', icon: FiUserPlus, count: availableStudents.length },
    { id: 'confirmed', label: 'Confirmed', icon: FiUsers, count: registeredParticipants.length },
    { id: 'pending', label: 'Pending', icon: FiClock, count: pendingInvitations.length },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
              <FiUsers className="w-6 h-6 text-brand-500" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight truncate">Participants</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate max-w-[200px] sm:max-w-xs">{event.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">{participantIds.length}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                {event.max_participants ? `/ ${event.max_participants} Limit` : 'Confirmed'}
              </p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all">
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 shrink-0">
          <div className="flex p-1.5 bg-gray-100 dark:bg-zinc-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-[#1E1E1E] text-brand-500 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${
                    activeTab === tab.id ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 min-h-[400px]">
          {activeTab === 'confirmed' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Confirmed ({registeredParticipants.length})</h3>
              </div>
              {registeredParticipants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {registeredParticipants.map(p => (
                    <div key={p._id} className="flex items-center justify-between p-3 bg-white dark:bg-[#252525] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center text-xs font-bold border border-brand-500/20">
                          {p.firstname?.[0] || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{p.firstname} {p.lastname}</p>
                          <p className="text-[10px] text-gray-400 truncate">{p.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onUnregister(event.event_id, p._id)}
                        className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Remove Participant"
                      >
                        <FiUserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center mb-4">
                    <FiUsers className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-gray-400">No participants confirmed yet</p>
                  <p className="text-[11px] text-gray-500 mt-1 max-w-[200px]">Send invitations to students to start building your list.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Pending ({pendingInvitations.length})</h3>
              </div>
              {pendingInvitations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pendingInvitations.map(inv => (
                    <div key={inv.user._id} className="flex items-center gap-3 p-3 bg-white dark:bg-[#252525] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-400 flex items-center justify-center text-xs font-bold border border-gray-200 dark:border-gray-700">
                        {inv.user.firstname?.[0] || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-400 dark:text-zinc-400 truncate">{inv.user.firstname} {inv.user.lastname}</p>
                        <p className="text-[9px] font-black text-brand-500 uppercase tracking-widest mt-0.5">Awaiting Response</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center mb-4">
                    <FiClock className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-gray-400">No pending invitations</p>
                  <p className="text-[11px] text-gray-500 mt-1">All invitations have been responded to.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'invite' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Invite Students</h3>
                  {isFull && (
                    <Badge variant="red" className="text-[9px] px-2 py-0.5">Capacity Reached</Badge>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="h-4.5 w-4.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search students to invite..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="block w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-[1.25rem] text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {availableStudents.length > 0 ? (
                  availableStudents.slice(0, 50).map(s => {
                    const userId = s.user?._id || s.user?.id;
                    return (
                      <div key={userId} className="flex items-center justify-between p-3.5 bg-white dark:bg-[#252525] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-brand-500/30 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 flex items-center justify-center text-xs font-bold border border-gray-200 dark:border-gray-700 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all">
                            {s.user?.firstname?.[0] || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{s.user?.firstname} {s.user?.lastname}</p>
                            <p className="text-[11px] text-gray-500 font-medium truncate">{s.student?.program || 'N/A'} • {s.student?.section || 'No section'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onInvite(event.event_id, userId)}
                          disabled={isFull}
                          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-100 dark:disabled:bg-zinc-800 text-white disabled:text-gray-400 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 disabled:scale-100 shadow-sm shadow-brand-500/20"
                        >
                          <FiUserPlus className="w-3.5 h-3.5" /> Invite
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center mb-4">
                      <FiSearch className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">No students found</p>
                    <p className="text-[11px] text-gray-500 mt-1">{studentSearch ? 'Try a different search term.' : 'All eligible students have been invited.'}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const {
    events,
    allStudents,
    loading,
    error,
    modalOpen,
    editingEvent,
    formData,
    formErrors,
    submitLoading,
    categoryFilter,
    statusFilter,
    tempCategoryFilter,
    setTempCategoryFilter,
    tempStatusFilter,
    setTempStatusFilter,
    tempSearchQuery,
    setTempSearchQuery,
    isSearching,
    handleSearch,
    clearFilters,
    searchQuery,
    participantModalOpen,
    selectedEvent,
    openCreateModal,
    openEditModal,
    closeModal,
    openParticipantModal,
    closeParticipantModal,
    handleSubmit,
    handleDelete,
    handleRegister,
    handleInvite,
    handleUnregister,
    handleInputChange,
    formatDateTime,
  } = useEvents();

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
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[14px] px-6 py-4 rounded-2xl mb-6 font-medium">
          {error}
        </div>
      )}

      {/* Manual Filters */}
      <EventFilters
        tempSearchQuery={tempSearchQuery}
        setTempSearchQuery={setTempSearchQuery}
        handleSearch={handleSearch}
        isSearching={isSearching}
        tempCategoryFilter={tempCategoryFilter}
        setTempCategoryFilter={setTempCategoryFilter}
        tempStatusFilter={tempStatusFilter}
        setTempStatusFilter={setTempStatusFilter}
        clearFilters={clearFilters}
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
      />

      {/* Events List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
            <div className="w-12 h-12 rounded-full border-4 border-t-brand-500 border-r-brand-500 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-sm font-bold text-gray-400 mt-4 uppercase tracking-widest">Fetching Events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <EventItem 
              key={event.event_id} 
              event={event} 
              onEdit={openEditModal} 
              onDelete={handleDelete}
              onViewParticipants={openParticipantModal}
              formatDateTime={formatDateTime}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={FiCalendar} 
          title="No Events Found"
          description="No events found matching your current filters. Try resetting the filters or adding a new event."
          className="min-h-[450px]"
        />
      )}



      {/* Create/Edit Modal */}
      <EventFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={editingEvent}
        formData={formData}
        formErrors={formErrors}
        submitLoading={submitLoading}
        handleInputChange={handleInputChange}
      />

      {/* Participant Modal */}
      <ParticipantModal
        event={selectedEvent}
        students={allStudents}
        isOpen={participantModalOpen}
        onClose={closeParticipantModal}
        onInvite={handleInvite}
        onUnregister={handleUnregister}
      />
    </div>
  );
};

export default EventsPage;
