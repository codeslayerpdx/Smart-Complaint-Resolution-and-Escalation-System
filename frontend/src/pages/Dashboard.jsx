import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import ComplaintCard from '../components/ComplaintCard';
import { useNavigate } from 'react-router-dom';
import { fetchComplaints } from '../api';
import { useAuth } from '../context/AuthContext';
import { getSLAStatus } from '../utils/sla';
import './Dashboard.css';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();

  const loadComplaints = async () => {
    try {
      const data = await fetchComplaints();
      const sanitizedData = data.map(c => {
        const rawStatus = (c.status || 'open').toLowerCase();
        const status = rawStatus === 'pending' ? 'open' : rawStatus;
        
        let effectiveStatus = status;
        if (status !== 'resolved' && status !== 'escalated') {
          const sla = getSLAStatus(c.createdAt || c.date, c.priority);
          if (sla?.isOverdue) {
            effectiveStatus = 'escalated';
          }
        }

        return {
          ...c,
          status,
          effectiveStatus
        };
      });
      setComplaints(sanitizedData);
    } catch (err) {
      setError(err.message);
      // Basic fallback error handling
      if (err.message.includes('Unauthorized')) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's an overview of the complaints.</p>
        </div>
        {(user?.role || localStorage.getItem('userRole')) === 'student' && (
          <Button onClick={() => navigate('/raise-complaint')}>
            Raise New Complaint
          </Button>
        )}
      </div>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: 'red', borderRadius: '4px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({complaints.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'open' ? 'active' : ''}`}
          onClick={() => setActiveTab('open')}
        >
          Open ({complaints.filter(c => c.effectiveStatus === 'open').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'in-progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('in-progress')}
        >
          In Progress ({complaints.filter(c => c.effectiveStatus === 'in-progress').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'escalated' ? 'active' : ''}`}
          onClick={() => setActiveTab('escalated')}
        >
          Escalated ({complaints.filter(c => c.effectiveStatus === 'escalated').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'resolved' ? 'active' : ''}`}
          onClick={() => setActiveTab('resolved')}
        >
          Resolved ({complaints.filter(c => c.effectiveStatus === 'resolved').length})
        </button>
      </div>

      <div className="complaints-grid">
        {complaints.filter(c => activeTab === 'all' || c.effectiveStatus === activeTab).map((complaint) => (
          <ComplaintCard key={complaint._id} complaint={complaint} onClick={(id) => navigate(`/complaint/${id}`)} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
