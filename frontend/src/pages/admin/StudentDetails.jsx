import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FiArrowLeft, FiEdit2, FiPrinter, FiMail, FiPhone, FiAlertCircle,
    FiAward, FiActivity, FiUsers, FiAlertTriangle, FiCalendar, FiFileText, FiUser, FiMapPin
} from 'react-icons/fi';
import { userAPI } from '../../services/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton, Spinner } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';

// MOCK DATA: Matching the structural and visual Figma prototype specifications
const MOCK_DATA = {
    academic: {
        course: "BS Computer Science",
        yearLevel: "3rd Year",
        gpa: "3.80",
        currentSubjects: ["Data Structures", "Web Development", "Database Systems", "Software Engineering"],
        academicAwards: ["Dean's Lister - 2023", "Academic Excellence Award"],
        quizBee: ["National IT Quiz Bee 2024 - 2nd Place"],
        programming: ["ACM ICPC Regional 2024", "Google Code Jam 2024"]
    },
    medical: {
        bloodType: "O+",
        allergies: ["Peanuts"],
        medicalConditions: "None",
        disabilities: "None"
    },
    sports: {
        sportsPlayed: ["Basketball", "Volleyball"],
        schoolTeam: ["Women's Basketball Team"],
        competitions: ["UAAP Basketball 2024"],
        achievements: ["MVP - Inter-college Basketball 2023"]
    },
    organizations: {
        clubs: ["CS Society", "Women in Tech"],
        fraternities: "None",
        studentCouncil: ["Student Council Member"],
        roles: ["CS Society - Vice President"]
    },
    behavior: {
        warnings: 0,
        suspensions: 0,
        counseling: 0,
        incidents: "No incidents recorded",
        counselingRecords: "No counseling records"
    },
    events: {
        quizBee: ["National IT Quiz Bee 2024 - 2nd Place"],
        programming: ["ACM ICPC Regional 2024", "Google Code Jam 2024"],
        athletic: ["UAAP Basketball 2024"]
    }
};

// Local Components

