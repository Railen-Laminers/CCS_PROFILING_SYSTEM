import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import useFaculty from '../../../hooks/useFaculty';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSave, FiX, FiDownload, FiSearch, FiUsers, FiPower } from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Skeleton, Spinner } from '@/components/ui/Skeleton';

const FacultyPage = () => {
    const { user } = useAuth();
    const {
        faculty,
        loading,
        error,
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
    } = useFaculty();

    if (user?.role !== 'admin') {
        return <div className="p-6 text-red-500 dark:text-red-400">You do not have permission to view this page.</div>;
    }

    // Helper to render a field with error, help text, and onBlur
    const renderField = (label, name, type = 'text', required = false, options = null, helpText = null) => {
        const value = formData[name];
        const error = fieldErrors[name];
        const showError = touched[name] || error;

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
                        error={showError ? error : undefined}
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
                        error={showError ? error : undefined}
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
                        error={showError ? error : undefined}
                    />
                )}
                {helpText && !error && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Faculty Management</h1>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="gap-2">
                        <FiDownload className="w-4 h-4" /> Export Data
                    </Button>
                    <Button
                        variant="primary"
                        onClick={openCreateForm}
                        className="gap-2"
                    >
                        <FiPlus className="w-4 h-4" /> Add Faculty
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex justify-between items-center z-10 shrink-0">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                {formMode === 'create' ? 'Add New Faculty' : 'Edit Faculty Record'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
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
                                    {renderField('Faculty ID', 'user_id', 'text', true, null, 'Exactly 7 digits (e.g., 2024001)')}
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
                                        <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 mb-1.5">
                                            Password {formMode === 'create' && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                onBlur={() => handleBlur('password')}
                                                className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${fieldErrors.password && (touched.password || fieldErrors.password) ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-lg`}
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                        {!fieldErrors.password && (
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                At least 8 characters, including uppercase, lowercase, and number.
                                            </p>
                                        )}
                                        {fieldErrors.password && (touched.password || fieldErrors.password) && (
                                            <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 mb-1.5">
                                            Confirm Password {formMode === 'create' && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={formData.password_confirmation}
                                                onChange={handleInputChange}
                                                onBlur={() => handleBlur('password_confirmation')}
                                                className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border ${fieldErrors.password_confirmation && (touched.password_confirmation || fieldErrors.password_confirmation) ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-lg`}
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
                                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                        {fieldErrors.password_confirmation && (touched.password_confirmation || fieldErrors.password_confirmation) && (
                                            <p className="mt-1 text-xs text-red-500">{fieldErrors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Faculty Details */}
                                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Faculty Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {renderField('Department', 'department', 'select', true, [
                                            { value: 'BSIT', label: 'BS Information Technology' },
                                            { value: 'BSCS', label: 'BS Computer Science' }
                                        ])}
                                        {renderField('Specialization', 'specialization')}
                                        {renderField('Subjects Handled (comma separated)', 'subjects_handled', 'text', false, null, 'Separate with commas')}
                                        {renderField('Teaching Schedule (comma separated)', 'teaching_schedule', 'text', false, null, 'Separate with commas')}
                                        {renderField('Research Projects (comma separated)', 'research_projects', 'text', false, null, 'Separate with commas')}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#181818] border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end gap-3 shrink-0">
                            <Button variant="secondary" type="button" onClick={resetForm} disabled={isCreating || isUpdating}>Cancel</Button>
                            <Button variant="primary" type="submit" form="faculty-form" className="gap-2" disabled={isCreating || isUpdating}>
                                {(isCreating || isUpdating) ? <Spinner /> : <FiSave />}
                                <span>{formMode === 'create' ? 'Create Faculty' : 'Save Changes'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <Card className="p-6 mb-6">
                <div className="relative w-full">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5 pointer-events-none" />
                    <Input type="text" placeholder="Search by name, faculty ID, or department..." className="pl-11 h-10" />
                </div>
            </Card>

            {/* Faculty Table */}
            <Card>
                {loading ? (
                    <div className="flex justify-center items-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F97316]"></div></div>
                ) : faculty.length === 0 ? (
                    <EmptyState
                        icon={<FiUsers />}
                        title="No Faculty Found"
                        description="No faculty found in the database."
                    />
                ) : (
                    <div className="p-6 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Photo</TableHead>
                                    <TableHead>Faculty ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Specialization</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {faculty.map((member) => {
                                    const fullName = [member.user.firstname, member.user.middlename, member.user.lastname].filter(Boolean).join(' ');
                                    const initials = member.user.firstname?.[0] || 'F';
                                    const isActive = member.user.is_active;
                                    return (
                                        <TableRow key={member.user.id}>
                                            <TableCell><div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">{initials}</div></TableCell>
                                            <TableCell className="font-medium">{member.user.user_id}</TableCell>
                                            <TableCell>{fullName}</TableCell>
                                            <TableCell>{member.faculty?.department || 'N/A'}</TableCell>
                                            <TableCell>{member.faculty?.specialization || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant={isActive ? 'green' : 'gray'}>
                                                    {isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleToggleStatus(member)}
                                                        className={isActive ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/20' : 'text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20'}
                                                        title={isActive ? 'Deactivate' : 'Activate'}
                                                        disabled={togglingUserId !== null}
                                                    >
                                                        {togglingUserId === member.user.id ? <Spinner /> : <FiPower className="w-4 h-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(member)}
                                                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                                        title="Edit Faculty"
                                                        disabled={togglingUserId !== null || deletingUserId !== null}
                                                    >
                                                        <FiEdit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(member.user.id)}
                                                        className={isActive ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20'}
                                                        title={isActive ? 'Must deactivate before deletion' : 'Delete Faculty'}
                                                        disabled={isActive || deletingUserId !== null || togglingUserId !== null}
                                                    >
                                                        {deletingUserId === member.user.id ? <Spinner /> : <FiTrash2 className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default FacultyPage;
