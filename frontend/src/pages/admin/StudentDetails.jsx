import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiPrinter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { userAPI } from '../../services/api';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Personal Information');

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await userAPI.getUsers();
                const found = response.find(s => s.id.toString() === id.toString());
                setStudent(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F97316]"></div>
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

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
            {/* Header / Back */}
            <button 
                onClick={() => navigate('/students')}
                className="flex items-center gap-2 text-[14px] font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
            >
                <FiArrowLeft className="w-5 h-5" />
                Back to Students
            </button>

            {/* Profile Overview Card */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-3xl font-bold shadow-inner flex-shrink-0">
                            {initials}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{fullName}</h1>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="bg-[#F97316] text-white px-3.5 py-1 rounded-full text-[12px] font-semibold shadow-sm">
                                    BS Computer Science
                                </span>
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3.5 py-1 rounded-full text-[12px] font-bold">
                                    1st Year • Section A
                                </span>
                                <span className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-3.5 py-1 rounded-full text-[12px] font-bold border border-green-200 dark:border-green-500/20">
                                    Active
                                </span>
                            </div>
                            <div className="flex items-center gap-6 text-[14px] text-gray-600 dark:text-gray-400 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-400 dark:text-gray-500">ID:</span> {student.user_id}
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiMail className="w-4 h-4" /> {student.email}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-xl text-[14px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors shadow-sm">
                            <FiPrinter className="w-4 h-4" /> Print
                        </button>
                        <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-[#F97316] hover:bg-orange-600 text-white rounded-xl text-[14px] font-semibold transition-colors shadow-sm">
                            <FiEdit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-800">
                {['Personal Information', 'Academic Record', 'Requirements', 'Account Settings'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 text-[14px] font-bold whitespace-nowrap transition-all border-b-2 ${
                            activeTab === tab 
                                ? 'border-[#F97316] text-[#F97316]' 
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
                    {activeTab}
                </h3>
                
                {activeTab === 'Personal Information' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div>
                            <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">First Name</p>
                            <p className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">{student.firstname}</p>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Last Name</p>
                            <p className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">{student.lastname}</p>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Middle Name</p>
                            <p className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">{student.middlename || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Email Address</p>
                            <p className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">{student.email}</p>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Student Role ID</p>
                            <p className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">{student.role_id || 'Student'}</p>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Account Created</p>
                            <p className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">
                                {new Date(student.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                )}
                
                {activeTab !== 'Personal Information' && (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiArrowLeft className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="font-medium">This module is currently under development.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDetails;
