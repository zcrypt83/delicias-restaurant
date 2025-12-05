// src/components/layout/Layout.jsx
import React, { useState } from 'react';
import Navigation from './Navigation';
import Footer from './Footer'
import useResponsive from '../../hooks/UseResponsive';

function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isMobile } = useResponsive(992);

  const getLayoutClass = () => {
    if (isMobile) return 'with-sidebar-mobile';
    return sidebarCollapsed ? 'with-sidebar-collapsed' : 'with-sidebar-expanded';
  };

  return (
    <div className="app-layout">
      <Navigation 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className={`main-content ${getLayoutClass()}`}>
        <div className="main-content-wrapper d-flex flex-column min-vh-100">
          <div className="flex-grow-1">
            {children}
          </div>
          
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Layout;