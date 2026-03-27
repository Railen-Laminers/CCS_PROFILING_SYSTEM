import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] dark:bg-[#121212]">
      {/* Full width header */}
      <Header />

      {/* Sidebar and main content row */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-[#F9FAFB] dark:bg-[#121212]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
