import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const DashboardLayout = ({ children }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', desktopCollapsed);
  }, [desktopCollapsed]);

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <Sidebar
        isMobileDrawerOpen={mobileDrawerOpen}
        setMobileDrawerOpen={setMobileDrawerOpen}
        collapsed={desktopCollapsed}
      />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Header 
          onMenuClick={() => setMobileDrawerOpen(true)} 
          onToggleSidebar={() => setDesktopCollapsed(!desktopCollapsed)}
          sidebarCollapsed={desktopCollapsed}
        />
        <main className="flex-1 overflow-y-scroll p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;