const BulletList = ({ items }) => {
    if (!items || items.length === 0) return <p className="text-sm text-gray-500">None recorded</p>;
    return (
        <ul className="space-y-1.5">
            {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-800 dark:text-gray-200 font-medium">
                    <span className="text-gray-400 dark:text-gray-600 mt-0.5">•</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
};

const SectionSubhead = ({ children }) => (
    <p className="text-sm font-medium text-gray-400 mb-1">{children}</p>
);

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [activeTab, setActiveTab] = useState('Student Information');
    const [isTabLoading, setIsTabLoading] = useState(false);

    // Academic Record States
    const [academicRecords, setAcademicRecords] = useState([]);
    const [isAcademicLoading, setIsAcademicLoading] = useState(false);
    const [academicError, setAcademicError] = useState('');

    useEffect(() => {
        const fetchStudent = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await userAPI.getUser(id);
                setStudent(data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to load student details.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    const handleTabChange = async (tab) => {
        if (tab === activeTab) return;
        setIsTabLoading(true);
        setActiveTab(tab);
        
        // Fetch academic records when clicking the tab if not already fetched
        if (tab === 'Academic Record' && academicRecords.length === 0) {
            setIsAcademicLoading(true);
            setAcademicError('');
            try {
                const records = await userAPI.getAcademicRecords(id);
                setAcademicRecords(records);
            } catch (err) {
                console.error(err);
                setAcademicError('Failed to load academic records.');
            } finally {
                setIsAcademicLoading(false);
            }
        }

        // Simulate loading state (per user instructions)
        setTimeout(() => setIsTabLoading(false), 300);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F97316]"></div>
            </div>
        );
    }

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

    if (!student) {
        return (
            <div className="text-center py-20 text-gray-500">Student not found.</div>
        );
    }

    const fullName = [student.firstname, student.middlename, student.lastname].filter(Boolean).join(' ');
    const initials = student.firstname?.[0] || 'S';
    const profile = student.student;
    const isActive = student.is_active;

    const formatYearLevel = (level) => {
        if (!level) return null;
        const suffixes = { 1: 'st', 2: 'nd', 3: 'rd' };
        const suffix = suffixes[level] || 'th';
        return `${level}${suffix} Year`;
    };

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
            <Card className="p-6 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-violet-500 to-orange-400 text-white flex items-center justify-center text-5xl font-bold shadow-lg flex-shrink-0 ring-4 ring-white dark:ring-[#1E1E1E]">
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
                        <Button variant="secondary" className="flex-1 md:flex-none gap-2">
                            <FiPrinter className="w-4 h-4" /> Print
                        </Button>
                        <Button variant="primary" className="flex-1 md:flex-none gap-2">
                            <FiEdit2 className="w-4 h-4" /> Edit Profile
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Tabs Navigation */}
            <div className="flex space-x-8 mb-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800 scrollbar-hide">
                {['Student Information', 'Academic Record', 'Medical Record', 'Sports & Activities', 'Organizations', 'Behavior & Discipline', 'Events & Competitions'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                            activeTab === tab 
                                ? 'border-[#F97316] text-[#F97316]' 
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content Rendering */}
            <Card className="p-6 min-h-[400px]">
                {isTabLoading ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300">
                        
                        {activeTab === 'Student Information' && (
                            <div className="space-y-6">
                                {/* Personal Info Block */}
                                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800">
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

                                {/* Contact & Emergency Block */}
                                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800">
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

                        {/* 2. ACADEMIC RECORD (Dynamic Data) */}
                        {activeTab === 'Academic Record' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#F97316]">
                                        <FiAward className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Academic Performance</h3>
                                    </div>
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
                                        icon={<FiFileText />}
                                        title="No Academic Records"
                                        description="There are no academic records on file for this student."
                                    />
                                ) : (
                                    <div className="space-y-6">
                                        {academicRecords.map((record, index) => (
                                            <div key={record.id} className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{record.course_name || 'N/A'}</p>
                                                        <p className="text-sm font-medium text-gray-500 mt-1">{record.year_level || 'N/A'} • {record.semester || 'N/A'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-500 mb-1">GPA</p>
                                                        <p className="text-3xl font-extrabold text-[#F97316] leading-none">{record.gpa ? Number(record.gpa).toFixed(2) : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                                    <div>
                                                        <SectionSubhead>Current Subjects</SectionSubhead>
                                                        {record.current_subjects?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {record.current_subjects.map((sub, i) => <Badge key={i} color="white">{sub}</Badge>)}
                                                            </div>
                                                        ) : <p className="text-sm text-gray-500">None recorded</p>}
                                                    </div>
                                                    <div>
                                                        <SectionSubhead>Academic Awards</SectionSubhead>
                                                        {record.academic_awards?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {record.academic_awards.map((award, i) => <Badge key={i} color="yellow">{award}</Badge>)}
                                                            </div>
                                                        ) : <p className="text-sm text-gray-500">None recorded</p>}
                                                    </div>
                                                    <div>
                                                        <SectionSubhead>Quiz Bee Participation</SectionSubhead>
                                                        <BulletList items={record.quiz_bee_participations} />
                                                    </div>
                                                    <div>
                                                        <SectionSubhead>Programming Contests</SectionSubhead>
                                                        <BulletList items={record.programming_contests} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. MEDICAL RECORD (Dynamic Data) */}
                        {activeTab === 'Medical Record' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#F97316]">
                                        <FiActivity className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Medical Information</h3>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div>
                                            <SectionSubhead>Blood Type</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{profile?.blood_type || 'Not Provided'}</p>
                                        </div>
                                        <div>
                                            <SectionSubhead>Allergies</SectionSubhead>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {profile?.allergies ? (
                                                    profile.allergies.split(',').map(alg => alg.trim()).filter(Boolean).map((alg, index) => (
                                                        <Badge key={index} color="red">{alg}</Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500">None recorded</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <SectionSubhead>Medical Conditions</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{profile?.medical_condition || 'None reported'}</p>
                                        </div>
                                        <div>
                                            <SectionSubhead>Disabilities</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{profile?.disabilities || 'None reported'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. SPORTS & ACTIVITIES (Dynamic Data) */}
                        {activeTab === 'Sports & Activities' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#F97316]">
                                        <FiAward className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sports and Athletic Activities</h3>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div>
                                            <SectionSubhead>Sports Played</SectionSubhead>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {profile?.sports_activities?.sportsPlayed?.length > 0 ? (
                                                    profile.sports_activities.sportsPlayed.map((sport, i) => <Badge key={i} color="orange">{sport}</Badge>)
                                                ) : <p className="text-sm text-gray-500">None recorded</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <SectionSubhead>Athletic Achievements</SectionSubhead>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {profile?.sports_activities?.achievements?.length > 0 ? (
                                                    profile.sports_activities.achievements.map((ach, i) => <Badge key={i} color="yellow">{ach}</Badge>)
                                                ) : <p className="text-sm text-gray-500">None recorded</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <SectionSubhead>School Team Membership</SectionSubhead>
                                            <div className="mt-1"><BulletList items={profile?.sports_activities?.schoolTeam} /></div>
                                        </div>
                                        <div>
                                            <SectionSubhead>Competitions Joined</SectionSubhead>
                                            <div className="mt-1"><BulletList items={profile?.sports_activities?.competitions} /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. ORGANIZATIONS (Dynamic Data) */}
                        {activeTab === 'Organizations' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#F97316]">
                                        <FiUsers className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Organizations and Leadership</h3>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div>
                                            <SectionSubhead>Clubs Joined</SectionSubhead>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {profile?.organizations?.clubs?.length > 0 ? (
                                                    profile.organizations.clubs.map((club, i) => <Badge key={i} color="purple">{club}</Badge>)
                                                ) : <p className="text-sm text-gray-500">None recorded</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <SectionSubhead>Student Council</SectionSubhead>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {profile?.organizations?.studentCouncil?.length > 0 ? (
                                                    profile.organizations.studentCouncil.map((ro, i) => <Badge key={i} color="orange">{ro}</Badge>)
                                                ) : <p className="text-sm text-gray-500">None recorded</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <SectionSubhead>Fraternities</SectionSubhead>
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">{profile?.organizations?.fraternities || 'None recorded'}</p>
                                        </div>
                                        <div>
                                            <SectionSubhead>Leadership Roles</SectionSubhead>
                                            <div className="mt-1"><BulletList items={profile?.organizations?.roles} /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6. BEHAVIOR & DISCIPLINE (Dynamic Data) */}
                        {activeTab === 'Behavior & Discipline' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#F97316]">
                                        <FiAlertTriangle className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Behavior and Disciplinary Records</h3>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Warnings</h4>
                                            <p className="text-4xl font-extrabold text-yellow-500">{profile?.behavior_discipline_records?.warnings || 0}</p>
                                        </div>
                                        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Suspensions</h4>
                                            <p className="text-4xl font-extrabold text-red-500">{profile?.behavior_discipline_records?.suspensions || 0}</p>
                                        </div>
                                        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Counseling Sessions</h4>
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

                        {/* 7. EVENTS & COMPETITIONS (Dynamic Data) */}
                        {activeTab === 'Events & Competitions' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#F97316]">
                                        <FiCalendar className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Events and Competitions</h3>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div>
                                            <SectionSubhead>Quiz Bee Competitions</SectionSubhead>
                                            <div className="mt-2 space-y-2">
                                                {profile?.events_participated?.quizBee?.length > 0 ? (
                                                    profile.events_participated.quizBee.map((evt, i) => (
                                                        <div key={i} className="p-3 bg-white dark:bg-[#1E1E1E] border border-purple-100 dark:border-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold rounded-xl shadow-sm">
                                                            {evt}
                                                        </div>
                                                    ))
                                                ) : <p className="text-sm text-gray-500">No records</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <SectionSubhead>Programming Contests</SectionSubhead>
                                            <div className="mt-2 space-y-2">
                                                {profile?.events_participated?.programming?.length > 0 ? (
                                                    profile.events_participated.programming.map((evt, i) => (
                                                        <div key={i} className="p-3 bg-white dark:bg-[#1E1E1E] border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-xl shadow-sm">
                                                            {evt}
                                                        </div>
                                                    ))
                                                ) : <p className="text-sm text-gray-500">No records</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <SectionSubhead>Athletic Competitions</SectionSubhead>
                                            <div className="mt-2 space-y-2">
                                                {profile?.events_participated?.athletic?.length > 0 ? (
                                                    profile.events_participated.athletic.map((evt, i) => (
                                                        <div key={i} className="p-3 bg-white dark:bg-[#1E1E1E] border border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold rounded-xl shadow-sm">
                                                            {evt}
                                                        </div>
                                                    ))
                                                ) : <p className="text-sm text-gray-500">No records</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </Card>
        </div>
    );
};

export default StudentDetails;
