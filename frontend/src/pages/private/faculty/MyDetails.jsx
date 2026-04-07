import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaMapMarkerAlt, FaBriefcase, FaBook, FaUsers } from 'react-icons/fa';

export const MyDetails = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-6 text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  const facultyProfile = user.faculty || {};
  const infoSections = [
    {
      title: 'Personal Information',
      icon: FaUser,
      fields: [
        { label: 'Full Name', value: `${user.firstname} ${user.middlename || ''} ${user.lastname}`.trim() },
        { label: 'Email', value: user.email },
        { label: 'User ID', value: user.user_id },
        { label: 'Gender', value: user.gender || 'N/A', icon: FaVenusMars },
        { label: 'Birth Date', value: user.birth_date ? new Date(user.birth_date).toLocaleDateString() : 'N/A' },
        { label: 'Contact', value: user.contact_number || 'N/A', icon: FaPhone },
        { label: 'Address', value: user.address || 'N/A', icon: FaMapMarkerAlt },
      ]
    },
    {
      title: 'Professional Information',
      icon: FaBriefcase,
      fields: [
        { label: 'Department', value: facultyProfile.department || 'N/A', icon: FaUsers },
        { label: 'Position', value: facultyProfile.position || 'N/A', icon: FaBriefcase },
        { label: 'Specialization', value: facultyProfile.specialization || 'N/A', icon: FaBook },
      ]
    },
    {
      title: 'Subjects Handled',
      icon: FaBook,
      fields: [
        { label: 'Subjects', value: facultyProfile.subjects_handled?.length ? facultyProfile.subjects_handled.join(', ') : 'None assigned' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        My Details
      </h1>

      <div className="space-y-6">
        {infoSections.map((section, index) => (
          <div key={index} className="bg-white dark:bg-surface-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <section.icon className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {section.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="flex items-start gap-3">
                  {field.icon && <field.icon className="w-4 h-4 text-gray-400 mt-1" />}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{field.label}</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDetails;