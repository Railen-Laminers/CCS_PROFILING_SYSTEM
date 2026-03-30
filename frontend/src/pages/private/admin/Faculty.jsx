import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import useFaculty from '@/hooks/useFaculty';
import { exportToExcel } from '@/lib/excelHelper';
import { 
    FiPlus, FiTrash2, FiEye, FiEyeOff, FiSave, FiX, 
    FiDownload, FiSearch, FiUsers, FiMail, FiPhone, 
    FiMapPin, FiCalendar, FiBookOpen 
} from 'react-icons/fi';
import EditIcon from '@/components/ui/EditIcon';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Skeleton';
import FacultyFilters from '@/components/filters/FacultyFilters';
import Pagination from '@/components/ui/Pagination';

// Helper: parse data that can be string or array
const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') return data.split(',').map(s => s.trim()).filter(Boolean);
    return [];
};

const FacultyPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const {
        faculty,
        loading,
        error,
        pagination,
        currentPage,
        setCurrentPage,
        tempSearchQuery,
        setTempSearchQuery,
        filters,
        setFilters,
        departments,
        positions,
        isSearching,
        handleSearch,
        clearFilters,
        searchQuery,
        fetchAllFaculty,
        formMode,
        formData,
        fieldErrors,
        touched,
        showForm,
        isCreating,
        isUpdating,
        deletingUserId,
        togglingUserId,
        showPassword,
        showConfirmPassword,
        setShowPassword,
        setShowConfirmPassword,
        handleInputChange,
        handleBlur,
        resetForm,
        handleCreate,
        handleEdit,
        handleUpdate,
        handleDelete,
        handleToggleStatus,
        openCreateForm,
        refresh,
    } = useFaculty();

    const [isExporting, setIsExporting] = useState(false);

    if (user?.role !== 'admin') {
        return <div className="p-6 text-red-500 dark:text-red-400">You do not have permission to view this page.</div>;
    }

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const allFaculty = await fetchAllFaculty();
            if (!allFaculty.length) {
                showToast('No faculty records found to export.', 'info');
                return;
            }
            const exportData = allFaculty.map(f => ({
                'Faculty ID': f.user.user_id,
                'Full Name': `${f.user.firstname} ${f.user.middlename ? f.user.middlename + ' ' : ''}${f.user.lastname}`,
                'Email': f.user.email,
                'Department': f.faculty?.department || 'N/A',
                'Position': f.faculty?.position || 'N/A',
                'Specialization': f.faculty?.specialization || 'N/A',
                'Contact Number': f.user.contact_number ? `'${f.user.contact_number}` : 'N/A',
                'Status': f.user.is_active ? 'Active' : 'Inactive'
            }));
            const date = new Date().toISOString().split('T')[0];
            exportToExcel(exportData, `Faculty_Management_Report_${date}.xlsx`);
            showToast(`Successfully exported ${allFaculty.length} faculty records.`, 'success');
        } catch (err) {
            showToast('Failed to export faculty data.', 'error');
            console.error('Export error:', err);
        } finally {
            setIsExporting(false);
        }
    };

    // Helper to render a field with error, help text, and onBlur
    const renderField = (label, name, type = 'text', required = false, options = null, helpText = null) => {
        const value = formData[name];
        const fieldError = fieldErrors[name];
        const showError = touched[name] || fieldError;

        return (
            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {type === 'select' ? (
                    <Select
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(name)}
                        error={showError ? fieldError : undefined}
                    >
                        <option value="">Select {label}</option>
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Select>
                ) : type === 'textarea' ? (
                    <Textarea
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(name)}
                        rows="2"
                        error={showError ? fieldError : undefined}
                    />
                ) : type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            name={name}
                            checked={value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                ) : (
                    <Input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(name)}
                        error={showError ? fieldError : undefined}
                    />
                )}
                {helpText && !fieldError && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
            </div>
        );
    };

    // --- Faculty Card Component (matches Figma) ---
    const FacultyCard = ({ member }) => {
        const fullName = `${member.user.firstname} ${member.user.lastname}`;
        const initials = member.user.firstname?.[0] || 'F';
        const subjects = parseList(member.faculty?.subjects_handled);
        const schedule = parseList(member.faculty?.teaching_schedule);
        const research = parseList(member.faculty?.research_projects);

        const MAX_CHIPS = 3;
        const MAX_SCHEDULE = 2;
        const MAX_RESEARCH = 2;

        return (
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 group">
                {/* Header: Avatar + Name + Position */}
                <div className="p-5 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-brand-500/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-[16px] font-bold text-gray-900 dark:text-white truncate leading-snug">{fullName}</h3>
                            <p className="text-[14px] text-gray-500 dark:text-zinc-500 mt-0.5 font-medium">{member.user.user_id}</p>
                            {member.faculty?.position ? (
                                <span className="mt-2 inline-block text-[13px] font-semibold text-brand-600 dark:text-brand-400 border border-brand-300 dark:border-brand-500/40 bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-md">
                                    {member.faculty.position}
                                </span>
                            ) : (
                                <span className="mt-2 inline-block text-[13px] font-medium text-gray-400 dark:text-zinc-600 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 px-3 py-1 rounded-md italic">
                                    No position
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body: All Fields */}
                <div className="p-5 space-y-4 flex-1">
                    {/* Department */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Department</p>
                        {member.faculty?.department ? (
                            <p className="text-[14px] font-semibold text-gray-900 dark:text-white">{member.faculty.department}</p>
                        ) : (
                            <p className="text-[14px] italic text-gray-400 dark:text-zinc-600">Not provided</p>
                        )}
                    </div>

                    {/* Specialization */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Specialization</p>
                        {member.faculty?.specialization ? (
                            <p className="text-[14px] text-gray-700 dark:text-zinc-300">{member.faculty.specialization}</p>
                        ) : (
                            <p className="text-[14px] italic text-gray-400 dark:text-zinc-600">Not provided</p>
                        )}
                    </div>

                    {/* Subjects Handled — Chips */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Subjects Handled</p>
                        {subjects.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {subjects.slice(0, MAX_CHIPS).map((subj, idx) => (
                                    <span key={idx} className="px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md">
                                        {subj}
                                    </span>
                                ))}
                                {subjects.length > MAX_CHIPS && (
                                    <span className="px-2.5 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 rounded-md">
                                        +{subjects.length - MAX_CHIPS} more
                                    </span>
                                )}
                            </div>
                        ) : (
                            <p className="text-[14px] italic text-gray-400 dark:text-zinc-600">No subjects assigned</p>
                        )}
                    </div>

                    {/* Contact Info — Icons */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
                        <div className="flex items-center gap-2.5 text-[14px]">
                            <FiMail className="w-4 h-4 shrink-0 text-gray-400 dark:text-zinc-500" />
                            <span className="text-gray-700 dark:text-zinc-300 truncate">{member.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[14px]">
                            <FiPhone className="w-4 h-4 shrink-0 text-gray-400 dark:text-zinc-500" />
                            {member.user.contact_number ? (
                                <span className="text-gray-700 dark:text-zinc-300">{member.user.contact_number}</span>
                            ) : (
                                <span className="text-gray-400 dark:text-zinc-600 italic">Not provided</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2.5 text-[14px]">
                            <FiMapPin className="w-4 h-4 shrink-0 text-gray-400 dark:text-zinc-500" />
                            {member.user.address ? (
                                <span className="text-gray-700 dark:text-zinc-300 truncate">{member.user.address}</span>
                            ) : (
                                <span className="text-gray-400 dark:text-zinc-600 italic">Not provided</span>
                            )}
                        </div>
                    </div>

                    {/* Teaching Schedule */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Teaching Schedule</p>
                        {schedule.length > 0 ? (
                            <div className="space-y-1">
                                {schedule.slice(0, MAX_SCHEDULE).map((item, idx) => (
                                    <p key={idx} className="text-[14px] text-gray-700 dark:text-zinc-300">{item}</p>
                                ))}
                                {schedule.length > MAX_SCHEDULE && (
                                    <p className="text-[13px] font-semibold text-brand-500 dark:text-brand-400 cursor-pointer hover:underline">
                                        +{schedule.length - MAX_SCHEDULE} more schedules
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-[14px] italic text-gray-400 dark:text-zinc-600">No schedule recorded</p>
                        )}
                    </div>

                    {/* Research Projects */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Research Projects</p>
                        {research.length > 0 ? (
                            <div className="space-y-1">
                                {research.slice(0, MAX_RESEARCH).map((item, idx) => (
                                    <p key={idx} className="text-[14px] text-gray-700 dark:text-zinc-300">{item}</p>
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
                <div className="px-5 pb-5 pt-2 mt-auto flex gap-2.5">
                    <button 
                        onClick={() => navigate(`/faculty/${member.user.id}`)}
                        className="flex-1 h-9 bg-brand-500 hover:bg-brand-400 text-white rounded-lg text-[13px] font-semibold transition-all active:scale-[0.97] shadow-sm"
                    >
                        View Details
                    </button>
                    <button 
                        onClick={() => handleEdit(member)}
                        className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-brand-500 active:scale-[0.97] transition-all"
                        title="Edit"
                    >
                        <EditIcon className="w-[18px] h-[18px]" />
                    </button>
                    <button 
                        onClick={() => handleDelete(member.user.id)}
                        className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.97] transition-all"
                        title="Delete"
                    >
                        {deletingUserId === member.user.id ? <Spinner className="w-4 h-4" /> : <FiTrash2 className="w-[18px] h-[18px]" />}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Faculty Management</h1>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-surface-secondary shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                        <FiDownload className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} /> 
                        {isExporting ? 'Exporting...' : 'Export Data'}
                    </button>
                    <button
                        onClick={openCreateForm}
                        className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <FiPlus className="w-4 h-4" /> Add Faculty
                        </span>
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <FacultyFilters 
                tempSearchQuery={tempSearchQuery}
                setTempSearchQuery={setTempSearchQuery}
                handleSearch={handleSearch}
                isSearching={isSearching}
                filters={filters}
                setFilters={setFilters}
                departments={departments}
                positions={positions}
                clearFilters={clearFilters}
                searchQuery={searchQuery}
            />

            {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
                    {error}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex justify-between items-center z-10 shrink-0">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {formMode === 'create' ? 'Add New Faculty' : 'Edit Faculty Record'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto w-full p-6">
                            <form id="faculty-form" onSubmit={formMode === 'create' ? handleCreate : handleUpdate} className="space-y-5">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {renderField('First Name', 'firstname', 'text', true, null, 'Maximum 255 characters')}
                                    {renderField('Middle Name', 'middlename', 'text', false, null, 'Maximum 255 characters')}
                                    {renderField('Last Name', 'lastname', 'text', true, null, 'Maximum 255 characters')}
                                    {renderField('Faculty ID', 'user_id', 'text', true, null, 'Exactly 7 digits')}
                                    {renderField('Email', 'email', 'email', true, null, 'Valid email address')}
                                </div>

                                {/* Personal Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-200 dark:border-gray-800">
                                    {renderField('Birth Date', 'birth_date', 'date')}
                                    {renderField('Contact Number', 'contact_number')}
                                    {renderField('Gender', 'gender', 'select', false, [
                                        { value: 'male', label: 'Male' },
                                        { value: 'female', label: 'Female' },
                                        { value: 'other', label: 'Other' }
                                    ])}
                                    {renderField('Address', 'address', 'textarea')}
                                    {renderField('Active', 'is_active', 'checkbox')}
                                </div>

                                {/* Password */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-200 dark:border-gray-800">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Password {formMode === 'create' && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                onBlur={() => handleBlur('password')}
                                                className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${fieldErrors.password && (touched.password || fieldErrors.password) ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                            Confirm Password {formMode === 'create' && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={formData.password_confirmation}
                                                onChange={handleInputChange}
                                                onBlur={() => handleBlur('password_confirmation')}
                                                className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${fieldErrors.password_confirmation && (touched.password_confirmation || fieldErrors.password_confirmation) ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
                                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Faculty Details */}
                                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">Faculty Profile</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {renderField('Department', 'department', 'select', false, [
                                            { value: 'Information Technology', label: 'Information Technology' },
                                            { value: 'Computer Science', label: 'Computer Science' }
                                        ])}
                                        {renderField('Position / Rank', 'position')}
                                        {renderField('Specialization', 'specialization')}
                                        {renderField('Subjects Handled (comma separated)', 'subjects_handled', 'text', false, null, 'e.g. AI, Database, Web')}
                                        {renderField('Teaching Schedule (comma separated)', 'teaching_schedule', 'text', false, null, 'e.g. Mon 9-12 - AI')}
                                        {renderField('Research Projects (comma separated)', 'research_projects', 'text', false, null, 'e.g. Neural Networks, ML')}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#181818] border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end gap-3 shrink-0">
                            <Button variant="secondary" onClick={resetForm} disabled={isCreating || isUpdating}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" form="faculty-form" className="gap-2 bg-brand-500 text-white" disabled={isCreating || isUpdating}>
                                {(isCreating || isUpdating) ? <Spinner /> : <FiSave />}
                                <span>{formMode === 'create' ? 'Create Faculty' : 'Save Changes'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Faculty Cards Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20 min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
                </div>
            ) : faculty.length === 0 ? (
                <div className="bg-white dark:bg-[#1E1E1E] py-20 rounded-2xl border border-gray-200 dark:border-gray-700/50 flex flex-col items-center">
                    <FiUsers className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-4" />
                    <p className="text-gray-500 dark:text-zinc-400 font-medium text-lg">No Faculty Found</p>
                    <p className="text-gray-400 dark:text-zinc-500 text-sm">Try adjusting your filters or search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {faculty.map((member) => (
                        <FacultyCard key={member.user.id} member={member} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && faculty.length > 0 && (
                <div className="mt-8">
                    <Pagination 
                        pagination={pagination}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default FacultyPage;
