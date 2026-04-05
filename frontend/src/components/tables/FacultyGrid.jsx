import React from 'react';
import { FiUsers, FiMail, FiPhone, FiMapPin, FiTrash2, FiPower } from 'react-icons/fi';
import EditIcon from '@/components/ui/EditIcon';
import { Spinner } from '@/components/ui/Skeleton.jsx';
import EmptyState from '@/components/ui/EmptyState';
import { parseList } from '@/lib/facultyHelpers';

const FacultyCard = ({ member, navigate, handleEdit, handleDelete, deletingUserId, handleToggleStatus, togglingUserId }) => {
    const fullName = `${member.user.firstname} ${member.user.lastname}`;
    const initials = member.user.firstname?.[0] || 'F';
    const research = parseList(member.faculty?.research_projects);
    const isActive = member.user.is_active;

    const MAX_RESEARCH = 2;

    return (
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 group">
            {/* Header: Avatar + Name + Position */}
            <div className="p-4 sm:p-5 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xl font-bold shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-bold text-gray-900 dark:text-white truncate leading-snug">{fullName}</h3>
                        <p className="text-[13px] text-gray-500 dark:text-zinc-500 mt-0.5 font-medium">{member.user.user_id}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {member.faculty?.position ? (
                                <span className="inline-block text-[12px] font-semibold text-brand-600 dark:text-brand-400 border border-brand-300 dark:border-brand-500/40 bg-brand-50 dark:bg-brand-500/10 px-2.5 py-0.5 rounded-md text-left leading-tight">
                                    {member.faculty.position}
                                </span>
                            ) : (
                                <span className="inline-block text-[12px] font-medium text-gray-400 dark:text-zinc-600 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 px-2.5 py-0.5 rounded-md italic text-left leading-tight">
                                    No position
                                </span>
                            )}
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[12px] font-bold border leading-tight ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-gray-100 dark:bg-zinc-500/10 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-500/20'}`}>
                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                                {isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body: All Fields */}
            <div className="p-4 sm:p-5 space-y-4 flex-1 text-left">
                {/* Department */}
                <div>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Department</p>
                    {member.faculty?.department ? (
                        <p className="text-[14px] font-medium text-gray-900 dark:text-white line-clamp-1">{member.faculty.department}</p>
                    ) : (
                        <p className="text-[14px] italic text-gray-400 dark:text-zinc-600">Not provided</p>
                    )}
                </div>

                {/* Specialization */}
                <div>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Specialization</p>
                    {member.faculty?.specialization ? (
                        <p className="text-[14px] text-gray-700 dark:text-zinc-300 line-clamp-1">{member.faculty.specialization}</p>
                    ) : (
                        <p className="text-[14px] italic text-gray-400 dark:text-zinc-600">Not provided</p>
                    )}
                </div>

                {/* Contact Info — Icons */}
                <div className="pt-3.5 border-t border-gray-100 dark:border-gray-800 space-y-2">
                    <div className="flex items-center gap-3 text-[14px]">
                        <FiMail className="w-4 h-4 shrink-0 text-brand-500" />
                        <span className="text-gray-700 dark:text-zinc-300 truncate">{member.user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[14px]">
                        <FiPhone className="w-4 h-4 shrink-0 text-brand-500" />
                        {member.user.contact_number ? (
                            <span className="text-gray-700 dark:text-zinc-300">{member.user.contact_number}</span>
                        ) : (
                            <span className="text-gray-400 dark:text-zinc-600 italic">Not provided</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-[14px]">
                        <FiMapPin className="w-4 h-4 shrink-0 text-brand-500" />
                        {member.user.address ? (
                            <span className="text-gray-700 dark:text-zinc-300 truncate">{member.user.address}</span>
                        ) : (
                            <span className="text-gray-400 dark:text-zinc-600 italic">Not provided</span>
                        )}
                    </div>
                </div>

                {/* Research Projects */}
                <div className="pt-3.5 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Research Projects</p>
                    {research.length > 0 ? (
                        <div className="space-y-1">
                            {research.slice(0, MAX_RESEARCH).map((item, idx) => (
                                <p key={idx} className="text-[14px] text-gray-700 dark:text-zinc-300 line-clamp-1">{item}</p>
                            ))}
                            {research.length > MAX_RESEARCH && (
                                <p className="text-[13px] font-semibold text-brand-500 dark:text-brand-400 cursor-pointer hover:underline">
                                    +{research.length - MAX_RESEARCH} more projects
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-[14px] italic text-gray-400 dark:text-zinc-600">No research recorded</p>
                    )}
                </div>
            </div>

            {/* Footer: Actions */}
            <div className="px-4 sm:px-5 pb-5 mt-auto flex gap-2.5">
                <button 
                    onClick={() => navigate(`/faculty/${member.user.id}`)}
                    className="flex-1 h-9 bg-brand-500 hover:bg-brand-400 text-white rounded-[8px] text-[13px] font-bold transition-all active:scale-[0.97] shadow-sm"
                >
                    View Details
                </button>
                <button
                    onClick={() => handleToggleStatus(member)}
                    className={`w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-[8px] transition-all ${isActive ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                    title={isActive ? 'Deactivate' : 'Activate'}
                    disabled={togglingUserId !== null}
                >
                    {togglingUserId === member.user.id ? <Spinner className="w-4 h-4" /> : <FiPower className="w-[18px] h-[18px]" />}
                </button>
                <button 
                    onClick={() => handleEdit(member)}
                    className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-[8px] text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit"
                    disabled={togglingUserId !== null || deletingUserId !== null}
                >
                    <EditIcon className="w-[18px] h-[18px]" />
                </button>
                <button 
                    onClick={() => handleDelete(member.user.id)}
                    className={`w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-[8px] active:scale-[0.97] transition-all ${isActive ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                    title={isActive ? 'Must deactivate before deletion' : 'Delete'}
                    disabled={isActive || deletingUserId !== null || togglingUserId !== null}
                >
                    {deletingUserId === member.user.id ? <Spinner className="w-4 h-4" /> : <FiTrash2 className="w-[18px] h-[18px]" />}
                </button>
            </div>
        </div>
    );
};

const FacultyGrid = ({ faculty, loading, navigate, handleEdit, handleDelete, deletingUserId, handleToggleStatus, togglingUserId }) => {
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
                className="min-h-[450px]"
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {faculty.map((member) => (
                <FacultyCard 
                    key={member.user.id} 
                    member={member} 
                    navigate={navigate}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    deletingUserId={deletingUserId}
                    handleToggleStatus={handleToggleStatus}
                    togglingUserId={togglingUserId}
                />
            ))}
        </div>
    );
};

export default FacultyGrid;
