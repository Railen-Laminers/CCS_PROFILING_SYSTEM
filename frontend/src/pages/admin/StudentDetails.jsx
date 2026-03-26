import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FiArrowLeft, FiEdit2, FiPrinter, FiMail, FiPhone, FiAlertCircle,
    FiAward, FiActivity, FiUsers, FiAlertTriangle, FiCalendar, FiFileText, FiUser, FiMapPin
} from 'react-icons/fi';
import { userAPI } from '../../services/api';
import { academicRecordAPI } from '../../services/academicRecordAPI';

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

// Reusable UI Components for Tab Content
const Badge = ({ children, color = 'gray' }) => {
    const variants = {
        white: 'bg-white border border-gray-200 text-gray-700 dark:bg-[#252525] dark:border-gray-700 dark:text-gray-300 shadow-sm',
        orange: 'bg-[#F97316] text-white border border-[#F97316] shadow-sm',
        yellow: 'bg-yellow-500 text-white border border-yellow-500 shadow-sm',
        red: 'bg-red-500 text-white border border-red-500 shadow-sm',
        purple: 'bg-[#a855f7] text-white border border-[#a855f7] shadow-sm',
        gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-transparent'
    };
    return (
        <span className={`px-3.5 py-1 text-[13px] font-medium rounded-full ${variants[color]}`}>
            {children}
        </span>
    );
};

