import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiArrowLeft, FiEdit2, FiPrinter, FiMail, FiPhone, FiMapPin,
    FiCalendar, FiBookOpen, FiUser, FiAward, FiClock
} from 'react-icons/fi';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Skeleton.jsx';
import EmptyState from '@/components/ui/EmptyState';
import { BulletList, SectionSubhead, formatDate, parseList, renderTags } from '@/lib/facultyHelpers';
import { useFacultyDetails } from '@/hooks/useFacultyDetails';
import FacultyFormModal from '@/components/forms/FacultyFormModal';
import FacultyReport from '@/components/reports/FacultyReport';

const FacultyDetails = () => {
    const navigate = useNavigate();
    const {
        faculty,
        loading,
        error,
        activeTab,
        isTabLoading,
        modalOpen,
        setModalOpen,
        modalData,
        componentRef,
        handlePrintRequest,
        handleEdit,
        handleTabChange,
        fetchFaculty,
        teachingSchedule,
        subjectsHandled,
        departments,
        positions,
    } = useFacultyDetails();

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner className="h-10 w-10 border-brand-500" />
            </div>
        );
    }

    if (error || !faculty) {
        return (
            <div className="max-w-7xl mx-auto py-12">
                <button 
                    onClick={() => navigate('/faculty')}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 transition-colors"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    Back to Faculty
                </button>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                    <FiUser className="w-10 h-10 text-red-500 dark:text-red-400 mx-auto mb-3" />
                    <p className="text-red-700 dark:text-red-300 font-semibold mb-1">{error || 'Faculty Not Found'}</p>
                    <p className="text-red-600 dark:text-red-400 text-sm">Please verify the ID or try again later.</p>
                </div>
            </div>
        );
    }

    const u = faculty.user || faculty;
    const f = faculty.faculty;
    const fullName = [u.firstname, u.middlename, u.lastname].filter(Boolean).join(' ');
    const initials = u.firstname?.[0] || 'F';

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
            {/* Header / Back */}
            <button 
                onClick={() => navigate('/faculty')}
                className="group flex items-center gap-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-all duration-200 focus:outline-none"
            >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-[#252525] group-hover:-translate-x-1 transition-all duration-200 flex-shrink-0">
                    <FiArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="group-hover:underline decoration-gray-400 dark:decoration-gray-600 underline-offset-4 tracking-tight">Back to Faculty</span>
            </button>

            {/* Profile Overview Card */}
            <Card className="p-6 mb-6 bg-white dark:bg-[#1E1E1E] rounded-[1rem] shadow-sm border border-gray-200 dark:border-gray-800 transition-all overflow-hidden relative">
                <div className="absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/80 dark:ring-white/5 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-[120px] h-[120px] rounded-[32px] bg-gradient-to-br from-violet-500 to-brand-400 text-white flex items-center justify-center text-5xl font-bold shadow-xl flex-shrink-0 ring-4 ring-white dark:ring-[#1E1E1E] hover:rotate-3 transition-transform duration-300">
                            {initials}
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight leading-tight">{fullName}</h1>
                            <p className="text-base font-medium text-gray-500 dark:text-gray-400 mb-4">{u.user_id}</p>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {f?.position && (
                                    <Badge variant="orange">
                                        {f.position}
                                    </Badge>
                                )}
                                {f?.department && (
                                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
                                        {f.department}
                                    </span>
                                )}
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border tracking-wide ${u.is_active
                                        ? 'bg-[#00C950] dark:bg-green-500/10 text-[#fff] dark:text-green-400 border-green-200 dark:border-green-500/20'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                                    }`}>
                                    {u.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex items-center flex-wrap gap-x-10 gap-y-3 mt-6 text-sm text-gray-600 dark:text-gray-400 font-normal">
                                <div className="flex items-center gap-2.5">
                                    <FiMail className="w-4 h-4 text-brand-500" /> 
                                    <span>{u.email}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <FiPhone className="w-4 h-4 text-brand-500" /> 
                                    <span>{u.contact_number || 'Not Provided'}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <FiMapPin className="w-4 h-4 text-brand-500" /> 
                                    <span>{u.address || 'Not Provided'}</span>
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
                        <Button variant="primary" className="flex-1 md:flex-none gap-2 bg-brand-500 hover:bg-brand-600 text-white shadow-sm" onClick={handleEdit}>
                            <FiEdit2 className="w-4 h-4" /> Edit Profile
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Tabs Navigation */}
            <div className="flex space-x-2 mb-6 overflow-x-auto p-2 bg-gray-100 dark:bg-[#252525] rounded-[1.25rem] border border-gray-200 dark:border-gray-800 scrollbar-hide shadow-inner relative overflow-hidden">
                {['Personal Information', 'Teaching Schedule', 'Research Projects', 'Subjects Handled'].map(tab => (
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

            {/* Tab Content Rendering */}
            <Card className="p-6 bg-white dark:bg-[#1E1E1E] rounded-[1rem] shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/80 dark:ring-white/5 pointer-events-none"></div>
                {isTabLoading ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <Spinner className="h-8 w-8 border-brand-500" />
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300 text-left">
                        
                        {activeTab === 'Personal Information' && (
                            <div className="space-y-6">
                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    <div className="flex items-center gap-2 mb-6 text-brand-500">
                                        <FiUser className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
                                        <div>
                                            <SectionSubhead>Full Name</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{fullName}</p>
                                        </div>
                                        <div>
                                            <SectionSubhead>Faculty ID</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{u.user_id}</p>
                                        </div>
                                        <div>
                                            <SectionSubhead>Gender</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100 capitalize">{u.gender || 'Not Specified'}</p>
                                        </div>
                                        <div>
                                            <SectionSubhead>Birthdate</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{formatDate(u.birth_date)}</p>
                                        </div>
                                        <div>
                                            <SectionSubhead>Department</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{f?.department || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <SectionSubhead>Specialization</SectionSubhead>
                                            <div className="mt-1">{renderTags(f?.specialization, "zinc")}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    <div className="flex items-center gap-2 mb-6 text-brand-500">
                                        <FiPhone className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contact Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div>
                                            <SectionSubhead>Contact Number</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{u.contact_number || 'Not Provided'}</p>
                                        </div>
                                        <div>
                                            <SectionSubhead>Email</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{u.email}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <SectionSubhead>Address</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{u.address || 'Not Provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Teaching Schedule' && (
                            <div className="space-y-6">
                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    <div className="flex items-center gap-2 mb-6 text-brand-500">
                                        <FiClock className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Teaching Schedule</h3>
                                    </div>
                                    <BulletList items={teachingSchedule.map(s => s.display)} />
                                    {teachingSchedule.length === 0 && (
                                        <EmptyState 
                                            size="md"
                                            icon={FiClock}
                                            title="No Classes Scheduled"
                                            description="This faculty member has no classes assigned to their schedule yet."
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Research Projects' && (
                            <div className="space-y-6">
                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    <div className="flex items-center gap-2 mb-6 text-brand-500">
                                        <FiBookOpen className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Research Projects</h3>
                                    </div>
                                    <BulletList items={parseList(f?.research_projects)} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'Subjects Handled' && (
                            <div className="space-y-6">
                                <div className="p-6 rounded-[1rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                    <div className="flex items-center gap-2 mb-6 text-brand-500">
                                        <FiBookOpen className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Subjects Handled</h3>
                                    </div>
                                    {renderTags(subjectsHandled.join(', '), "orange")}
                                    {subjectsHandled.length === 0 && (
                                        <EmptyState 
                                            size="md"
                                            icon={FiBookOpen}
                                            title="No Subjects Assigned"
                                            description="This faculty member has not been assigned any subjects handled yet."
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Edit Profile Modal */}
            <FacultyFormModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                mode="edit" 
                initialData={modalData}
                userId={u?.id}
                onSuccess={() => {
                    fetchFaculty();
                }} 
                departments={departments}
                positions={positions}
            />

            {/* Hidden Printable Component */}
            <div className="print:block hidden overflow-hidden h-0 w-0 absolute left-0 top-0">
                <FacultyReport 
                    ref={componentRef} 
                    faculty={faculty} 
                />
            </div>
        </div>
    );
};

export default FacultyDetails;
