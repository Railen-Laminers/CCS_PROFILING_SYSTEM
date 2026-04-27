import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { FiBriefcase, FiBook, FiCalendar, FiFolder, FiAward, FiEdit2, FiSave, FiX, FiPlus } from 'react-icons/fi';
import { authAPI, instructionAPI } from '@/services/api';

const SectionCard = ({ icon: Icon, title, children }) => {
    const { isDark } = useTheme();
    return (
        <div className={`${isDark ? 'bg-[#181818]' : 'bg-white'} rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-3 mb-4">
                <Icon className="w-5 h-5 text-[#ff6b00]" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
            </div>
            {children}
        </div>
    );
};

const TagList = ({ items, emptyText = "None", onRemove, removable = false }) => (
    <div className="flex flex-wrap gap-2">
        {items && items.length > 0 ? (
            items.map((item, idx) => (
                <span key={idx} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full flex items-center gap-2">
                    {typeof item === 'object' ? item.title || JSON.stringify(item) : item}
                    {removable && onRemove && (
                        <button onClick={() => onRemove(idx)} className="text-red-500 hover:text-red-700">
                            <FiX size={14} />
                        </button>
                    )}
                </span>
            ))
        ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">{emptyText}</span>
        )}
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className="flex flex-wrap py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-32">{label}</span>
        <span className="text-sm text-gray-800 dark:text-white flex-1">{value || '—'}</span>
    </div>
);

const FacultySkills = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { user, refreshUser, loading } = useAuth();
    const { showToast } = useToast();

    // Read/Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [faculty, setFaculty] = useState(null);
    const [formData, setFormData] = useState({
        specialization: '',
        research_projects: []
    });
    const [teachingSchedule, setTeachingSchedule] = useState([]);

    useEffect(() => {
        if (user && user.role === 'faculty' && user.faculty) {
            setFaculty(user.faculty);
            setFormData({
                specialization: user.faculty.specialization || '',
                research_projects: user.faculty.research_projects || []
            });

            // Dynamically fetch the teaching schedule
            const fetchSchedule = async () => {
                try {
                    const classes = await instructionAPI.getClasses({ instructor_id: user.faculty._id });
                    setTeachingSchedule(Array.isArray(classes) ? classes : []);
                } catch (err) {
                    console.error('Failed to fetch teaching schedule:', err);
                }
            };
            fetchSchedule();
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await authAPI.updateProfile({
                specialization: formData.specialization,
                research_projects: formData.research_projects
            });
            await refreshUser();
            showToast('Skills updated successfully', 'success');
            setIsEditing(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Update failed', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original faculty data
        if (faculty) {
            setFormData({
                specialization: faculty.specialization || '',
                research_projects: faculty.research_projects || []
            });
        }
        setIsEditing(false);
    };

    const addResearchProject = () => {
        const title = prompt('Project title:');
        if (!title) return;
        const description = prompt('Description (optional):') || '';
        const role = prompt('Your role (e.g., Lead, Co-investigator):') || '';
        const year = prompt('Year (e.g., 2024):') || '';
        setFormData(prev => ({
            ...prev,
            research_projects: [...prev.research_projects, { title, description, role, year }]
        }));
    };

    const removeResearchProject = (index) => {
        setFormData(prev => ({
            ...prev,
            research_projects: prev.research_projects.filter((_, i) => i !== index)
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!user || user.role !== 'faculty') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-red-500">Access denied. Faculty only area.</div>
            </div>
        );
    }

    const data = faculty || {};
    const scheduledSubjects = [...new Set(teachingSchedule.map(cls => {
        const code = cls.course_id?.course_code;
        const title = cls.course_id?.course_title;
        if (code && title) return `${code} - ${title}`;
        return code || title;
    }).filter(Boolean))];
    const researchProjects = data.research_projects || [];

    // Combine specialization and subjects into a skills list for read mode
    const skillsList = [];
    if (data.specialization) {
        skillsList.push(...data.specialization.split(',').map(s => s.trim()));
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} p-6 lg:p-8`}>
            <div className="max-w-5xl mx-auto">
                {/* Header with title and edit/save buttons */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                            Skills & Expertise
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {isEditing ? 'Edit your professional competencies' : 'View your professional competencies'}
                        </p>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                        >
                            <FiEdit2 /> Edit
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <FiX /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : <><FiSave /> Save</>}
                            </button>
                        </div>
                    )}
                </div>

                {!isEditing ? (
                    // ========== READ MODE ==========
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SectionCard icon={FiBriefcase} title="Professional Information">
                            <InfoRow label="Department" value={data.department} />
                            <InfoRow label="Position" value={data.position} />
                            <InfoRow label="Specialization" value={data.specialization} />
                        </SectionCard>

                        <SectionCard icon={FiBook} title="Subjects Handled">
                            <TagList items={scheduledSubjects} emptyText="No subjects assigned in schedule" />
                        </SectionCard>

                        <SectionCard icon={FiCalendar} title="Teaching Schedule">
                            {teachingSchedule.length > 0 ? (
                                <div className="space-y-3">
                                    {teachingSchedule.map((sched, idx) => (
                                        <div key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-2 last:pb-0">
                                            <div className="text-sm font-medium text-gray-800 dark:text-white">
                                                {sched.course_id?.course_code || `Course ${idx + 1}`} {sched.course_id?.course_title ? `- ${sched.course_id.course_title}` : ''}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {sched.schedule?.date} • {sched.schedule?.startTime} – {sched.schedule?.endTime}
                                                {sched.room_id && ` • Room: ${sched.room_id.name}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No teaching schedule available.</p>
                            )}
                        </SectionCard>

                        <SectionCard icon={FiFolder} title="Research Projects">
                            {researchProjects.length > 0 ? (
                                <div className="space-y-4">
                                    {researchProjects.map((project, idx) => (
                                        <div key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-3 last:pb-0">
                                            <div className="text-sm font-semibold text-gray-800 dark:text-white">
                                                {project.title || `Project ${idx + 1}`}
                                            </div>
                                            {project.description && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                                            )}
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {project.role && (
                                                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">
                                                        Role: {project.role}
                                                    </span>
                                                )}
                                                {project.year && (
                                                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">
                                                        Year: {project.year}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No research projects recorded.</p>
                            )}
                        </SectionCard>

                        <div className="md:col-span-2">
                            <SectionCard icon={FiAward} title="Skills & Competencies">
                                <TagList items={[...new Set(skillsList)]} emptyText="No skills listed" />
                            </SectionCard>
                        </div>
                    </div>
                ) : (
                    // ========== EDIT MODE ==========
                    <div className="space-y-6">
                        <SectionCard icon={FiBriefcase} title="Professional Information">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Specialization
                                </label>
                                <input
                                    type="text"
                                    value={formData.specialization}
                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                    placeholder="e.g., Data Science, Web Development, Cybersecurity"
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate multiple specializations with commas if needed</p>
                            </div>
                            <InfoRow label="Department" value={data.department} />
                            <InfoRow label="Position" value={data.position} />
                        </SectionCard>

                        <SectionCard icon={FiBook} title="Subjects Handled (Read-Only)">
                            <TagList items={scheduledSubjects} emptyText="No subjects assigned in schedule" />
                        </SectionCard>

                        <SectionCard icon={FiFolder} title="Research Projects">
                            <div className="mb-4">
                                <button
                                    onClick={addResearchProject}
                                    className="flex items-center gap-2 text-brand-500 hover:text-brand-600 text-sm"
                                >
                                    <FiPlus /> Add Research Project
                                </button>
                            </div>
                            {formData.research_projects.length > 0 ? (
                                <div className="space-y-3">
                                    {formData.research_projects.map((project, idx) => (
                                        <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 relative">
                                            <button
                                                onClick={() => removeResearchProject(idx)}
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            >
                                                <FiX size={16} />
                                            </button>
                                            <div className="text-sm font-semibold">{project.title || 'Untitled'}</div>
                                            {project.description && (
                                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{project.description}</div>
                                            )}
                                            <div className="flex gap-2 mt-2 text-xs text-gray-500">
                                                {project.role && <span>Role: {project.role}</span>}
                                                {project.year && <span>Year: {project.year}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No research projects added.</p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                                To edit a project, remove and re-add it. For advanced editing, contact admin.
                            </p>
                        </SectionCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacultySkills;