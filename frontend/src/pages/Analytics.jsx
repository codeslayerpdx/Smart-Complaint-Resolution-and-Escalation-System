import React, { useState, useEffect } from 'react';
import { fetchSummary } from '../api';
import './Dashboard.css';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Fetching analytics summary data...');
        const summary = await fetchSummary();
        console.log('Analytics data received:', summary);
        setData(summary);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', fontSize: '1.1rem' }}>Loading analytics data...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!data || (data.total === 0 && data.open === 0 && data.inProgress === 0 && data.resolved === 0 && data.escalated === 0)) {
    return (
      <div className="dashboard" style={{ padding: '20px' }}>
        <div className="dashboard-header">
          <h1 className="page-title">Summary & Analytics</h1>
        </div>
        <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', marginTop: '20px', color: '#64748b', fontSize: '1.1rem' }}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ padding: '20px' }}>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Summary & Analytics</h1>
          <p className="page-subtitle">Overview of the current complaint statistics across the system.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>Total</h3>
          <p style={{ fontSize: '2.5rem', margin: '15px 0 0 0', fontWeight: 'bold', color: '#334155' }}>{data.total}</p>
        </div>
        <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '1.1rem' }}>Open</h3>
          <p style={{ fontSize: '2.5rem', margin: '15px 0 0 0', fontWeight: 'bold', color: '#1d4ed8' }}>{data.open}</p>
        </div>
        <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#d97706', fontSize: '1.1rem' }}>In Progress</h3>
          <p style={{ fontSize: '2.5rem', margin: '15px 0 0 0', fontWeight: 'bold', color: '#b45309' }}>{data.inProgress}</p>
        </div>
        <div style={{ background: '#fce7f3', padding: '20px', borderRadius: '8px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#db2777', fontSize: '1.1rem' }}>Escalated</h3>
          <p style={{ fontSize: '2.5rem', margin: '15px 0 0 0', fontWeight: 'bold', color: '#be185d' }}>{data.escalated}</p>
        </div>
        <div style={{ background: '#ecfdf5', padding: '20px', borderRadius: '8px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#10b981', fontSize: '1.1rem' }}>Resolved</h3>
          <p style={{ fontSize: '2.5rem', margin: '15px 0 0 0', fontWeight: 'bold', color: '#047857' }}>{data.resolved}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
