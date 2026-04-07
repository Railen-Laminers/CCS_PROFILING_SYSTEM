import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { instructionAPI } from '@/services/api';
import { FaUser, FaEnvelope, FaSchool, FaGraduationCap } from 'react-icons/fa';

export const MyStudents = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!user || user.role !== 'faculty') return;
            setLoading(true);
            try {
                const classes = await instructionAPI.getClasses({ instructor_id: user.faculty?._id });
                const studentSet = new Map();
                
                for (const cls of classes || []) {
                    if (cls.students) {
                        for (const student of cls.students) {
                            if (!studentSet.has(student._id)) {
                                studentSet.set(student._id, {
                                    ...student,
                                    section: student.section || 'N/A',
                                    year: student.year_level || 'N/A'
                                });
                            }
                        }
                    }
                }
                
                setStudents(Array.from(studentSet.values()));
            } catch (err) {
                console.error('Failed to fetch students:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [user]);

    const filteredStudents = students.filter(s => 
        !searchQuery || 
        `${s.firstname} ${s.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.user_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.section?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                My Students
            </h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, ID, or section..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-96 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-surface-secondary text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
            </div>

            {students.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-surface-secondary border border-gray-200 dark:border-gray-700 rounded-xl">
                    <FaUser className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No students assigned</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-surface-secondary border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Student Name
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        ID
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Section
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Year
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (
                                    <tr 
                                        key={index} 
                                        className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-surface-dark cursor-pointer"
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center">
                                                    <FaUser className="w-4 h-4 text-brand-500" />
                                                </div>
                                                <span className="text-sm text-gray-800 dark:text-gray-200">
                                                    {student.firstname} {student.lastname}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {student.user_id || 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {student.section || 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {student.year || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedStudent(null)}>
                    <div className="bg-white dark:bg-surface-secondary rounded-xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                {selectedStudent.firstname} {selectedStudent.lastname}
                            </h2>
                            <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <FaUser className="w-4 h-4" />
                                <span>ID: {selectedStudent.user_id || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <FaEnvelope className="w-4 h-4" />
                                <span>{selectedStudent.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <FaSchool className="w-4 h-4" />
                                <span>Section: {selectedStudent.section || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <FaGraduationCap className="w-4 h-4" />
                                <span>Year: {selectedStudent.year || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyStudents;