import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SportsActivitiesForm from '@/components/forms/SportsActivitiesForm';

const SportsActivities = () => {
  const navigate = useNavigate();

  const handleCancel = () => navigate('/student/dashboard');
  const handleBack = () => navigate('/student/dashboard');

  return (
    <DashboardLayout>
      <SportsActivitiesForm onCancel={handleCancel} onBack={handleBack} />
    </DashboardLayout>
  );
};

export default SportsActivities;