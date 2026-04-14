import React from 'react';
import { FiArrowLeft, FiUser, FiSave } from 'react-icons/fi';

const PersonalInfoForm = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Back to Dashboard Link */}
      <button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
        <FiArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8 pb-2 border-b border-gray-50">
            <FiUser className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
          </div>

          <form className="space-y-6">
            {/* First, Middle, Last Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">First Name *</label>
                <input type="text" placeholder="Enter first name" className="w-full p-2.5 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Middle Name</label>
                <input type="text" placeholder="Enter middle name" className="w-full p-2.5 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Last Name *</label>
                <input type="text" placeholder="Enter last name" className="w-full p-2.5 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
              </div>
            </div>

            {/* ID and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Student ID *</label>
                <input type="text" placeholder="Enter student ID" className="w-full p-2.5 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Gender *</label>
                <select className="w-full p-2.5 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm text-gray-500">
                  <option>Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            {/* Birthdate and Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Birthdate *</label>
                <input type="date" className="w-full p-2.5 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm text-gray-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Contact Number *</label>
                <input type="text" placeholder="+63 XXX XXX XXXX" className="w-full p-2.5 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Email Address *</label>
              <input type="email" placeholder="student@example.com" className="w-full p-2.5 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
            </div>

            {/* Complete Address */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Complete Address *</label>
              <input type="text" placeholder="Street, Barangay, City, Province, Zip Code" className="w-full p-2.5 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
            </div>

            {/* Parent Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Parent/Guardian Name *</label>
                <input type="text" placeholder="Full name" className="w-full p-2.5 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Emergency Contact Number *</label>
                <input type="text" placeholder="+63 XXX XXX XXXX" className="w-full p-2.5 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button type="button" className="px-6 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
                <FiSave className="w-4 h-4" />
                Save Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;