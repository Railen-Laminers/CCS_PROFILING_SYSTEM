import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiSave } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

const TrophyIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const predefinedActivities = [
  'Basketball', 'Volleyball', 'Programming', 'Quiz Bee', 'Chess', 'Football/Soccer', 
  'Swimming', 'Track and Field', 'Badminton', 'Table Tennis', 'Dance', 'Music/Band', 
  'Art/Painting', 'Drama/Theater', 'Debate', 'Robotics', 'Science Club', 'Math Club', 
  'Writing/Journalism', 'Photography', 'Coding Club', 'Student Council', 'Environmental Club', 
  'Taekwondo/Martial Arts', 'Baseball', 'Tennis', 'Cheerleading', 'Choir/Singing', 
  'Gaming/Esports', 'Cooking/Culinary', 'Gardening', 'Archery', 'Cycling', 'Skateboarding', 'Yoga/Fitness'
];

const SportsActivitiesForm = ({ onCancel, onBack }) => {
  const { isDark } = useTheme();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [customActivities, setCustomActivities] = useState([]);
  const [customForm, setCustomForm] = useState({ name: '', years: '', achievements: '' });

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const addCustomActivity = () => {
    if (customForm.name.trim()) {
      setCustomActivities([...customActivities, { ...customForm }]);
      setCustomForm({ name: '', years: '', achievements: '' });
    }
  };

  const removeCustomActivity = (index) => {
    setCustomActivities(customActivities.filter((_, i) => i !== index));
  };

  const inputClass = `w-full p-2.5 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`;
  const labelClass = `text-sm font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      selectedInterests,
      customActivities
    };
    console.log('Form submitted:', formData);
  };

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

      {/* Main Card */}
      <div className={`max-w-4xl mx-auto rounded-xl shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        <div className="p-8">
          {/* Header */}
          <div className={`flex items-center gap-2 mb-6 pb-2 ${isDark ? 'border-gray-700' : 'border-gray-50'}`}>
            <TrophyIcon className="w-5 h-5 text-orange-500" />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Sports & Activities</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Select Your Interests */}
            <div>
              <label className={labelClass}>Select Your Interests</label>
              <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Click on activities you're interested in or participating in</p>
              <div className="flex flex-wrap gap-2">
                {predefinedActivities.map((activity, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleInterest(activity)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                      selectedInterests.includes(activity)
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-lg border border-dashed text-sm font-medium flex items-center gap-1 ${isDark ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                >
                  <FiPlus className="w-3 h-3" />
                  Other
                </button>
              </div>
            </div>

            {/* Section 2: Add Custom Activity */}
            <div className={`border-2 border-dashed rounded-lg p-6 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
              <label className={labelClass}>Add Custom Activity</label>
              <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Can't find your activity above? Add it here with details</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Sport/Activity Name *</label>
                  <input 
                    type="text" 
                    value={customForm.name}
                    onChange={(e) => setCustomForm({...customForm, name: e.target.value})}
                    className={inputClass}
                    placeholder="e.g., Basketball, Swimming"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Years Active</label>
                  <input 
                    type="text" 
                    value={customForm.years}
                    onChange={(e) => setCustomForm({...customForm, years: e.target.value})}
                    className={inputClass}
                    placeholder="e.g., 2020-2026"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Achievements & Awards</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={customForm.achievements}
                    onChange={(e) => setCustomForm({...customForm, achievements: e.target.value})}
                    className={inputClass}
                    placeholder="Enter achievement or award"
                  />
                  <button 
                    type="button"
                    onClick={addCustomActivity}
                    className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button 
                type="button"
                onClick={addCustomActivity}
                className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <FiPlus className="w-4 h-4 text-orange-500" />
                Add Activity
              </button>

              {/* Custom Activities List */}
              {customActivities.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Added Activities:</p>
                  {customActivities.map((activity, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
                    >
                      <div>
                        <p className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{activity.name}</p>
                        <p className="text-xs text-gray-500">{activity.years && `Years: ${activity.years}`} {activity.achievements && `• ${activity.achievements}`}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomActivity(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button 
                type="button" 
                onClick={onCancel}
                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SportsActivitiesForm;