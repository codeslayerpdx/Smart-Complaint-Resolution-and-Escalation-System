import React, { useState } from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from '../ui/NotificationDropdown';
import './Navbar.css';

const Navbar = ({ role = 'Student', userName = 'John Doe', onToggleSidebar }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { unreadCount, refreshNotifications } = useNotifications();

  const handleBellClick = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) {
      // Re-fetch notifications immediately when opening the dropdown
      refreshNotifications();
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
      </div>
      
      <div className="navbar-right">
        <div style={{ position: 'relative' }}>
          <button 
            className="navbar-icon-btn" 
            onClick={handleBellClick}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="navbar-badge">{unreadCount}</span>
            )}
          </button>

          
          <NotificationDropdown 
            isOpen={isNotifOpen} 
            onClose={() => setIsNotifOpen(false)} 
          />
        </div>
        
        <div className="navbar-profile">
          <div className="navbar-avatar">
            <User size={20} />
          </div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">{userName}</span>
            <span className="navbar-user-role">{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};


export default Navbar;
