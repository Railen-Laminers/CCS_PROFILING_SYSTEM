import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { authAPI, instructionAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FiBriefcase, FiBook, FiCalendar, FiFolder, FiAward, FiEdit2, FiSave, FiX, FiPlus } from 'react-icons/fi';

// Reusable styling from Profile page
const labelClasses = 'block text-[12px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1';

const SectionCard = ({ icon: Icon, title, children }) => {
    return (
        <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
                <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                    <div className="bg-[#ff6b00]/10 p-2 rounded-lg border border-[#ff6b00]/20">
                        <Icon className="w-5 h-5 text-[#ff6b00]" />
                    </div>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                {children}
            </CardContent>
        </Card>
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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b00]" />
            </div>
        );
    }

    if (!user || user.role !== 'faculty') {
        return (
            <div className="flex justify-center items-center h-64">
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
        <div className="w-full space-y-8 pb-12">
            {/* Header with title and edit/save buttons */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        Skills & Expertise
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                        {isEditing ? 'Edit your professional competencies' : 'View your professional competencies'}
                    </p>
                </div>
                {!isEditing ? (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="gap-2 bg-[#ff6b00] hover:bg-orange-600"
                    >
                        <FiEdit2 className="w-4 h-4" />
                        Edit
                    </Button>
                ) : (
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="gap-2"
                        >
                            <FiX className="w-4 h-4" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="gap-2 bg-[#ff6b00] hover:bg-orange-600"
                        >
                            {isSaving ? 'Saving...' : <><FiSave className="w-4 h-4" /> Save</>}
                        </Button>
                    </div>
                )}
            </div>

            {!isEditing ? (
                // ========== READ MODE ==========
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <div className="space-y-8">
                    <SectionCard icon={FiBriefcase} title="Professional Information">
                        <div className="space-y-4">
                            <div>
                                <label className={labelClasses}>Specialization</label>
                                <input
                                    type="text"
                                    value={formData.specialization}
                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    className="w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 text-[14px]"
                                    placeholder="e.g., Data Science, Web Development, Cybersecurity"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate multiple specializations with commas if needed</p>
                            </div>
                            <InfoRow label="Department" value={data.department} />
                            <InfoRow label="Position" value={data.position} />
                        </div>
                    </SectionCard>

                    <SectionCard icon={FiBook} title="Subjects Handled (Read-Only)">
                        <TagList items={scheduledSubjects} emptyText="No subjects assigned in schedule" />
                    </SectionCard>

                    <SectionCard icon={FiFolder} title="Research Projects">
                        <div className="mb-4">
                            <Button
                                type="button"
                                onClick={addResearchProject}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <FiPlus className="w-4 h-4" />
                                Add Research Project
                            </Button>
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
                                        <div className="text-sm font-semibold text-gray-800 dark:text-white">{project.title || 'Untitled'}</div>
                                        {project.description && (
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{project.description}</div>
                                        )}
                                        <div className="flex gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            {project.role && <span>Role: {project.role}</span>}
                                            {project.year && <span>Year: {project.year}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No research projects added.</p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            To edit a project, remove and re-add it. For advanced editing, contact admin.
                        </p>
                    </SectionCard>
                </div>
            )}
        </div>
    );
};

export default FacultySkills;