import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OrganizationsForm from '@/components/forms/OrganizationsForm';

const Organizations = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/student/dashboard');
  };

  const handleBack = () => {
    navigate('/student/dashboard');
  };

  return (
    <DashboardLayout>
      <OrganizationsForm 
        onCancel={handleCancel}
        onBack={handleBack}
      />
    </DashboardLayout>
  );
};

export default Organizations;