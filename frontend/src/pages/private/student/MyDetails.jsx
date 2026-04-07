import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaBirthdayCake, FaMapMarkerAlt, FaSchool, FaGraduationCap } from 'react-icons/fa';

export const MyDetails = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-6 text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  const studentProfile = user.student || {};
  const infoSections = [
    {
      title: 'Personal Information',
      icon: FaUser,
      fields: [
        { label: 'Full Name', value: `${user.firstname} ${user.middlename || ''} ${user.lastname}`.trim() },
        { label: 'Email', value: user.email },
        { label: 'User ID', value: user.user_id },
        { label: 'Gender', value: user.gender || 'N/A', icon: FaVenusMars },
        { label: 'Birth Date', value: user.birth_date ? new Date(user.birth_date).toLocaleDateString() : 'N/A', icon: FaBirthdayCake },
        { label: 'Contact', value: user.contact_number || 'N/A', icon: FaPhone },
        { label: 'Address', value: user.address || 'N/A', icon: FaMapMarkerAlt },
      ]
    },
    {
      title: 'Academic Information',
      icon: FaGraduationCap,
      fields: [
        { label: 'Program', value: studentProfile.program || 'N/A', icon: FaSchool },
        { label: 'Section', value: studentProfile.section || 'N/A' },
        { label: 'Year Level', value: studentProfile.year_level || 'N/A' },
        { label: 'GPA', value: studentProfile.gpa || 'N/A' },
      ]
    },
    {
      title: 'Emergency Contact',
      icon: FaPhone,
      fields: [
        { label: 'Parent/Guardian', value: studentProfile.parent_guardian_name || 'N/A' },
        { label: 'Emergency Contact', value: studentProfile.emergency_contact || 'N/A' },
      ]
    },
    {
      title: 'Medical Information',
      icon: FaUser,
      fields: [
        { label: 'Blood Type', value: studentProfile.blood_type || 'N/A' },
        { label: 'Medical Condition', value: studentProfile.medical_condition || 'N/A' },
        { label: 'Allergies', value: studentProfile.allergies?.length ? studentProfile.allergies.join(', ') : 'None' },
        { label: 'Disabilities', value: studentProfile.disabilities?.length ? studentProfile.disabilities.join(', ') : 'None' },
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