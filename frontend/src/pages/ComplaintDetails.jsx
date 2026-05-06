import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { ArrowLeft, Clock, MessageSquare, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { fetchComplaints, updateComplaintStatus, assignComplaint, fetchAssignableUsers } from '../api';
import './ComplaintDetails.css';

const MOCK_COMPLAINT_DETAILS = {
  id: 'CMP-1001',
  title: 'Water Leakage in Bathroom 3rd Floor',
  category: 'Plumbing',
  status: 'escalated',
  priority: 'high',
  escalationLevel: 'L2',
  date: 'Oct 24, 2023, 10:30 AM',
  location: 'Block A, 3rd Floor Bathroom',
  description: 'There has been a continuous water leak from the ceiling in the 3rd-floor bathroom for the past 2 days. It is causing a pool of water on the floor, which is a slipping hazard.',
  reporter: {
    name: 'Alex Student',
    role: 'Student',
    phone: '+1 234 567 8900'
  },
  timeline: [
    { id: 1, status: 'open', date: 'Oct 24, 2023, 10:30 AM', note: 'Complaint registered by Alex Student.' },
    { id: 2, status: 'in-progress', date: 'Oct 24, 2023, 11:45 AM', note: 'Assigned to Staff Member (Plumber).' },
    { id: 3, status: 'escalated', date: 'Oct 25, 2023, 11:45 AM', note: 'SLA breached. Escalated to L1 (Facility Manager).' },
    { id: 4, status: 'escalated', date: 'Oct 26, 2023, 11:45 AM', note: 'Escalated to L2 (Admin). Notes: Waiting for external plumbing service.' }
  ],
  comments: [
    { id: 1, author: 'Facility Manager', role: 'Staff', date: 'Oct 25, 10:00 AM', text: 'External plumber has been contacted. They will arrive tomorrow.' },
    { id: 2, author: 'Alex Student', role: 'Student', date: 'Oct 25, 11:30 AM', text: 'Please expedite, the leak is getting worse.' }
  ]
};

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');

  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignableUsers, setAssignableUsers] = useState([]);

  const userRole = localStorage.getItem('userRole') || 'student';

  const loadComplaint = async () => {
    try {
      setLoading(true);
      const allComplaints = await fetchComplaints();
      const found = allComplaints.find(c => c._id === id || c.id === id);
      if (!found) {
        setError('Complaint not found');
      } else {
        const rawStatus = (found.status || 'open').toLowerCase();
        const status = rawStatus === 'pending' ? 'open' : rawStatus;
        setComplaint({
          ...found,
          status
        });
        setStatus(status);
        setAssignedTo(found.assignedTo || '');
      }
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Unauthorized')) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
    if (userRole === 'admin' || userRole === 'supervisor') {
      loadAssignableUsers();
    }
  }, [id, userRole]);

  const loadAssignableUsers = async () => {
    try {
      const users = await fetchAssignableUsers();
      setAssignableUsers(users);
    } catch (err) {
      console.error('Failed to fetch assignable users', err);
    }
  };

  const handleStatusUpdate = async () => {
    if (!status) return;
    try {
      await updateComplaintStatus(id, status);
      alert('Status updated successfully!');
      loadComplaint();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAssign = async () => {
    if (!assignedTo) return;
    try {
      await assignComplaint(id, assignedTo);
      alert('Complaint assigned successfully!');
      loadComplaint();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setNewComment('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'escalated': return <AlertTriangle size={16} />;
      case 'resolved': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="complaint-details-page" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-lg)', fontWeight: 500 }}>Loading complaint details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="complaint-details-page">
        <div style={{ backgroundColor: 'var(--color-danger-bg)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--color-danger-300)' }}>
          <AlertTriangle size={32} color="var(--color-danger-600)" style={{ margin: '0 auto var(--spacing-3)' }} />
          <h2 style={{ color: 'var(--color-danger-700)', marginBottom: 'var(--spacing-2)' }}>Failed to load complaint</h2>
          <p style={{ color: 'var(--color-danger-600)' }}>{error}</p>
          <Button variant="outline" className="mt-3" onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (!complaint) return null;

  // Provide fallbacks for UI elements not fully implemented in backend yet
  const displayComplaint = {
    ...complaint,
    timeline: complaint.timeline || [],
    comments: complaint.comments || [],
    reporter: complaint.user ? { name: complaint.user.name, role: 'User', phone: 'N/A' } : { name: 'Unknown User', role: 'Student', phone: 'N/A' },
    date: complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : 'N/A',
    location: complaint.location || 'Not specified',
    id: complaint._id || complaint.id
  };

  return (
    <div className="complaint-details-page">
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="details-header">
        <div className="title-section">
          <span className="complaint-id-large">{displayComplaint.id}</span>
          <h1 className="page-title">{displayComplaint.title}</h1>
        </div>
        <div className="action-section">
          {(userRole === 'staff' || userRole === 'supervisor' || userRole === 'admin') && (
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
              </select>
              <Button variant="primary" onClick={handleStatusUpdate}>Update Status</Button>
            </div>
          )}

          {(userRole === 'admin' || userRole === 'supervisor') && (
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Select Staff / Admin...</option>
                {assignableUsers.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              <Button variant="secondary" onClick={handleAssign} disabled={!assignedTo}>Assign</Button>
            </div>
          )}
        </div>
      </div>

      <div className="details-grid">
        {/* Left Column - Main Details */}
        <div className="main-content">
          <Card className="info-card">
            <CardContent>
              <div className="info-badges">
                <StatusBadge status={displayComplaint.status} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', border: '1px solid var(--color-gray-200)', padding: 'var(--spacing-1) var(--spacing-3)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-600)' }}>
                  <PriorityBadge priority={displayComplaint.priority} />
                  {displayComplaint.priority ? displayComplaint.priority.toUpperCase() : 'LOW'} PRIORITY
                </div>
                {displayComplaint.status === 'escalated' && displayComplaint.escalationLevel && (
                  <Badge variant="danger" size="md">Escalation: {displayComplaint.escalationLevel}</Badge>
                )}
              </div>

              <div className="info-grid">
                <div className="info-group">
                  <span className="info-label">Category</span>
                  <span className="info-value">{displayComplaint.category}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Location</span>
                  <span className="info-value">{displayComplaint.location}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Date Reported</span>
                  <span className="info-value">{displayComplaint.date}</span>
                </div>
              </div>

              <div className="description-section">
                <h3 className="section-title">Description</h3>
                <p className="description-text">{displayComplaint.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="comments-card">
            <CardHeader title="Comments & Discussion" />
            <CardContent>
              <div className="comments-list">
                {displayComplaint.comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      <User size={20} />
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <Badge variant="default" size="sm">{comment.role}</Badge>
                        <span className="comment-date">{comment.date}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                ))}
                {displayComplaint.comments.length === 0 && (
                  <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No comments yet.</p>
                )}
              </div>
              
              <form className="add-comment-form" onSubmit={handleAddComment}>
                <Input
                  id="newComment"
                  type="textarea"
                  placeholder="Type your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-0"
                />
                <Button type="submit" variant="primary" className="mt-3">
                  <MessageSquare size={16} className="mr-2" />
                  Post Comment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline & Reporter Info */}
        <div className="side-content">
          <Card className="timeline-card">
            <CardHeader title="Status Timeline" />
            <CardContent>
              <div className="timeline">
                {displayComplaint.timeline.map((event, index) => (
                  <div key={event.id} className="timeline-event">
                    <div className="timeline-marker">
                      <div className={`marker-dot status-${event.status}`}></div>
                      {index < displayComplaint.timeline.length - 1 && <div className="marker-line"></div>}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <Badge variant={event.status} size="sm">{event.status.toUpperCase()}</Badge>
                        <span className="timeline-date">{event.date}</span>
                      </div>
                      <p className="timeline-note">{event.note}</p>
                    </div>
                  </div>
                ))}
                {displayComplaint.timeline.length === 0 && (
                  <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No timeline events yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="reporter-card">
            <CardHeader title="Reporter Details" />
            <CardContent>
              <div className="reporter-info">
                <div className="info-group">
                  <span className="info-label">Name</span>
                  <span className="info-value">{displayComplaint.reporter.name}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Role</span>
                  <span className="info-value">{displayComplaint.reporter.role}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Contact</span>
                  <span className="info-value">{displayComplaint.reporter.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
