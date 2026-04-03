import React from 'react';
import { FiUsers, FiPower, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Spinner } from '@/components/ui/Skeleton.jsx';
import EmptyState from '@/components/ui/EmptyState';

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
            <div className="bg-white dark:bg-[#1E1E1E] rounded-[2rem] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
                </div>
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <EmptyState 
                icon={FiUsers}
                title="No Students Found"
                description="The student database is currently empty or no students match your search criteria. Please check your spelling or add a new student record."
                className="min-h-[450px]"
            />
        );
    }

    return (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-[1rem] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden relative">
            <div className="absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/80 dark:ring-white/5 pointer-events-none"></div>
            <div className="p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
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
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
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
