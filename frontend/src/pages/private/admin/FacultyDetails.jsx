import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FiArrowLeft, FiEdit2, FiPrinter, FiMail, FiPhone, FiMapPin,
    FiCalendar, FiBookOpen, FiUser, FiAward, FiClock, FiX
} from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Skeleton';

// Sample faculty data matching the exact specifications
const sampleFaculty = [
    {
        user: {
            id: 1,
            user_id: 'FAC-CS-001',
            firstname: 'Roberto',
            middlename: '',
            lastname: 'Fernandez',
            email: 'r.fernandez@ccs.edu',
            contact_number: '09171234580',
            address: 'CCS Building - Room 301',
            is_active: true,
            birth_date: '1975-03-15',
            gender: 'male',
        },
        faculty: {
            department: 'Computer Science',
            position: 'Professor',
            specialization: 'Artificial Intelligence, Machine Learning',
            subjects_handled: 'AI Fundamentals, Machine Learning, Deep Learning, Neural Networks',
            teaching_schedule: 'Mon 9:00-12:00 - AI Fundamentals, Wed 13:00-16:00 - Machine Learning, Fri 14:00-17:00 - Deep Learning',
            research_projects: 'Neural Network Optimization for Image Recognition, Predictive Analytics for Student Performance',
        },
    },
    {
        user: {
            id: 2,
            user_id: 'FAC-IT-002',
            firstname: 'Maria',
            middlename: '',
            lastname: 'Gonzales',
            email: 'm.gonzales@ccs.edu',
            contact_number: '09191234581',
            address: 'CCS Building - Room 205',
            is_active: true,
            birth_date: '1980-07-22',
            gender: 'female',
        },
        faculty: {
            department: 'Information Technology',
            position: 'Associate Professor',
            specialization: 'Network Security, Cyber Security',
            subjects_handled: 'Network Security, Ethical Hacking, Cryptography, Digital Forensics',
            teaching_schedule: 'Tue 10:00-13:00 - Network Security, Thu 10:00-13:00 - Ethical Hacking, Sat 9:00-12:00 - Cryptography',
            research_projects: 'Advanced Threat Detection Systems, Blockchain Security Applications',
        },
    },
    {
        user: {
            id: 3,
            user_id: 'FAC-CS-003',
            firstname: 'Antonio',
            middlename: '',
            lastname: 'Rivera',
            email: 'a.rivera@ccs.edu',
            contact_number: '09191234582',
            address: 'CCS Building - Room 108',
            is_active: true,
            birth_date: '1982-11-08',
            gender: 'male',
        },
        faculty: {
            department: 'Computer Science',
            position: 'Assistant Professor',
            specialization: 'Software Engineering, Web Development',
            subjects_handled: 'Software Engineering, Web Development, Agile Methodologies, Database Systems',
            teaching_schedule: 'Mon 13:00-16:00 - Software Engineering, Wed 9:00-12:00 - Web Development, Fri 10:00-13:00 - Agile Methodologies',
            research_projects: 'Microservices Architecture Best Practices, Full-Stack Development Frameworks Comparison',
        },
    },
];

const FacultyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Personal Information');
    const [isTabLoading, setIsTabLoading] = useState(false);

    // Find faculty by ID
    const faculty = sampleFaculty.find(f => f.user.id === parseInt(id));

    const handleTabChange = async (tab) => {
        if (tab === activeTab) return;
        setIsTabLoading(true);
        setActiveTab(tab);
        setTimeout(() => setIsTabLoading(false), 300);
    };

    if (!faculty) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6">
                <div className="max-w-7xl mx-auto">
                    <button 
                        onClick={() => navigate('/faculty')}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Back to Faculty
                    </button>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                        <FiUser className="w-10 h-10 text-red-500 dark:text-red-400 mx-auto mb-3" />
                        <p className="text-red-700 dark:text-red-300 font-semibold mb-1">Faculty Not Found</p>
                        <p className="text-red-600 dark:text-red-400 text-sm">The faculty member you're looking for doesn't exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    const fullName = [faculty.user.firstname, faculty.user.middlename, faculty.user.lastname].filter(Boolean).join(' ');
    const initials = faculty.user.firstname?.[0] || 'F';
    const parseStringOrArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data !== 'string') return [];
        return data.split(',').map(s => s.trim()).filter(Boolean);
    };

    const subjects = parseStringOrArray(faculty.faculty?.subjects_handled);
    const schedule = parseStringOrArray(faculty.faculty?.teaching_schedule);
    const research = parseStringOrArray(faculty.faculty?.research_projects);

    const formatDate = (dateString) => {
        if (!dateString) return 'Not Provided';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6">
            <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
                {/* Header / Back */}
                <button 
                    onClick={() => navigate('/faculty')}
                    className="group flex items-center gap-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-all duration-200"
                >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 group-hover:bg-gray-100 dark:group-hover:bg-[#252525] group-hover:-translate-x-1 transition-all duration-200 flex-shrink-0">
                        <FiArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="group-hover:underline decoration-gray-400 dark:decoration-gray-600 underline-offset-4">Back to Faculty</span>
                </button>

                {/* Profile Overview Card */}
                <Card className="p-6 mb-6 bg-white/80 dark:bg-[#1E1E1E]/40 backdrop-blur-2xl rounded-[2rem] shadow-sm border border-gray-200/50 dark:border-white/5 transition-all overflow-hidden relative">
                    <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-gray-200/50 dark:ring-white/10 pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-6 relative z-10">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="w-[120px] h-[120px] rounded-[32px] bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center text-5xl font-bold shadow-xl flex-shrink-0 ring-4 ring-white dark:ring-[#1E1E1E] hover:rotate-3 transition-transform duration-300">
                                {initials}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{fullName}</h1>
                                <p className="text-base font-medium text-gray-500 dark:text-gray-400 mb-4">{faculty.user.user_id}</p>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    {faculty.faculty?.position && (
                                        <Badge variant="orange">
                                            {faculty.faculty.position}
                                        </Badge>
                                    )}
                                    {faculty.faculty?.department && (
                                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-xs font-bold">
                                            {faculty.faculty.department}
                                        </span>
                                    )}
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                        faculty.user.is_active
                                            ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                                    }`}>
                                        {faculty.user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex items-center flex-wrap gap-x-10 gap-y-3 mt-6 text-sm text-gray-600 dark:text-gray-400 font-normal">
                                    <div className="flex items-center gap-2.5">
                                        <FiMail className="w-4 h-4 text-orange-500" /> 
                                        <span>{faculty.user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <FiPhone className="w-4 h-4 text-orange-500" /> 
                                        <span>{faculty.user.contact_number || 'Not Provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <FiMapPin className="w-4 h-4 text-orange-500" /> 
                                        <span>{faculty.user.address || 'Not Provided'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                            <Button 
                                variant="secondary" 
                                className="flex-1 md:flex-none gap-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <FiPrinter className="w-4 h-4" /> Print
                            </Button>
                            <Button variant="primary" className="flex-1 md:flex-none gap-2 bg-[#FF8C00] hover:bg-[#FF9C20] text-white">
                                <FiEdit2 className="w-4 h-4" /> Edit Profile
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Tabs Navigation */}
                <div className="flex space-x-2 mb-6 overflow-x-auto p-2 bg-white/50 dark:bg-[#1E1E1E]/30 backdrop-blur-3xl rounded-[2rem] border border-gray-200/50 dark:border-white/10 scrollbar-hide shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-gray-200/50 dark:ring-white/10 pointer-events-none"></div>
                    {['Personal Information', 'Teaching Schedule', 'Research Projects', 'Subjects Handled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all rounded-[1.25rem] relative z-10 ${
                                activeTab === tab 
                                    ? 'bg-white dark:bg-[#1E1E1E]/80 text-orange-500 shadow-sm ring-1 ring-gray-200/50 dark:ring-white/10 backdrop-blur-md' 
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-[#1E1E1E]/50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content Rendering */}
                <Card className="p-6 min-h-[400px] bg-white/50 dark:bg-[#1E1E1E]/30 backdrop-blur-2xl rounded-[2rem] shadow-sm border border-gray-200/50 dark:border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-gray-200/50 dark:ring-white/10 pointer-events-none"></div>
                    {isTabLoading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-300">
                            
                            {activeTab === 'Personal Information' && (
                                <div className="space-y-6">
                                    {/* Personal Info Block */}
                                    <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                        <div className="flex items-center gap-2 mb-6 text-orange-500">
                                            <FiUser className="w-5 h-5" />
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{fullName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Faculty ID</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{faculty.user.user_id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Gender</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 capitalize">{faculty.user.gender || 'Not Specified'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Birthdate</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{formatDate(faculty.user.birth_date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Department</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{faculty.faculty?.department || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Specialization</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{faculty.faculty?.specialization || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Info Block */}
                                    <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                        <div className="flex items-center gap-2 mb-6 text-orange-500">
                                            <FiPhone className="w-5 h-5" />
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contact Information</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{faculty.user.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contact Number</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{faculty.user.contact_number || 'Not Provided'}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{faculty.user.address || 'Not Provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Teaching Schedule' && (
                                <div className="space-y-6">
                                    <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                        <div className="flex items-center gap-2 mb-6 text-orange-500">
                                            <FiClock className="w-5 h-5" />
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Teaching Schedule</h3>
                                        </div>
                                        {schedule.length > 0 ? (
                                            <div className="space-y-3">
                                                {schedule.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-4 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-gray-800">
                                                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
                                                            <FiCalendar className="w-5 h-5 text-orange-500" />
                                                        </div>
                                                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">No teaching schedule recorded.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Research Projects' && (
                                <div className="space-y-6">
                                    <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                        <div className="flex items-center gap-2 mb-6 text-orange-500">
                                            <FiBookOpen className="w-5 h-5" />
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Research Projects</h3>
                                        </div>
                                        {research.length > 0 ? (
                                            <div className="space-y-3">
                                                {research.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-4 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-gray-800">
                                                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                                                            <FiAward className="w-5 h-5 text-purple-500" />
                                                        </div>
                                                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">No research projects recorded.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Subjects Handled' && (
                                <div className="space-y-6">
                                    <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 shadow-sm relative">
                                        <div className="flex items-center gap-2 mb-6 text-orange-500">
                                            <FiBookOpen className="w-5 h-5" />
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Subjects Handled</h3>
                                        </div>
                                        {subjects.length > 0 ? (
                                            <div className="flex flex-wrap gap-3">
                                                {subjects.map((subject, idx) => (
                                                    <span key={idx} className="px-4 py-2 bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-sm font-semibold rounded-full border border-orange-200 dark:border-orange-500/20">
                                                        {subject}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">No subjects recorded.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default FacultyDetails;
