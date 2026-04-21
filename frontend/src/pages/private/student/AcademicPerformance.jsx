import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AcademicPerformanceForm from '@/components/forms/AcademicPerformanceForm';

const AcademicPerformance = () => {
  const navigate = useNavigate();

  const handleCancel = () => navigate('/student/dashboard');
  const handleBack = () => navigate('/student/dashboard');

  return (
    <DashboardLayout>
      <AcademicPerformanceForm onCancel={handleCancel} onBack={handleBack} />
    </DashboardLayout>
  );
};

export default AcademicPerformance;