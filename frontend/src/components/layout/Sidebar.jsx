import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, AlertCircle, LogOut, CheckSquare, BarChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ role = 'student', isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Mock role based links
  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    ...(role === 'student' ? [
      { to: '/raise-complaint', icon: <PlusCircle size={20} />, label: 'Raise Complaint' }
    ] : []),
    ...(role === 'staff' ? [
      { to: '/assigned', icon: <CheckSquare size={20} />, label: 'Assigned Tasks' }
    ] : []),
    ...(role === 'admin' ? [
      { to: '/analytics', icon: <BarChart size={20} />, label: 'Summary / Analytics' },
      { to: '/escalations', icon: <AlertCircle size={20} />, label: 'Escalations' }
    ] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <AlertCircle className="sidebar-logo-icon" size={28} />
        <h1 className="sidebar-title">SmartFix</h1>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {links.map((link) => (
            <li key={link.to} className="sidebar-item">
              <NavLink 
                to={link.to} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
