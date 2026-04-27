import React, { useState, useEffect } from 'react';
import { FiPlus, FiSave, FiLoader, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { authAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const TrophyIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

// Consistent styling from Profile page
const labelClasses = 'block text-[12px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1';
const inputClasses = (error, touched, value) => {
  const hasError = error && touched;
  const isValid = touched && !error && value && value.toString().trim() !== '';
  return `w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] text-gray-900 dark:text-white border ${hasError
    ? 'border-red-500 ring-red-500/10'
    : isValid
      ? 'border-green-500/40 dark:border-green-500/30 bg-green-500/[0.02]'
      : 'border-gray-200 dark:border-gray-800'
    } rounded-xl focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 text-[14px]`;
};

const predefinedActivities = [
  'Basketball', 'Volleyball', 'Programming', 'Quiz Bee', 'Chess', 'Football/Soccer',
  'Swimming', 'Track and Field', 'Badminton', 'Table Tennis', 'Dance', 'Music/Band',
  'Art/Painting', 'Drama/Theater', 'Debate', 'Robotics', 'Science Club', 'Math Club',
  'Writing/Journalism', 'Photography', 'Coding Club', 'Student Council', 'Environmental Club',
  'Taekwondo/Martial Arts', 'Baseball', 'Tennis', 'Cheerleading', 'Choir/Singing',
  'Gaming/Esports', 'Cooking/Culinary', 'Gardening', 'Archery', 'Cycling', 'Skateboarding', 'Yoga/Fitness'
];

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

const SportsActivitiesForm = () => {
  const { user: currentUser, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [customActivities, setCustomActivities] = useState([]);
  const [customForm, setCustomForm] = useState({ name: '', years: '', achievements: '' });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.student) {
      const rawSports = currentUser.student.sports_activities;
      const normalized = normalizeSportsActivities(rawSports);
      setSelectedInterests(normalized.sportsPlayed);
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
      const achievements = customActivities
        .filter(a => a.name.trim())
        .map(a => a.achievements || a.name);

      const payload = {
        sports_activities: {
          sportsPlayed: selectedInterests,
          achievements: achievements,
          competitions: [],
          skills: []
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

  const renderInterestsReadOnly = () => {
    if (selectedInterests.length === 0) return <span className="text-gray-500 dark:text-gray-400 text-sm">—</span>;
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

  const renderCustomActivitiesReadOnly = () => {
    if (customActivities.length === 0) return <span className="text-gray-500 dark:text-gray-400 text-sm">—</span>;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b00]" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-12">

      <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
          <CardTitle className="text-[16px] font-bold flex items-center gap-3">
            <div className="bg-[#ff6b00]/10 p-2 rounded-lg border border-[#ff6b00]/20">
              <TrophyIcon className="w-5 h-5 text-[#ff6b00]" />
            </div>
            Sports & Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sports & Activities Played */}
            <div className="space-y-2">
              <label className={labelClasses}>Sports & Activities Played</label>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {predefinedActivities.map((activity, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleInterest(activity)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${selectedInterests.includes(activity)
                        ? 'bg-[#ff6b00] text-white border-[#ff6b00]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                        }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[44px] px-4 py-2 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[14px]">
                  {renderInterestsReadOnly()}
                </div>
              )}
            </div>

            {/* Achievements & Awards */}
            <div className="space-y-2">
              <label className={labelClasses}>Achievements & Awards</label>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Achievement Title *</label>
                      <input
                        type="text"
                        value={customForm.name}
                        onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                        className={inputClasses(false, false, customForm.name)}
                        placeholder="e.g., Regional Champion"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Year</label>
                      <input
                        type="text"
                        value={customForm.years}
                        onChange={(e) => setCustomForm({ ...customForm, years: e.target.value })}
                        className={inputClasses(false, false, customForm.years)}
                        placeholder="e.g., 2024"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Description</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customForm.achievements}
                        onChange={(e) => setCustomForm({ ...customForm, achievements: e.target.value })}
                        className={inputClasses(false, false, customForm.achievements)}
                        placeholder="Describe the achievement"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addCustomActivity}
                        className="rounded-xl w-11 h-11 p-0"
                      >
                        <FiPlus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {customActivities.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Added Achievements:</p>
                      <div className="space-y-2">
                        {customActivities.map((activity, idx) => (
                          <div
                            key={idx}
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
                              onClick={() => removeCustomActivity(idx)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full min-h-[44px] px-4 py-2 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[14px]">
                  {renderCustomActivitiesReadOnly()}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={handleCancelEdit} className="gap-2">
                    <FiX className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="gap-2 bg-[#ff6b00] hover:bg-orange-600">
                    {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={handleEdit} className="gap-2 bg-[#ff6b00] hover:bg-orange-600">
                  <FiEdit2 className="w-4 h-4" />
                  Edit Activities
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SportsActivitiesForm;