import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiSave, FiLoader, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { authAPI } from '@/services/api';

const TrophyIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
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

// Normalize incoming sports_activities to the admin structure:
// { sportsPlayed: [], achievements: [], competitions: [], skills: [] }
const normalizeSportsActivities = (data) => {
  if (!data || typeof data !== 'object') {
    return { sportsPlayed: [], achievements: [], competitions: [], skills: [] };
  }
  return {
    sportsPlayed: Array.isArray(data.sportsPlayed) ? data.sportsPlayed : [],
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    competitions: Array.isArray(data.competitions) ? data.competitions : [],
    skills: Array.isArray(data.skills) ? data.skills : []
  };
};

const SportsActivitiesForm = ({ onCancel, onBack }) => {
  const { user: currentUser, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // State for sports activities (using admin structure)
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [customActivities, setCustomActivities] = useState([]);
  const [customForm, setCustomForm] = useState({ name: '', years: '', achievements: '' });

  // Backup for cancel
  const [originalData, setOriginalData] = useState(null);

  // Load existing data from currentUser.student.sports_activities
  useEffect(() => {
    if (currentUser && currentUser.student) {
      const rawSports = currentUser.student.sports_activities;
      const normalized = normalizeSportsActivities(rawSports);
      setSelectedInterests(normalized.sportsPlayed);
      // Convert any existing achievements into custom activities if needed
      const custom = normalized.achievements.map(ach => ({
        name: ach,
        years: '',
        achievements: ach
      }));
      setCustomActivities(custom);
      setOriginalData({
        selectedInterests: [...normalized.sportsPlayed],
        customActivities: custom.map(a => ({ ...a }))
      });
      setLoading(false);
    } else if (currentUser === null) {
      setLoading(false);
    } else if (currentUser && !currentUser.student) {
      showToast('Student profile not found', 'error');
      setLoading(false);
    }
  }, [currentUser, showToast]);

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
    } else {
      showToast('Activity name is required', 'warning');
    }
  };

  const removeCustomActivity = (index) => {
    setCustomActivities(customActivities.filter((_, i) => i !== index));
  };

  const handleEdit = () => {
    setOriginalData({
      selectedInterests: [...selectedInterests],
      customActivities: customActivities.map(a => ({ ...a }))
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (originalData) {
      setSelectedInterests(originalData.selectedInterests);
      setCustomActivities(originalData.customActivities.map(a => ({ ...a })));
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Build the payload using the admin structure
      const achievements = customActivities
        .filter(a => a.name.trim())
        .map(a => a.achievements || a.name);

      const payload = {
        sports_activities: {
          sportsPlayed: selectedInterests,
          achievements: achievements,
          competitions: [], // can be extended later
          skills: []        // can be extended later
        }
      };

      await authAPI.updateProfile(payload);
      showToast('Sports activities updated successfully!', 'success');
      await refreshUser();

      setOriginalData({
        selectedInterests: [...selectedInterests],
        customActivities: customActivities.map(a => ({ ...a }))
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to update sports activities';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Render read-only display of interests as tags
  const renderInterestsReadOnly = () => {
    if (selectedInterests.length === 0) {
      return <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {selectedInterests.map((interest, idx) => (
          <span key={idx} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
            {interest}
          </span>
        ))}
      </div>
    );
  };

  // Render read-only custom activities (achievements)
  const renderCustomActivitiesReadOnly = () => {
    if (customActivities.length === 0) {
      return <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>;
    }
    return (
      <div className="space-y-2">
        {customActivities.map((activity, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="font-medium text-gray-800 dark:text-gray-100">{activity.name}</p>
            {(activity.years || activity.achievements) && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {activity.years && `Years: ${activity.years}`}
                {activity.years && activity.achievements && ' • '}
                {activity.achievements && activity.achievements}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const inputClass = `w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-gray-50 dark:bg-[#18181B] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`;
  const labelClass = `text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
        <FiLoader className="w-8 h-8 animate-spin text-orange-500 dark:text-orange-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-zinc-900">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center text-sm font-medium mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto rounded-xl shadow-sm overflow-hidden bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Sports & Activities</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Select Your Interests (Sports Played) */}
            <div>
              <label className={labelClass}>Sports & Activities Played</label>
              {isEditing ? (
                <>
                  <p className="text-xs mb-4 text-gray-500 dark:text-gray-400">
                    Click on activities you participate in
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedActivities.map((activity, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleInterest(activity)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${selectedInterests.includes(activity)
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                          }`}
                      >
                        {activity}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-1 p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700 min-h-[42px]">
                  {renderInterestsReadOnly()}
                </div>
              )}
            </div>

            {/* Section 2: Achievements / Custom Activities */}
            <div className={`${isEditing ? 'border-2 border-dashed rounded-lg p-6 border-gray-300 dark:border-gray-700' : ''}`}>
              <label className={labelClass}>Achievements & Awards</label>
              {isEditing ? (
                <>
                  <p className="text-xs mb-4 text-gray-500 dark:text-gray-400">
                    Add any awards or notable achievements
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Achievement Title *
                      </label>
                      <input
                        type="text"
                        value={customForm.name}
                        onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                        className={inputClass}
                        placeholder="e.g., Regional Champion"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Year / Details
                      </label>
                      <input
                        type="text"
                        value={customForm.years}
                        onChange={(e) => setCustomForm({ ...customForm, years: e.target.value })}
                        className={inputClass}
                        placeholder="e.g., 2024"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customForm.achievements}
                        onChange={(e) => setCustomForm({ ...customForm, achievements: e.target.value })}
                        className={inputClass}
                        placeholder="Describe the achievement"
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

                  {customActivities.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Added Achievements:</p>
                      {customActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                        >
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-100">{activity.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.years && `Year: ${activity.years}`}
                              {activity.achievements && ` • ${activity.achievements}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomActivity(index)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-1 p-2.5 bg-gray-50 dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-gray-700">
                  {renderCustomActivitiesReadOnly()}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
                  >
                    {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Activities
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SportsActivitiesForm;