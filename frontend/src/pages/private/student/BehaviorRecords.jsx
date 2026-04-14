import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BehaviorRecordsForm from '@/components/forms/BehaviorRecordsForm';

const BehaviorRecords = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/student/dashboard');
  };

  const handleBack = () => {
    navigate('/student/dashboard');
  };

  return (
    <DashboardLayout>
      <BehaviorRecordsForm 
        onCancel={handleCancel}
        onBack={handleBack}
      />
    </DashboardLayout>
  );
};

export default BehaviorRecords;