const BulletList = ({ items }) => {
    if (!items || items.length === 0) return <p className="text-[15px] text-gray-500">None recorded</p>;
    return (
        <ul className="space-y-1.5">
            {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[15px] text-gray-800 dark:text-gray-200 font-medium">
                    <span className="text-gray-400 dark:text-gray-600 mt-0.5">•</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
};

const SectionSubhead = ({ children }) => (
    <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{children}</p>
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
                const records = await academicRecordAPI.getRecords(id);
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
                    className="flex items-center gap-2 text-[14px] font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2 transition-colors"
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
                className="flex items-center gap-2 text-[15px] font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
            >
                <FiArrowLeft className="w-5 h-5" />
                Back to Students
            </button>

            {/* Profile Overview Card */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-6">
                    <div className="flex items-start gap-6">
                        <div className="w-[123px] h-[123px] rounded-xl bg-blue-100 dark:bg-[#1C2B4B] text-blue-700 dark:text-[#93Bbf3] flex items-center justify-center text-5xl font-bold shadow-inner flex-shrink-0">
                            {initials}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{fullName}</h1>
                            <p className="text-[17px] font-medium text-gray-500 dark:text-gray-400 mb-4">{student.user_id}</p>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {profile?.program && (
                                    <span className="bg-[#F97316] text-white px-2.5 py-1 rounded-md text-[13px] font-semibold shadow-sm">
                                        {profile.program}
                                    </span>
                                )}
                                {yearSection && (
                                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-[13px] font-bold">
                                        {yearSection}
                                    </span>
                                )}
                                <span className={`px-2.5 py-1 rounded-md text-[13px] font-bold border ${
                                    isActive
                                        ? 'bg-[#00C950] dark:bg-green-500/10 text-[#fff] dark:text-green-400 border-green-200 dark:border-green-500/20'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                                }`}>
                                    {isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex items-center flex-wrap gap-x-10 gap-y-3 mt-6 text-[14px] text-gray-600 dark:text-gray-400 font-normal">
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
                        <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-xl text-[14px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors shadow-sm">
                            <FiPrinter className="w-4 h-4" /> Print
                        </button>
                        <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-orange-600 text-white rounded-xl text-[14px] font-semibold transition-colors shadow-sm">
                            <FiEdit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex space-x-1 mb-6 overflow-x-auto p-1.5 bg-gray-100/80 dark:bg-[#2A2A2A] border border-gray-200/50 dark:border-gray-800 rounded-2xl scrollbar-hide">
                {['Student Information', 'Academic Record', 'Medical Record', 'Sports & Activities', 'Organizations', 'Behavior & Discipline', 'Events & Competitions'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`flex-1 px-4 py-1 text-[14px] font-semibold text-center whitespace-nowrap transition-all rounded-full ${
                            activeTab === tab 
                                ? 'bg-[#F97316] text-white shadow-sm' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-[#2A2A2A]'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content Rendering */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 min-h-[400px]">
                {isTabLoading ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300">
                        
                        {/* 1. STUDENT INFORMATION (Dynamic DB Data) */}
                        {activeTab === 'Student Information' && (
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-[#F97316]">
                                    <FiUser className="w-5 h-5" />
                                    <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Personal Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    <div><SectionSubhead>Full Name</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{fullName}</p></div>
                                    <div><SectionSubhead>Student ID</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{student.user_id}</p></div>
                                    <div><SectionSubhead>Gender</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100 capitalize">{student.gender || 'Not Specified'}</p></div>
                                    <div><SectionSubhead>Birthdate</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{student.birth_date || 'Not Specified'}</p></div>
                                    <div><SectionSubhead>Contact Number</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{student.contact_number || 'Not Provided'}</p></div>
                                    <div><SectionSubhead>Email</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{student.email}</p></div>
                                    <div><SectionSubhead>Address</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{student.address || 'Not Provided'}</p></div>
                                    <div className="hidden md:block"></div> {/* Spacer */}
                                    <div><SectionSubhead>Parent/Guardian</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{profile?.parent_guardian_name ? `${profile.parent_guardian_name} - ${profile.emergency_contact || 'No Contact'}` : 'Not Provided'}</p></div>
                                    <div><SectionSubhead>Emergency Contact</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{profile?.emergency_contact || 'Not Provided'}</p></div>
                                </div>
                            </div>
                        )}

                        {/* 2. ACADEMIC RECORD (Dynamic Data) */}
                        {activeTab === 'Academic Record' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 text-[#F97316]">
                                        <FiAward className="w-5 h-5" />
                                        <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Academic Performance</h3>
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
                                    <div className="text-center py-16 bg-gray-50 dark:bg-[#1E1E1E] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                        <FiFileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                                        <h4 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100 mb-1">No Academic Records</h4>
                                        <p className="text-[14px] text-gray-500">There are no academic records on file for this student.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-12">
                                        {academicRecords.map((record, index) => (
                                            <div key={record.id} className={index > 0 ? "pt-8 border-t border-gray-100 dark:border-gray-800" : ""}>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                                    <div><SectionSubhead>Course</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{record.course_name || 'N/A'}</p></div>
                                                    <div><SectionSubhead>Year Level</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{record.year_level || 'N/A'}</p></div>
                                                    <div><SectionSubhead>Semester</SectionSubhead><p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{record.semester || 'N/A'}</p></div>
                                                    <div><SectionSubhead>GPA</SectionSubhead><p className="text-3xl font-bold text-[#F97316]">{record.gpa ? Number(record.gpa).toFixed(2) : 'N/A'}</p></div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div>
                                                        <SectionSubhead>Current Subjects</SectionSubhead>
                                                        {record.current_subjects?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {record.current_subjects.map((sub, i) => <Badge key={i} color="white">{sub}</Badge>)}
                                                            </div>
                                                        ) : <p className="text-[15px] text-gray-500">None recorded</p>}
                                                    </div>
                                                    <div>
                                                        <SectionSubhead>Academic Awards</SectionSubhead>
                                                        {record.academic_awards?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {record.academic_awards.map((award, i) => <Badge key={i} color="yellow">{award}</Badge>)}
                                                            </div>
                                                        ) : <p className="text-[15px] text-gray-500">None recorded</p>}
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

                        {/* 3. MEDICAL RECORD (Mock Data) */}
                        {activeTab === 'Medical Record' && (
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-[#F97316]">
                                    <FiActivity className="w-5 h-5" />
                                    <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Medical Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div>
                                        <SectionSubhead>Blood Type</SectionSubhead>
                                        <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{MOCK_DATA.medical.bloodType}</p>
                                    </div>
                                    <div>
                                        <SectionSubhead>Allergies</SectionSubhead>
                                        <div className="flex flex-wrap gap-2">
                                            {MOCK_DATA.medical.allergies.map(alg => <Badge key={alg} color="red">{alg}</Badge>)}
                                        </div>
                                    </div>
                                    <div>
                                        <SectionSubhead>Medical Conditions</SectionSubhead>
                                        <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{MOCK_DATA.medical.medicalConditions}</p>
                                    </div>
                                    <div>
                                        <SectionSubhead>Disabilities</SectionSubhead>
                                        <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{MOCK_DATA.medical.disabilities}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. SPORTS & ACTIVITIES (Mock Data) */}
                        {activeTab === 'Sports & Activities' && (
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-[#F97316]">
                                    <FiAward className="w-5 h-5" />
                                    <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Sports and Athletic Activities</h3>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <SectionSubhead>Sports Played</SectionSubhead>
                                        <div className="flex flex-wrap gap-2">
                                            {MOCK_DATA.sports.sportsPlayed.map(sport => <Badge key={sport} color="orange">{sport}</Badge>)}
                                        </div>
                                    </div>
                                    <div>
                                        <SectionSubhead>School Team Membership</SectionSubhead>
                                        <BulletList items={MOCK_DATA.sports.schoolTeam} />
                                    </div>
                                    <div>
                                        <SectionSubhead>Competitions Joined</SectionSubhead>
                                        <BulletList items={MOCK_DATA.sports.competitions} />
                                    </div>
                                    <div>
                                        <SectionSubhead>Athletic Achievements</SectionSubhead>
                                        <div className="flex flex-wrap gap-2">
                                            {MOCK_DATA.sports.achievements.map(ach => <Badge key={ach} color="yellow">{ach}</Badge>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. ORGANIZATIONS (Mock Data) */}
                        {activeTab === 'Organizations' && (
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-[#F97316]">
                                    <FiUsers className="w-5 h-5" />
                                    <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Organizations and Leadership</h3>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <SectionSubhead>Clubs Joined</SectionSubhead>
                                        <div className="flex flex-wrap gap-2">
                                            {MOCK_DATA.organizations.clubs.map(club => <Badge key={club} color="purple">{club}</Badge>)}
                                        </div>
                                    </div>
                                    <div>
                                        <SectionSubhead>Fraternities</SectionSubhead>
                                        <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{MOCK_DATA.organizations.fraternities}</p>
                                    </div>
                                    <div>
                                        <SectionSubhead>Student Council</SectionSubhead>
                                        <div className="flex flex-wrap gap-2">
                                            {MOCK_DATA.organizations.studentCouncil.map(ro => <Badge key={ro} color="orange">{ro}</Badge>)}
                                        </div>
                                    </div>
                                    <div>
                                        <SectionSubhead>Leadership Roles</SectionSubhead>
                                        <BulletList items={MOCK_DATA.organizations.roles} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6. BEHAVIOR & DISCIPLINE (Mock Data) */}
                        {activeTab === 'Behavior & Discipline' && (
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-[#F97316]">
                                    <FiAlertTriangle className="w-5 h-5" />
                                    <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Behavior and Disciplinary Records</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-6 mb-8 pt-2">
                                    <div>
                                        <h4 className="text-[15px] font-medium text-gray-600 dark:text-gray-400 mb-1">Warnings</h4>
                                        <p className="text-3xl font-bold text-yellow-500">{MOCK_DATA.behavior.warnings}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-medium text-gray-600 dark:text-gray-400 mb-1">Suspensions</h4>
                                        <p className="text-3xl font-bold text-red-500">{MOCK_DATA.behavior.suspensions}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-medium text-gray-600 dark:text-gray-400 mb-1">Counseling Sessions</h4>
                                        <p className="text-3xl font-bold text-blue-500">{MOCK_DATA.behavior.counseling}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <SectionSubhead>Incidents</SectionSubhead>
                                        <p className="text-[15px] font-medium text-green-600 dark:text-green-400">{MOCK_DATA.behavior.incidents}</p>
                                    </div>
                                    <div>
                                        <SectionSubhead>Counseling Records</SectionSubhead>
                                        <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{MOCK_DATA.behavior.counselingRecords}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 7. EVENTS & COMPETITIONS (Mock Data) */}
                        {activeTab === 'Events & Competitions' && (
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-[#F97316]">
                                    <FiCalendar className="w-5 h-5" />
                                    <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Events and Competitions</h3>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <SectionSubhead>Quiz Bee Competitions</SectionSubhead>
                                        {MOCK_DATA.events.quizBee.map(evt => (
                                            <div key={evt} className="p-4 bg-purple-50 dark:bg-purple-900/10 text-gray-800 dark:text-gray-200 text-[15px] font-medium rounded-xl mb-2">
                                                {evt}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <SectionSubhead>Programming Contests</SectionSubhead>
                                        {MOCK_DATA.events.programming.map(evt => (
                                            <div key={evt} className="p-4 bg-blue-50 dark:bg-blue-900/10 text-gray-800 dark:text-gray-200 text-[15px] font-medium rounded-xl mb-2">
                                                {evt}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <SectionSubhead>Athletic Competitions</SectionSubhead>
                                        {MOCK_DATA.events.athletic.map(evt => (
                                            <div key={evt} className="p-4 bg-green-50 dark:bg-green-900/10 text-gray-800 dark:text-gray-200 text-[15px] font-medium rounded-xl mb-2">
                                                {evt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDetails;
