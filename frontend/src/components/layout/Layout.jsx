import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const role = user?.role || 'student';
  const userName = user?.name || 'Demo User';

  useEffect(() => {
    if (!user) {
       navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="layout-container">
      <Sidebar role={role} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`layout-main ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Navbar role={role} userName={userName} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default Layout;
