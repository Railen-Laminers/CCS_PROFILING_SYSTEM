import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSearch, FiCalendar, FiUsers, FiClock } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';
import { eventAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

const TrophyIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l7.355 12.748c1.154 2-.29 4.5-2.598 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

const BookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
  </svg>
);

const EventsForm = ({ onCancel, onBack }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [respondingId, setRespondingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allEvents, studentEvents, studentInvitations] = await Promise.all([
          eventAPI.getEvents(),
          user ? eventAPI.getStudentEvents(user.id) : Promise.resolve([]),
          user ? eventAPI.getStudentInvitations(user.id) : Promise.resolve([])
        ]);
        setEvents(allEvents);
        const registeredIds = studentEvents.map(ev => ev.event_id);
        setRegisteredEventIds(registeredIds);
        setInvitations(studentInvitations);
      } catch (error) {
        console.error('Failed to load events:', error);
        showToast('Failed to load events. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, showToast]);

  const categories = [
    { key: 'all', label: 'All Events' },
    { key: 'Curricular', label: 'Curricular' },
    { key: 'Extra-Curricular', label: 'Extra-Curricular' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeCategory === 'all') return matchesSearch;
    return matchesSearch && event.category === activeCategory;
  });

  const isRegistered = (eventId) => registeredEventIds.includes(eventId);

  const handleRegister = async (eventId) => {
    if (!user) return;
    setRegisteringId(eventId);
    try {
      await eventAPI.registerForEvent(eventId, user.id);
      setRegisteredEventIds(prev => [...prev, eventId]);
      showToast('Successfully registered for the event!', 'success');
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      showToast(msg, 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleUnregister = async (eventId) => {
    if (!user) return;
    setRegisteringId(eventId);
    try {
      await eventAPI.unregisterFromEvent(eventId, user.id);
      setRegisteredEventIds(prev => prev.filter(id => id !== eventId));
      showToast('You have been unregistered from the event.', 'info');
    } catch (error) {
      const msg = error.response?.data?.message || 'Unregistration failed.';
      showToast(msg, 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleRespond = async (eventId, response) => {
    if (!user) return;
    setRespondingId(eventId);
    try {
      await eventAPI.respondToInvitation(eventId, response);
      setInvitations(prev => prev.filter(inv => inv.event_id !== eventId));
      
      if (response === 'accepted') {
        setRegisteredEventIds(prev => [...prev, eventId]);
        showToast('Invitation accepted! You are now registered.', 'success');
        // Refresh all events to update participant count
        const allEvents = await eventAPI.getEvents();
        setEvents(allEvents);
      } else {
        showToast('Invitation declined.', 'info');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Action failed.';
      showToast(msg, 'error');
    } finally {
      setRespondingId(null);
    }
  };

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const inputClass = `w-full pl-12 pr-4 py-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500/20 outline-none text-sm ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`;

  if (loading) {
    return (
      <div className={`min-h-screen p-4 md:p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <button
        onClick={onBack}
        className={`flex items-center text-sm font-medium mb-6 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
      >
        <FiArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Events & Competitions</h1>
          <p className="text-gray-500">Browse and register for upcoming school events, competitions, and activities</p>
        </div>

        <div className={`rounded-xl border p-6 mb-6 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <FiSearch className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                className={inputClass}
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={`rounded-lg px-4 py-2 ${isDark ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
              <span className="text-gray-500 text-sm">{registeredEventIds.length} Registered</span>
            </div>
          </div>

          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category.key
                    ? 'bg-orange-500 text-white'
                    : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Invitations Section */}
        {invitations.length > 0 && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></div>
                Pending Invitations
                <span className="ml-2 px-2 py-0.5 bg-brand-500/10 text-brand-500 text-[10px] font-black uppercase rounded-full border border-brand-500/20">
                  {invitations.length} New
                </span>
              </h2>
              {invitations.length > 3 && (
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Scroll →</span>
              )}
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {invitations.map((inv) => (
                <div 
                  key={inv.event_id}
                  className={`flex-shrink-0 w-[280px] sm:w-[320px] p-5 rounded-[1.5rem] border-2 border-brand-500/20 shadow-sm relative overflow-hidden snap-start transition-all hover:border-brand-500/40 group ${isDark ? 'bg-brand-500/5' : 'bg-brand-50/30'}`}
                >
                  <div className="absolute top-0 right-0 p-3">
                    <FiCalendar className="w-4 h-4 text-brand-500/20 group-hover:text-brand-500/40 transition-colors" />
                  </div>
                  
                  <div className="mb-4">
                    <h3 className={`font-bold text-[15px] leading-tight mb-1 truncate ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{inv.title}</h3>
                    <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1.5">
                      <FiClock className="w-3 h-3" />
                      {formatDate(inv.start_datetime)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => handleRespond(inv.event_id, 'accepted')}
                      disabled={respondingId === inv.event_id}
                      className="flex-[2] py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-brand-500/20"
                    >
                      {respondingId === inv.event_id ? '...' : 'Accept Invite'}
                    </button>
                    <button
                      onClick={() => handleRespond(inv.event_id, 'declined')}
                      disabled={respondingId === inv.event_id}
                      className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:opacity-50 ${isDark ? 'bg-zinc-800 text-gray-400 hover:text-gray-200' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.event_id}
              className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 text-xs rounded ${event.category === 'Curricular' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {event.category}
                </span>
                {event.category === 'Curricular' ? (
                  <BookIcon className="w-5 h-5 text-blue-500" />
                ) : (
                  <TrophyIcon className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <h3 className={`font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{event.title}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <FiCalendar className="w-4 h-4" />
                {formatDate(event.start_datetime)}
              </div>
              {event.venue && (
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <FiUsers className="w-4 h-4" />
                  {event.venue}
                </div>
              )}
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {event.description || 'No description provided.'}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                <span>Participants: {event.participant_count}{event.max_participants ? ` / ${event.max_participants}` : ''}</span>
                <span className="capitalize">Status: {event.status}</span>
              </div>
              {isRegistered(event.event_id) ? (
                <button
                  onClick={() => handleUnregister(event.event_id)}
                  disabled={registeringId === event.event_id}
                  className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 disabled:opacity-50"
                >
                  {registeringId === event.event_id ? 'Processing...' : 'Unregister'}
                </button>
              ) : (
                <button
                  onClick={() => handleRegister(event.event_id)}
                  disabled={registeringId === event.event_id || (event.max_participants && event.participant_count >= event.max_participants)}
                  className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {registeringId === event.event_id ? 'Processing...' : 'Register Now'}
                </button>
              )}
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsForm;