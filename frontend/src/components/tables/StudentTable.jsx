import React from 'react';
import { FiUsers, FiPower, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Spinner } from '@/components/ui/Skeleton';

const StudentTable = ({ 
    students, 
    loading, 
    navigate, 
    handleToggleStatus, 
    handleEdit, 
    handleDelete, 
    togglingUserId, 
    deletingUserId 
}) => {
    if (loading) {
        return (
            <div className="bg-white/60 dark:bg-surface-secondary/30 backdrop-blur-2xl rounded-[2rem] shadow-sm border border-zinc-200/50 dark:border-white/5 overflow-hidden">
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
                </div>
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="bg-white/60 dark:bg-surface-secondary/30 backdrop-blur-2xl rounded-[2rem] shadow-sm border border-zinc-200/50 dark:border-white/5 overflow-hidden">
                <div className="text-center py-16 text-sm text-gray-500 dark:text-zinc-400 flex flex-col items-center">
                    <FiUsers className="w-12 h-12 text-gray-300 dark:text-zinc-700 mb-3" />
                    <p>No students found in the database.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/60 dark:bg-surface-secondary/30 backdrop-blur-2xl rounded-[2rem] shadow-sm border border-zinc-200/50 dark:border-white/5 overflow-hidden relative">
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/80 dark:ring-white/10 pointer-events-none"></div>
            <div className="p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-border-dark">
                            <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[7%]">Photo</th>
                            <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[12%]">Student ID</th>
                            <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[18%]">Name</th>
                            <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[18%]">Program</th>
                            <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[10%]">Year Level</th>
                            <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[10%]">Section</th>
                            <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[10%]">Status</th>
                            <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 text-left w-[15%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {students.map((student) => {
                            const fullName = [student.user.firstname, student.user.middlename, student.user.lastname].filter(Boolean).join(' ');
                            const initials = student.user.firstname?.[0] || 'S';
                            const isActive = student.user.is_active;
                            return (
                                <tr 
                                    key={student.user.id} 
                                    onClick={() => navigate(`/students/${student.user.id}`)}
                                    className="hover:bg-brand-500/10 transition-all duration-200 h-[64px] cursor-pointer group hover:shadow-[inset_0_0_20px_rgba(249,115,22,0.05)] relative z-10"
                                >
                                    <td className="py-2 px-1 pr-4 whitespace-nowrap pl-2">
                                        <div className="w-9 h-9 rounded-[10px] bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-[13px] font-bold border border-brand-200 dark:border-brand-500/20 shadow-sm">
                                            {initials}
                                        </div>
                                    </td>
                                    <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-900 dark:text-gray-100 font-medium">{student.user.user_id}</td>
                                    <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100 transition-colors">{fullName}</td>
                                    <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-zinc-400">{student.student?.program || 'N/A'}</td>
                                    <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-zinc-400">{student.student?.year_level ? `${student.student.year_level} Year` : 'N/A'}</td>
                                    <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-zinc-400">{student.student?.section || 'N/A'}</td>
                                    <td className="py-2 pr-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-gray-100 dark:bg-zinc-500/10 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-500/20'}`}>
                                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-2 px-1 whitespace-nowrap text-left" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-start gap-3 items-center">
                                            <button
                                                onClick={() => handleToggleStatus(student)}
                                                className={`p-1.5 rounded-md transition-colors ${isActive ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20' : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'}`}
                                                title={isActive ? 'Deactivate' : 'Activate'}
                                                disabled={togglingUserId !== null}
                                            >
                                                {togglingUserId === student.user.id ? <Spinner /> : <FiPower className="w-[18px] h-[18px]" />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(student)}
                                                className="text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-500/10 transition-colors p-1.5 rounded-md"
                                                title="Edit Student"
                                                disabled={togglingUserId !== null || deletingUserId !== null}
                                            >
                                                <FiEdit2 className="w-[18px] h-[18px] stroke-[1.5]" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.user.id)}
                                                className={`p-1.5 rounded-md transition-colors ${isActive ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20'}`}
                                                title={isActive ? 'Must deactivate before deletion' : 'Delete Student'}
                                                disabled={isActive || deletingUserId !== null || togglingUserId !== null}
                                            >
                                                {deletingUserId === student.user.id ? <Spinner /> : <FiTrash2 className="w-[18px] h-[18px] stroke-[1.5]" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentTable;
