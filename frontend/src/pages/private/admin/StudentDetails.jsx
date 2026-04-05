import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiArrowLeft, FiEdit2, FiPrinter, FiMail, FiPhone, FiAlertCircle,
    FiAward, FiActivity, FiUsers, FiAlertTriangle, FiCalendar, FiFileText, FiUser, FiMapPin
} from 'react-icons/fi';
import StudentFormModal from '../../../components/forms/StudentFormModal';
import StudentReport from '../../../components/reports/StudentReport';
import { useStudentDetails } from '../../../hooks/useStudentDetails';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { BulletList, SectionSubhead, renderTags } from '@/lib/studentHelpers';

const TAB_LIST = [
    'Student Information',
    'Academic Record',
    'Medical Record',
    'Sports & Activities',
    'Organizations',
    'Behavior & Discipline',
    'Events & Competitions'
];

const formatYearLevel = (level) => {
    if (!level) return null;
    const suffixes = { 1: 'st', 2: 'nd', 3: 'rd' };
    const suffix = suffixes[level] || 'th';
    return `${level}${suffix} Year`;
};

const StudentDetails = () => {
    const navigate = useNavigate();
    const {
        student,
        loading,
        error,
        activeTab,
        isTabLoading,
        academicRecords,
        isAcademicLoading,
        academicError,
        curricularEvents,
        isCurricularLoading,
        allParticipatedEvents,
        isAllEventsLoading,
        modalOpen,
        setModalOpen,
        modalData,
        componentRef,
        handlePrintRequest,
        handleEdit,
        handleTabChange,
        fetchStudent,
        showToast,
    } = useStudentDetails();

    // ── Loading State ────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F97316]"></div>
            </div>
        );
    }

    // ── Error State ──────────────────────────────────────────────
    if (error) {
        return (
            <div className="max-w-7xl mx-auto py-12">
                <button 
                    onClick={() => navigate('/students')}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2 transition-colors"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    Back to Students
                </button>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                    <FiAlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                    <p className="text-red-700 dark:text-red-300 font-semibold mb-1">Error Loading Student</p>
                    <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // ── Not Found State ──────────────────────────────────────────
    if (!student) {
        return <div className="text-center py-20 text-gray-500">Student not found.</div>;
    }

    const fullName = [student.firstname, student.middlename, student.lastname].filter(Boolean).join(' ');
    const initials = student.firstname?.[0] || 'S';
    const profile = student.student;
    const isActive = student.is_active;
    const yearSection = [formatYearLevel(profile?.year_level), profile?.section ? `Section ${profile.section}` : null].filter(Boolean).join(' - ');

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
            {/* Header / Back */}
            <button 
                onClick={() => navigate('/students')}
                className="group flex items-center gap-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-all duration-200"
            >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-[#252525] group-hover:-translate-x-1 transition-all duration-200 flex-shrink-0">
                    <FiArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="group-hover:underline decoration-gray-300 dark:decoration-gray-600 underline-offset-4">Back to Students</span>
            </button>

            {/* Profile Overview Card */}
            <Card className="p-6 mb-6 bg-white dark:bg-[#1E1E1E] rounded-[1rem] shadow-sm border border-gray-200 dark:border-gray-800 transition-all overflow-hidden relative">
                <div className="absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/80 dark:ring-white/5 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-[120px] h-[120px] rounded-[32px] bg-gradient-to-br from-violet-500 to-brand-400 text-white flex items-center justify-center text-5xl font-bold shadow-xl flex-shrink-0 ring-4 ring-white dark:ring-[#1E1E1E] hover:rotate-3 transition-transform duration-300">
                            {initials}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{fullName}</h1>
                            <p className="text-base font-medium text-gray-500 dark:text-gray-400 mb-4">{student.user_id}</p>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {profile?.program && (
                                    <span className="bg-[#F97316] text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
                                        {profile.program}
                                    </span>
                                )}
                                {yearSection && (
                                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-xs font-bold">
                                        {yearSection}
                                    </span>
                                )}
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                    isActive
                                        ? 'bg-[#00C950] dark:bg-green-500/10 text-[#fff] dark:text-green-400 border-green-200 dark:border-green-500/20'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                                }`}>
                                    {isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex items-center flex-wrap gap-x-10 gap-y-3 mt-6 text-sm text-gray-600 dark:text-gray-400 font-normal">
                                <div className="flex items-center gap-2.5">
                                    <FiMail className="w-4 h-4 text-[#F97316]" /> 
                                    <span>{student.email}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <FiPhone className="w-4 h-4 text-[#F97316]" /> 
                                    <span>{student.contact_number || 'Not Provided'}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <FiMapPin className="w-4 h-4 text-[#F97316]" /> 
                                    <span>{student.address || 'Not Provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <Button 
                            variant="secondary" 
                            className="flex-1 md:flex-none gap-2"
                            onClick={handlePrintRequest}
                        >
                            <FiPrinter className="w-4 h-4" /> Print
                        </Button>
                        <Button variant="primary" className="flex-1 md:flex-none gap-2" onClick={handleEdit}>
                            <FiEdit2 className="w-4 h-4" /> Edit Profile
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Tabs Navigation */}
            <div className="flex space-x-2 mb-6 overflow-x-auto p-2 bg-gray-100 dark:bg-[#252525] rounded-[1.25rem] border border-gray-200 dark:border-gray-800 scrollbar-hide shadow-inner relative overflow-hidden">
                {TAB_LIST.map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all rounded-[1.25rem] relative z-10 focus:outline-none ${activeTab === tab
                                ? 'bg-white dark:bg-[#1E1E1E] text-brand-600 dark:text-brand-500 shadow-sm ring-1 ring-zinc-200 dark:ring-white/10 backdrop-blur-md'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-[#2C2C2C]'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <Card className="p-6 bg-white dark:bg-[#1E1E1E] rounded-[1rem] shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/80 dark:ring-white/5 pointer-events-none"></div>
                {isTabLoading ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300">

                        {/* 1. Student Information */}
                        {activeTab === 'Student Information' && (
                            <div className="space-y-6">
                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    <div className="flex items-center gap-2 mb-6 text-[#F97316]">
                                        <FiUser className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                                        <div><SectionSubhead>Full Name</SectionSubhead><p className="text-base font-semibold text-gray-900 dark:text-gray-100">{fullName}</p></div>
                                        <div><SectionSubhead>Student ID</SectionSubhead><p className="text-base font-semibold text-gray-900 dark:text-gray-100">{student.user_id}</p></div>
                                        <div><SectionSubhead>Gender</SectionSubhead><p className="text-base font-semibold text-gray-900 dark:text-gray-100 capitalize">{student.gender || 'Not Specified'}</p></div>
                                        <div><SectionSubhead>Birthdate</SectionSubhead><p className="text-base font-semibold text-gray-900 dark:text-gray-100">{formatDate(student.birth_date)}</p></div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    <div className="flex items-center gap-2 mb-6 text-[#F97316]">
                                        <FiPhone className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contact & Emergency Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div><SectionSubhead>Contact Number</SectionSubhead><p className="text-base font-semibold text-gray-900 dark:text-gray-100">{student.contact_number || 'Not Provided'}</p></div>
                                        <div><SectionSubhead>Email</SectionSubhead><p className="text-base font-semibold text-gray-900 dark:text-gray-100">{student.email}</p></div>
                                        <div className="md:col-span-2"><SectionSubhead>Address</SectionSubhead><p className="text-base font-semibold text-gray-900 dark:text-gray-100">{student.address || 'Not Provided'}</p></div>
                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            <div><SectionSubhead>Parent/Guardian</SectionSubhead><p className="text-base font-semibold text-gray-900 dark:text-gray-100">{profile?.parent_guardian_name ? `${profile.parent_guardian_name} - ${profile.emergency_contact || 'No Contact'}` : 'Not Provided'}</p></div>
                                            <div><SectionSubhead>Emergency Contact</SectionSubhead><p className="text-base font-semibold text-gray-900 dark:text-gray-100">{profile?.emergency_contact || 'Not Provided'}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Academic Record */}
                        {activeTab === 'Academic Record' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-[#F97316]">
                                    <FiAward className="w-5 h-5" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Academic Performance</h3>
                                </div>
                                {isAcademicLoading ? (
                                    <div className="flex justify-center items-center py-20">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
                                    </div>
                                ) : academicError ? (
                                    <div className="text-center py-12 text-red-500 font-medium bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                                        <FiAlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                                        {academicError}
                                    </div>
                                ) : academicRecords.length === 0 ? (
                                    <EmptyState 
                                        size="md"
                                        icon={FiFileText} 
                                        title="No Academic Records" 
                                        description="There are no academic records on file for this student." 
                                    />
                                ) : (
                                    <div className="space-y-6">
                                        {academicRecords.map((record) => (
                                            <div key={record.id} className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex flex-col gap-0.5">
                                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                            {formatYearLevel(record.year_level) || 'Year Level N/A'}
                                                        </p>
                                                        <p className="text-sm font-medium text-zinc-500 dark:text-gray-400">
                                                            {record.semester || 'Semester N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-zinc-600 dark:text-gray-400 mb-1">GPA</p>
                                                        <p className="text-3xl font-extrabold text-[#F97316] leading-none">
                                                            {record.gpa ? Number(record.gpa).toFixed(2) : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                                    <div>
                                                        <SectionSubhead>Current Subjects</SectionSubhead>
                                                        {record.current_subjects?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2 mt-2">{record.current_subjects.map((sub, i) => <Badge key={i} variant="white">{sub}</Badge>)}</div>
                                                        ) : <p className="text-sm text-gray-500">None recorded</p>}
                                                    </div>
                                                    <div>
                                                        <SectionSubhead>Academic Awards</SectionSubhead>
                                                        {record.academic_awards?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2 mt-2">{record.academic_awards.map((award, i) => <Badge key={i} color="yellow">{award}</Badge>)}</div>
                                                        ) : <p className="text-sm text-gray-500">None recorded</p>}
                                                    </div>
                                                    <div>
                                                        <SectionSubhead>Curricular Participations</SectionSubhead>
                                                        {curricularEvents && curricularEvents.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {curricularEvents.map((event, i) => (
                                                                    <Badge key={i} color="indigo">{event.title}</Badge>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No curricular events joined</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. Medical Record */}
                        {activeTab === 'Medical Record' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-[#F97316]">
                                    <FiActivity className="w-5 h-5" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Medical Information</h3>
                                </div>
                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div><SectionSubhead>Blood Type</SectionSubhead><p className="text-base font-semibold text-gray-900 dark:text-gray-100">{profile?.blood_type || 'Not Provided'}</p></div>
                                        <div><SectionSubhead>Allergies</SectionSubhead>{renderTags(profile?.allergies, null, "red")}</div>
                                        <div><SectionSubhead>Medical Conditions</SectionSubhead><p className="text-base font-semibold text-gray-900 dark:text-gray-100">{profile?.medical_condition || 'None reported'}</p></div>
                                        <div><SectionSubhead>Disabilities</SectionSubhead>{renderTags(profile?.disabilities, null, "blue")}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. Sports & Activities */}
                        {activeTab === 'Sports & Activities' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-[#F97316]">
                                    <FiAward className="w-5 h-5" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sports and Athletic Activities</h3>
                                </div>
                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div><SectionSubhead>Sports Played</SectionSubhead>{renderTags(profile?.sports_activities, "sportsPlayed", "orange")}</div>
                                        <div><SectionSubhead>Athletic Achievements</SectionSubhead>{renderTags(profile?.sports_activities, "achievements", "yellow")}</div>
                                        <div><SectionSubhead>Competitions Joined</SectionSubhead><div className="mt-1"><BulletList items={profile?.sports_activities?.competitions} /></div></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. Organizations */}
                        {activeTab === 'Organizations' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-[#F97316]">
                                    <FiUsers className="w-5 h-5" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Organizations and Leadership</h3>
                                </div>
                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div><SectionSubhead>Clubs Joined</SectionSubhead>{renderTags(profile?.organizations, "clubs", "purple")}</div>
                                        <div><SectionSubhead>Student Council</SectionSubhead>{renderTags(profile?.organizations, "studentCouncil", "orange")}</div>
                                        <div><SectionSubhead>Leadership Roles</SectionSubhead><div className="mt-1"><BulletList items={profile?.organizations?.roles} /></div></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6. Behavior & Discipline */}
                        {activeTab === 'Behavior & Discipline' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-[#F97316]">
                                    <FiAlertTriangle className="w-5 h-5" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Behavior and Disciplinary Records</h3>
                                </div>
                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                                            <h4 className="text-sm font-medium text-zinc-600 dark:text-gray-400 mb-2">Warnings</h4>
                                            <p className="text-4xl font-extrabold text-yellow-500">{profile?.behavior_discipline_records?.warnings || 0}</p>
                                        </div>
                                        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                                            <h4 className="text-sm font-medium text-zinc-600 dark:text-gray-400 mb-2">Suspensions</h4>
                                            <p className="text-4xl font-extrabold text-red-500">{profile?.behavior_discipline_records?.suspensions || 0}</p>
                                        </div>
                                        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                                            <h4 className="text-sm font-medium text-zinc-600 dark:text-gray-400 mb-2">Counseling Sessions</h4>
                                            <p className="text-4xl font-extrabold text-blue-500">{profile?.behavior_discipline_records?.counseling || 0}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <div>
                                            <SectionSubhead>Incidents</SectionSubhead>
                                            <p className={`text-base font-semibold mt-1 ${profile?.behavior_discipline_records?.incidents ? 'text-gray-900 dark:text-gray-100' : 'text-green-600 dark:text-green-400'}`}>
                                                {profile?.behavior_discipline_records?.incidents || 'No incidents recorded'}
                                            </p>
                                        </div>
                                        <div>
                                            <SectionSubhead>Counseling Records</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                                {profile?.behavior_discipline_records?.counselingRecords || 'No counseling records'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 7. Events & Competitions */}
                        {activeTab === 'Events & Competitions' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-[#F97316]">
                                    <FiCalendar className="w-5 h-5" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Events and Competitions</h3>
                                </div>
                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    {isAllEventsLoading ? (
                                        <div className="flex justify-center py-10">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <SectionSubhead>Curricular Events</SectionSubhead>
                                                <div className="mt-4 space-y-3">
                                                    {allParticipatedEvents?.filter(e => e.category === 'Curricular').length > 0 ? (
                                                        allParticipatedEvents
                                                            .filter(e => e.category === 'Curricular')
                                                            .map((evt, i) => (
                                                                <div key={i} className="p-4 bg-white dark:bg-[#1E1E1E] border border-indigo-100 dark:border-indigo-900/30 rounded-xl shadow-sm group hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                                                                    <div className="flex justify-between items-start">
                                                                        <h5 className="font-bold text-indigo-700 dark:text-indigo-400">{evt.title}</h5>
                                                                        <Badge color={evt.status === 'Completed' ? 'green' : 'blue'}>{evt.status}</Badge>
                                                                    </div>
                                                                    {evt.start_datetime && (
                                                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                                            <FiCalendar className="w-3 h-3" /> {new Date(evt.start_datetime).toLocaleDateString()}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ))
                                                    ) : <p className="text-sm text-gray-500 italic">No curricular events joined</p>}
                                                </div>
                                            </div>
                                            <div>
                                                <SectionSubhead>Extra-Curricular Events</SectionSubhead>
                                                <div className="mt-4 space-y-3">
                                                    {allParticipatedEvents?.filter(e => e.category === 'Extra-Curricular').length > 0 ? (
                                                        allParticipatedEvents
                                                            .filter(e => e.category === 'Extra-Curricular')
                                                            .map((evt, i) => (
                                                                <div key={i} className="p-4 bg-white dark:bg-[#1E1E1E] border border-orange-100 dark:border-orange-900/30 rounded-xl shadow-sm group hover:border-orange-300 dark:hover:border-orange-700 transition-all">
                                                                    <div className="flex justify-between items-start">
                                                                        <h5 className="font-bold text-orange-700 dark:text-orange-400">{evt.title}</h5>
                                                                        <Badge color={evt.status === 'Completed' ? 'green' : 'blue'}>{evt.status}</Badge>
                                                                    </div>
                                                                    {evt.start_datetime && (
                                                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                                            <FiCalendar className="w-3 h-3" /> {new Date(evt.start_datetime).toLocaleDateString()}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ))
                                                    ) : <p className="text-sm text-gray-500 italic">No extra-curricular events joined</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </Card>

            {/* Edit Profile Modal */}
            <StudentFormModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                mode="edit" 
                initialData={modalData}
                userId={student.id}
                onSuccess={() => {
                    fetchStudent();
                    showToast('Student profile updated successfully.', 'success');
                }} 
            />

            {/* Hidden Printable Component */}
            <div className="print:block hidden overflow-hidden h-0 w-0 absolute left-0 top-0">
                <StudentReport 
                    ref={componentRef} 
                    student={student} 
                    academicRecords={academicRecords}
                />
            </div>
        </div>
    );
};

export default StudentDetails;
