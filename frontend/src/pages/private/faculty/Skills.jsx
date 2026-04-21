import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { FiBriefcase, FiBook, FiCalendar, FiFolder, FiAward, FiCpu } from 'react-icons/fi';

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

const TagList = ({ items, emptyText = "None" }) => (
    <div className="flex flex-wrap gap-2">
        {items && items.length > 0 ? (
            items.map((item, idx) => (
                <span key={idx} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                    {item}
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

export const FacultySkills = () => {
    const { isDark } = useTheme();
    const { user, loading } = useAuth();
    const [faculty, setFaculty] = useState(null);

    useEffect(() => {
        if (user && user.role === 'faculty' && user.faculty) {
            setFaculty(user.faculty);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="text-gray-500 dark:text-gray-400">Loading faculty information...</div>
            </div>
        );
    }

    if (!user || user.role !== 'faculty') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="text-red-500">Access denied. Faculty only area.</div>
            </div>
        );
    }

    const data = faculty || {};
    const subjectsHandled = data.subjects_handled || [];
    const teachingSchedule = data.teaching_schedule || [];
    const researchProjects = data.research_projects || [];

    // Combine specialization and subjects into a skills list
    const skillsList = [];
    if (data.specialization) {
        skillsList.push(...data.specialization.split(',').map(s => s.trim()));
    }
    skillsList.push(...subjectsHandled);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} p-6 lg:p-8`}>
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                        Skills & Expertise
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Your professional competencies and academic specialties
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Professional Details */}
                    <SectionCard icon={FiBriefcase} title="Professional Information">
                        <InfoRow label="Department" value={data.department} />
                        <InfoRow label="Position" value={data.position} />
                        <InfoRow label="Specialization" value={data.specialization} />
                    </SectionCard>

                    {/* Subjects Handled */}
                    <SectionCard icon={FiBook} title="Subjects Handled">
                        <TagList items={subjectsHandled} emptyText="No subjects assigned" />
                    </SectionCard>

                    {/* Teaching Schedule */}
                    <SectionCard icon={FiCalendar} title="Teaching Schedule">
                        {teachingSchedule.length > 0 ? (
                            <div className="space-y-3">
                                {teachingSchedule.map((sched, idx) => (
                                    <div key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-2 last:pb-0">
                                        <div className="text-sm font-medium text-gray-800 dark:text-white">
                                            {sched.courseCode || sched.course || `Course ${idx + 1}`}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {sched.day || sched.date} • {sched.startTime} – {sched.endTime}
                                            {sched.room && ` • Room: ${sched.room}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No teaching schedule available.</p>
                        )}
                    </SectionCard>

                    {/* Research Projects */}
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
                                        {project.role && (
                                            <span className="inline-block mt-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">
                                                Role: {project.role}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No research projects recorded.</p>
                        )}
                    </SectionCard>
                </div>

                {/* Consolidated Skills & Expertise */}
                <div className="mt-6">
                    <SectionCard icon={FiAward} title="Skills & Competencies">
                        <TagList items={[...new Set(skillsList)]} emptyText="No skills listed" />
                    </SectionCard>
                </div>
            </div>
        </div>
    );
};

export default FacultySkills;