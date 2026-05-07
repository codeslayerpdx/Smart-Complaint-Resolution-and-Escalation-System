import React, { useState } from 'react';
import Card, { CardHeader, CardContent, CardFooter } from './ui/Card';
import Badge from './ui/Badge';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import Timer from './Timer';
import { ChevronRight } from 'lucide-react';
import './ComplaintCard.css';

const timeAgo = (date) => {
  if (!date) return 'N/A';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
  }
  return "Just now";
};

const ComplaintCard = ({ complaint, onClick }) => {
  const isResolved = complaint.status === 'resolved';
  const [slaInfo, setSlaInfo] = useState(null);

  // Dynamically determine effective status based on SLA for styling
  const effectiveStatus = isResolved ? 'resolved' :
    (slaInfo?.isOverdue ? 'escalated' : complaint.status);

  return (
    <Card 
      className={`complaint-card status-border-${effectiveStatus}`}
      onClick={() => onClick(complaint._id || complaint.id)}
    >
      <CardHeader 
        title={
          <div className="complaint-card-title">
            <div className="complaint-id-row">
              <PriorityBadge priority={complaint.priority} />
              <span className="complaint-id">#{String(complaint._id || complaint.id).slice(-6)}</span>
            </div>
            <h4>{complaint.title}</h4>
          </div>
        }
      />
      <CardContent>
        <div className="complaint-badges">
          <StatusBadge status={effectiveStatus} />
          {effectiveStatus === 'escalated' && slaInfo?.escalationLevel && (
            <Badge variant="danger" size="sm">{slaInfo.escalationLevel}</Badge>
          )}
          {effectiveStatus === 'escalated' && !slaInfo?.escalationLevel && complaint.escalationLevel && (
            <Badge variant="danger" size="sm">{complaint.escalationLevel}</Badge>
          )}
        </div>
        
        <div className="complaint-meta">
          <div className="meta-item">
            <span className="meta-label">Category</span>
            <span className="meta-value">{complaint.category}</span>
          </div>
          
          {isResolved ? (
            <div className="meta-item resolved-meta-item">
              <span className="meta-label">Resolution Time</span>
              <span className="meta-value">{complaint.resolutionTime || 'Resolved on time'}</span>
            </div>
          ) : (
            <div className="meta-item">
              <span className="meta-label">SLA Countdown</span>
              <span className="meta-value">
                <Timer 
                  createdAt={complaint.createdAt || complaint.date}
                  priority={complaint.priority}
                  status={complaint.status}
                  onSlaUpdate={setSlaInfo}
                />
              </span>
            </div>
          )}
          {complaint.reason && !isResolved && (
            <div className="meta-item delay-reason">
              <span className="meta-label">Reason for Delay</span>
              <span className="meta-value">{complaint.reason}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="complaint-footer">
        <span className="complaint-date">
          {isResolved 
            ? `Resolved ${timeAgo(complaint.resolvedAt)}` 
            : `Raised ${timeAgo(complaint.createdAt)}`
          }
        </span>
        <div className="complaint-action-link">
          View Details <ChevronRight size={16} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ComplaintCard;
