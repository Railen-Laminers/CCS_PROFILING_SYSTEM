import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EventsForm from '@/components/forms/EventsForm';

const Events = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/student/dashboard');
  };

  const handleBack = () => {
    navigate('/student/dashboard');
  };

  return (
    <DashboardLayout>
      <EventsForm
        onCancel={handleCancel}
        onBack={handleBack}
      />
    </DashboardLayout>
  );
};

export default Events;