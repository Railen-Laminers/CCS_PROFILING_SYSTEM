import React from 'react';
import { FiUsers, FiMail, FiPhone, FiMapPin, FiTrash2 } from 'react-icons/fi';
import EditIcon from '@/components/ui/EditIcon';
import { Spinner } from '@/components/ui/Skeleton.jsx';
import EmptyState from '@/components/ui/EmptyState';
import { parseList } from '@/lib/facultyHelpers';

const FacultyCard = ({ member, navigate, handleEdit, handleDelete, deletingUserId }) => {
    const fullName = `${member.user.firstname} ${member.user.lastname}`;
    const initials = member.user.firstname?.[0] || 'F';
    const research = parseList(member.faculty?.research_projects);

    const MAX_RESEARCH = 2;

    return (
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 group">
            {/* Header: Avatar + Name + Position */}
            <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-base font-bold shadow-md shadow-brand-500/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate leading-snug">{fullName}</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5 font-medium">{member.user.user_id}</p>
                        {member.faculty?.position ? (
                            <span className="mt-1.5 inline-block text-[11px] font-semibold text-brand-600 dark:text-brand-400 border border-brand-300 dark:border-brand-500/40 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded text-left">
                                {member.faculty.position}
                            </span>
                        ) : (
                            <span className="mt-1.5 inline-block text-[11px] font-medium text-gray-400 dark:text-zinc-600 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 px-2 py-0.5 rounded italic text-left">
                                No position
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Body: All Fields */}
            <div className="px-4 py-3.5 space-y-3 flex-1 text-left">
                {/* Department */}
                <div>
                    <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">Department</p>
                    {member.faculty?.department ? (
                        <p className="text-[13px] font-semibold text-gray-900 dark:text-white">{member.faculty.department}</p>
                    ) : (
                        <p className="text-[13px] italic text-gray-400 dark:text-zinc-600">Not provided</p>
                    )}
                </div>

                {/* Specialization */}
                <div>
                    <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">Specialization</p>
                    {member.faculty?.specialization ? (
                        <p className="text-[13px] text-gray-700 dark:text-zinc-300">{member.faculty.specialization}</p>
                    ) : (
                        <p className="text-[13px] italic text-gray-400 dark:text-zinc-600">Not provided</p>
                    )}
                </div>

                {/* Contact Info */}
                <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-[13px]">
                        <FiMail className="w-3.5 h-3.5 shrink-0 text-brand-500" />
                        <span className="text-gray-700 dark:text-zinc-300 truncate">{member.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px]">
                        <FiPhone className="w-3.5 h-3.5 shrink-0 text-brand-500" />
                        {member.user.contact_number ? (
                            <span className="text-gray-700 dark:text-zinc-300">{member.user.contact_number}</span>
                        ) : (
                            <span className="text-gray-400 dark:text-zinc-600 italic">Not provided</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-[13px]">
                        <FiMapPin className="w-3.5 h-3.5 shrink-0 text-brand-500" />
                        {member.user.address ? (
                            <span className="text-gray-700 dark:text-zinc-300 truncate">{member.user.address}</span>
                        ) : (
                            <span className="text-gray-400 dark:text-zinc-600 italic">Not provided</span>
                        )}
                    </div>
                </div>

                {/* Research Projects */}
                <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Research Projects</p>
                    {research.length > 0 ? (
                        <div className="space-y-0.5">
                            {research.slice(0, MAX_RESEARCH).map((item, idx) => (
                                <p key={idx} className="text-[13px] text-gray-700 dark:text-zinc-300">{item}</p>
                            ))}
                            {research.length > MAX_RESEARCH && (
                                <p className="text-[12px] font-semibold text-brand-500 dark:text-brand-400 cursor-pointer hover:underline">
                                    +{research.length - MAX_RESEARCH} more projects
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-[13px] italic text-gray-400 dark:text-zinc-600">No research recorded</p>
                    )}
                </div>
            </div>

            {/* Footer: Actions */}
            <div className="px-4 pb-3.5 pt-1 mt-auto flex gap-2">
                <button 
                    onClick={() => navigate(`/faculty/${member.user.id}`)}
                    className="flex-1 h-8 bg-brand-500 hover:bg-brand-400 text-white rounded-lg text-[13px] font-semibold transition-all active:scale-[0.97] shadow-sm"
                >
                    View Details
                </button>
                <button 
                    onClick={() => handleEdit(member)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-brand-500 active:scale-[0.97] transition-all"
                    title="Edit"
                >
                    <EditIcon className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => handleDelete(member.user.id)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.97] transition-all"
                    title="Delete"
                >
                    {deletingUserId === member.user.id ? <Spinner className="w-3.5 h-3.5" /> : <FiTrash2 className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
};

const FacultyGrid = ({ faculty, loading, navigate, handleEdit, handleDelete, deletingUserId }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (faculty.length === 0) {
        return (
            <EmptyState 
                icon={FiUsers}
                title="No Faculty Members"
                description="We couldn't find any faculty members matching your criteria. Try adjusting your search query or filters to find what you're looking for."
                className="py-32"
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {faculty.map((member) => (
                <FacultyCard 
                    key={member.user.id} 
                    member={member} 
                    navigate={navigate}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    deletingUserId={deletingUserId}
                />
            ))}
        </div>
    );
};

export default FacultyGrid;
