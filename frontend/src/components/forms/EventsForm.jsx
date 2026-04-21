import React, { useState } from 'react';
import { FiArrowLeft, FiSearch, FiCalendar } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

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

const eventsData = [
  {
    title: 'Tech Summit 2026',
    category: 'Conference',
    date: 'Monday, April 20, 2026',
    description: 'Annual technology conference featuring industry experts and networking opportunities.',
    icon: 'book',
    color: 'bg-gray-100'
  },
  {
    title: 'AI & Machine Learning Workshop',
    category: 'Workshop',
    date: 'Saturday, April 25, 2026',
    description: 'Hands-on workshop covering modern AI and ML frameworks and best practices.',
    icon: 'book',
    color: 'bg-blue-100'
  },
  {
    title: 'Career Fair 2026',
    category: 'Career',
    date: 'Thursday, April 30, 2026',
    description: 'Connect with top employers and explore career opportunities in the tech industry.',
    icon: 'book',
    color: 'bg-purple-100'
  },
  {
    title: 'Cybersecurity Awareness Seminar',
    category: 'Seminar',
    date: 'Saturday, April 18, 2026',
    description: 'Learn about the latest cybersecurity threats and how to protect yourself online.',
    icon: 'book',
    color: 'bg-orange-100'
  },
  {
    title: 'National Programming Competition',
    category: 'Programming',
    date: 'Friday, May 5, 2026',
    description: 'Test your coding skills against the best programmers in the region.',
    icon: 'trophy',
    color: 'bg-yellow-100'
  },
  {
    title: 'Hackathon 2026',
    category: 'Competition',
    date: 'Saturday, May 15, 2026',
    description: '24-hour coding challenge to build innovative solutions.',
    icon: 'trophy',
    color: 'bg-green-100'
  },
  {
    title: 'Web Development Bootcamp',
    category: 'Workshop',
    date: 'Sunday, May 10, 2026',
    description: 'Intensive training on modern web development technologies.',
    icon: 'book',
    color: 'bg-blue-100'
  },
  {
    title: 'Data Science Quiz Bee',
    category: 'Competition',
    date: 'Wednesday, May 20, 2026',
    description: 'Test your knowledge in data science and analytics.',
    icon: 'trophy',
    color: 'bg-red-100'
  }
];

const EventsForm = ({ onCancel, onBack }) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const categories = [
    { key: 'all', label: 'All Events' },
    { key: 'events', label: 'Events' },
    { key: 'competitions', label: 'Competitions' }
  ];

  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'events') return matchesSearch && event.category !== 'Competition';
    if (activeCategory === 'competitions') return matchesSearch && event.category === 'Competition';
    return matchesSearch;
  });

  const handleRegister = (eventTitle) => {
    if (!registeredEvents.includes(eventTitle)) {
      setRegisteredEvents([...registeredEvents, eventTitle]);
    }
  };

  const isRegistered = (eventTitle) => registeredEvents.includes(eventTitle);
  const inputClass = `w-full pl-12 pr-4 py-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500/20 outline-none text-sm ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`;

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Back to Dashboard Link */}
      <button 
        onClick={onBack}
        className={`flex items-center text-sm font-medium mb-6 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
      >
        <FiArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Events & Competitions</h1>
          <p className="text-gray-500">Browse and register for upcoming school events, competitions, and activities</p>
        </div>

        {/* Search & Filter Bar */}
        <div className={`rounded-xl border p-6 mb-6 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <FiSearch className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                className={`w-full rounded-lg pl-12 pr-4 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'}`}
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={`rounded-lg px-4 py-2 ${isDark ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
              <span className="text-gray-500 text-sm">{registeredEvents.length} Registered</span>
            </div>
          </div>

          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.key
                    ? 'bg-orange-500 text-white'
                    : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event, index) => (
            <div 
              key={index}
              className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 text-xs rounded ${event.color} text-gray-600`}>
                  {event.category}
                </span>
                {event.icon === 'trophy' ? (
                  <TrophyIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <BookIcon className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <h3 className={`font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{event.title}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <FiCalendar className="w-4 h-4" />
                {event.date}
              </div>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{event.description}</p>
              <button 
                onClick={() => handleRegister(event.title)}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRegistered(event.title)
                    ? `${isDark ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-green-100 text-green-700 border border-green-300'}`
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isRegistered(event.title) ? 'Registered ✓' : 'Register Now'}
              </button>
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