import React, { useState, useEffect } from 'react';
import { fetchEscalated } from '../api';
import ComplaintCard from '../components/ComplaintCard';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Escalations = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEscalated = async () => {
      try {
        setLoading(true);
        console.log('Fetching escalated complaints...');
        const data = await fetchEscalated();
        console.log('Escalated complaints received:', data);
        setComplaints(data || []);
      } catch (err) {
        console.error('Error fetching escalated complaints:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadEscalated();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', fontSize: '1.1rem' }}>Loading escalated complaints...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ padding: '20px' }}>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Escalated Complaints</h1>
          <p className="page-subtitle">Complaints requiring immediate attention and higher level review.</p>
        </div>
      </div>

      {!complaints || complaints.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', marginTop: '20px', color: '#64748b', fontSize: '1.1rem' }}>
          No data available
        </div>
      ) : (
        <div className="complaints-grid" style={{ marginTop: '20px' }}>
          {complaints.map((complaint) => (
            <ComplaintCard 
              key={complaint._id} 
              complaint={complaint} 
              onClick={(id) => navigate(`/complaint/${id}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Escalations;
