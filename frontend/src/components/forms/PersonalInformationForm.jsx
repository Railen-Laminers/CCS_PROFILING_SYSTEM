import React, { useState, useEffect } from 'react';
import { FiUser, FiSave, FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

const DEFAULT_FORM_DATA = {
    firstname: '',
    middlename: '',
    lastname: '',
    user_id: '',
    gender: '',
    birth_date: '',
    contact_number: '',
    email: '',
    address: '',
    parent_guardian_name: '',
    emergency_contact: '',
};

const PersonalInformationForm = ({ initialData = null, onSubmit, onCancel, onBack }) => {
    const { isDark } = useTheme();
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstname: initialData.firstname || '',
                middlename: initialData.middlename || '',
                lastname: initialData.lastname || '',
                user_id: initialData.user_id || '',
                gender: initialData.gender || '',
                birth_date: initialData.birth_date || '',
                contact_number: initialData.contact_number || '',
                email: initialData.email || '',
                address: initialData.address || '',
                parent_guardian_name: initialData.parent_guardian_name || '',
                emergency_contact: initialData.emergency_contact || '',
            });
        } else {
            setFormData(DEFAULT_FORM_DATA);
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (onSubmit) {
                await onSubmit(formData);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = `w-full h-11 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 placeholder:text-gray-400 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`;
    const textareaClass = `w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 placeholder:text-gray-400 resize-none min-h-[100px] ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`;
    const selectClass = `w-full h-11 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`;

    return (
        <div className="max-w-5xl mx-auto p-6">
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className={`flex items-center gap-2 mb-4 transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                >
                    <FiArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </button>
            )}

            <div className={`rounded-2xl shadow-md overflow-hidden ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Personal Information</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Middle Name
                            </label>
                            <input
                                type="text"
                                name="middlename"
                                value={formData.middlename}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="Enter middle name"
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Student ID
                            </label>
                            <input
                                type="text"
                                name="user_id"
                                value={formData.user_id}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="Enter student ID"
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className={selectClass}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Birthdate
                            </label>
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                name="contact_number"
                                value={formData.contact_number}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="+63"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={inputClass}
                            placeholder="Enter email address"
                        />
                    </div>

                    <div className="mb-4">
                        <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Complete Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={textareaClass}
                            placeholder="Enter complete address"
                            rows="3"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Parent/Guardian Name
                            </label>
                            <input
                                type="text"
                                name="parent_guardian_name"
                                value={formData.parent_guardian_name}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="Enter parent/guardian name"
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Emergency Contact Number
                            </label>
                            <input
                                type="tel"
                                name="emergency_contact"
                                value={formData.emergency_contact}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="+63"
                            />
                        </div>
                    </div>

                    <div className={`flex justify-end gap-3 mt-6 pt-4 ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-100'}`}>
                        <button
                            type="button"
                            onClick={onCancel}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm ${isDark ? 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-60"
                        >
                            <FiSave className="w-4 h-4" />
                            Save Information
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PersonalInformationForm;