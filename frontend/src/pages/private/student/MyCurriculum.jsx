import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { academicRecordAPI } from '@/services/api';
import { FaBook, FaStar, FaClock, FaAward } from 'react-icons/fa';

export const MyCurriculum = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            if (!user || user.role !== 'student') return;
            setLoading(true);
            try {
                const data = await academicRecordAPI.getAcademicRecords(user._id);
                setRecords(data || []);
            } catch (err) {
                console.error('Failed to fetch curriculum:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, [user]);

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    const subjects = user.student?.current_subjects || [];
    const gpa = user.student?.gpa || 'N/A';
    const awards = user.student?.academic_awards || [];

    return (
        <div className="max-w-5xl">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                My Curriculum
            </h1>

            <div className="grid gap-6">
                <div className="bg-white dark:bg-surface-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Current Subjects
                    </h2>
                    {subjects.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No subjects assigned</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {subjects.map((subject, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-surface-dark rounded-lg">
                                    <FaBook className="w-5 h-5 text-brand-500" />
                                    <span className="text-gray-800 dark:text-gray-200">{subject}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-surface-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Academic Performance
                    </h2>
                    <div className="flex items-center gap-3">
                        <FaStar className="w-6 h-6 text-yellow-500" />
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Current GPA</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{gpa}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Academic Awards
                    </h2>
                    {awards.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No awards yet</p>
                    ) : (
                        <div className="space-y-3">
                            {awards.map((award, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-surface-dark rounded-lg">
                                    <FaAward className="w-5 h-5 text-yellow-500" />
                                    <span className="text-gray-800 dark:text-gray-200">{award}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-surface-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Academic Records
                    </h2>
                    {records.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No records available</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Subject</th>
                                        <th className="text-left py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Grade</th>
                                        <th className="text-left py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Term</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record, index) => (
                                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                                            <td className="py-2 text-sm text-gray-800 dark:text-gray-200">{record.subject}</td>
                                            <td className="py-2 text-sm text-gray-600 dark:text-gray-400">{record.grade}</td>
                                            <td className="py-2 text-sm text-gray-600 dark:text-gray-400">{record.term}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyCurriculum;