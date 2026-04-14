import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { instructionAPI } from '@/services/api';
import { FiUpload, FiDownload, FiTrash2, FiEdit, FiFile, FiUser } from 'react-icons/fi';

export const MyStudents = () => {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

    const mockGrades = [
        { id: 'STU-001', name: 'Juan dela Cruz', course: 'CS 101', grade: 'A' },
        { id: 'STU-002', name: 'Maria Santos', course: 'CS 101', grade: 'B+' },
        { id: 'STU-003', name: 'Pedro Reyes', course: 'CS 101', grade: 'A-' },
        { id: 'STU-004', name: 'Ana Garcia', course: 'CS 101', grade: 'B' },
        { id: 'STU-005', name: 'Jose Cruz', course: 'CS 101', grade: 'A' },
    ];

    const mockMaterials = [
        { name: 'Lecture 1 - Introduction.pptx', size: '2.4 MB', date: 'Jan 15, 2026' },
        { name: 'Chapter 1 Reading Materials.pdf', size: '1.8 MB', date: 'Jan 18, 2026' },
        { name: 'Assignment 1 - Programming Basics.docx', size: '456 KB', date: 'Jan 20, 2026' },
        { name: 'Lab Exercise 1.pdf', size: '890 KB', date: 'Jan 22, 2026' },
    ];

    const handleEdit = (index) => {
        console.log('Edit grade:', index);
    };

    const handleDownload = (index) => {
        console.log('Download:', index);
    };

    const handleDelete = (index) => {
        console.log('Delete:', index);
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} p-6 lg:p-8`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} p-6 lg:p-8`}>
            <div className="max-w-5xl mx-auto space-y-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                    Grades and Materials
                </h1>

                <div className={`${isDark ? 'bg-[#121212]' : 'bg-white'} rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Student ID</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Name</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Course</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Grade</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockGrades.map((student, index) => (
                                    <tr key={index} className="border-b border-gray-200 dark:border-gray-800 last:border-0">
                                        <td className="py-4 px-6 text-gray-800 dark:text-white font-medium">{student.id}</td>
                                        <td className="py-4 px-6 text-gray-800 dark:text-white">{student.name}</td>
                                        <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{student.course}</td>
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-3 py-1 text-sm font-medium text-[#ff6b00] bg-[#ff6b00]/15 rounded-lg">
                                                {student.grade}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button 
                                                onClick={() => handleEdit(index)}
                                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white transition-colors"
                                            >
                                                <FiEdit className="w-4 h-4" />
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Course Materials</h2>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#ff6b00] hover:bg-orange-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25">
                            <FiUpload className="w-5 h-5" />
                            <span>Upload Files</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {mockMaterials.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-[#121212] dark:bg-white rounded-xl border border-gray-800 dark:border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#ff6b00]/15 rounded-xl">
                                        <FiFile className="w-6 h-6 text-[#ff6b00]" />
                                    </div>
                                    <div>
                                        <p className="text-white dark:text-gray-800 font-semibold">{file.name}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">{file.size} • Uploaded {file.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleDownload(index)}
                                        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-white dark:hover:text-gray-800 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                                    >
                                        <FiDownload className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(index)}
                                        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyStudents;