import React from 'react';
import { FiX, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Skeleton';

const FacultyFormModal = ({
    showForm,
    resetForm,
    formMode,
    formData,
    fieldErrors,
    touched,
    handleInputChange,
    handleBlur,
    handleCreate,
    handleUpdate,
    isCreating,
    isUpdating,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    departments,
    positions
}) => {
    if (!showForm) return null;

    // Helper to render a field with error, help text, and onBlur
    const renderField = (label, name, type = 'text', required = false, options = null, helpText = null) => {
        const value = formData[name];
        const fieldError = fieldErrors[name];
        const showError = touched[name] || fieldError;

        return (
            <div className="mb-4 text-left">
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

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-[1rem] w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden">
                <div className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex justify-between items-center z-10 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {formMode === 'create' ? 'Add New Faculty' : 'Edit Faculty Record'}
                    </h2>
                    <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
                <div className="overflow-y-auto w-full p-6 bg-white dark:bg-[#1E1E1E]">
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
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-left">
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
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-left">
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
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 text-left">Faculty Profile</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {renderField('Department', 'department', 'select', false, 
                                    departments.map(d => ({ value: d, label: d }))
                                )}
                                {renderField('Position / Rank', 'position', 'select', false,
                                    positions.map(p => ({ value: p, label: p }))
                                )}
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
    );
};

export default FacultyFormModal;
