import React, { useState, useEffect } from 'react';
import { fetchSummary } from '../api';
import { List, FolderOpen, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import './Dashboard.css';
import './Analytics.css';

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
    return (
      <div className="dashboard" style={{ padding: 'var(--spacing-6)' }}>
        <div className="dashboard-header">
          <h1 className="page-title">Summary & Analytics</h1>
          <p className="page-subtitle">Loading metrics...</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-lg)', fontWeight: 500 }}>Loading analytics data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard" style={{ padding: 'var(--spacing-6)' }}>
        <div style={{ backgroundColor: 'var(--color-danger-bg)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--color-danger-300)' }}>
          <AlertTriangle size={32} color="var(--color-danger-600)" style={{ margin: '0 auto var(--spacing-3)' }} />
          <h2 style={{ color: 'var(--color-danger-700)', marginBottom: 'var(--spacing-2)' }}>Failed to load analytics</h2>
          <p style={{ color: 'var(--color-danger-600)' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!data || (data.total === 0 && data.open === 0 && data.inProgress === 0 && data.resolved === 0 && data.escalated === 0)) {
    return (
      <div className="dashboard" style={{ padding: 'var(--spacing-6)' }}>
        <div className="dashboard-header">
          <h1 className="page-title">Summary & Analytics</h1>
          <p className="page-subtitle">Overview of the current complaint statistics across the system.</p>
        </div>
        <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', marginTop: '20px', color: 'var(--color-gray-500)', fontSize: '1.1rem', border: '1px dashed var(--color-gray-300)' }}>
          <FolderOpen size={48} color="var(--color-gray-300)" style={{ margin: '0 auto var(--spacing-4)' }} />
          No data available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ padding: 'var(--spacing-6)' }}>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Summary & Analytics</h1>
          <p className="page-subtitle">Overview of the current complaint statistics across the system.</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="stat-card stat-card-total">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total</h3>
            <div className="stat-icon-wrapper"><List size={20} /></div>
          </div>
          <p className="stat-value">{data.total}</p>
        </div>
        
        <div className="stat-card stat-card-open">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Open</h3>
            <div className="stat-icon-wrapper"><FolderOpen size={20} /></div>
          </div>
          <p className="stat-value">{data.open}</p>
        </div>
        
        <div className="stat-card stat-card-progress">
          <div className="stat-card-header">
            <h3 className="stat-card-title">In Progress</h3>
            <div className="stat-icon-wrapper"><Clock size={20} /></div>
          </div>
          <p className="stat-value">{data.inProgress}</p>
        </div>
        
        <div className="stat-card stat-card-escalated">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Escalated</h3>
            <div className="stat-icon-wrapper"><AlertTriangle size={20} /></div>
          </div>
          <p className="stat-value">{data.escalated}</p>
        </div>
        
        <div className="stat-card stat-card-resolved">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Resolved</h3>
            <div className="stat-icon-wrapper"><CheckCircle size={20} /></div>
          </div>
          <p className="stat-value">{data.resolved}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
