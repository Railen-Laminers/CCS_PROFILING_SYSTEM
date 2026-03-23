import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-slate-900">
      {/* Full width header */}
      <Header />

      {/* Sidebar and main content row */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;