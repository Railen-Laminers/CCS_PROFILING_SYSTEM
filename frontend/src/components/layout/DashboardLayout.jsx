import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-transparent">
      {/* Header on top spanning full width */}
      <Header />

      {/* Main Content Area containing Sidebar and Children */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
