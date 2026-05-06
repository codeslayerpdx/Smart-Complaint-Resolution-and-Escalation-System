import React from 'react';
import './ui/Badge.css';

const PriorityBadge = ({ priority }) => {
  if (!priority) return null;
  return (
    <span className={`priority-dot priority-${priority}`} title={`Priority: ${priority}`}></span>
  );
};

export default PriorityBadge;
