import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MedicalRecordsForm from '@/components/forms/MedicalRecordsForm';

const MedicalRecords = () => {
  const navigate = useNavigate();

  const handleCancel = () => navigate('/student/dashboard');
  const handleBack = () => navigate('/student/dashboard');

  return (
    <DashboardLayout>
      <MedicalRecordsForm onCancel={handleCancel} onBack={handleBack} />
    </DashboardLayout>
  );
};

export default MedicalRecords;