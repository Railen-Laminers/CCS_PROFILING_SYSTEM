import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const DashboardLayout = ({ children }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-transparent">
      <Header onMenuClick={() => setMobileDrawerOpen(true)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isMobileDrawerOpen={mobileDrawerOpen}
          setMobileDrawerOpen={setMobileDrawerOpen}
        />
        <main className="flex-1 overflow-y-scroll p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;