import React from 'react';
import Card from '../ui/Card';
import './ActionCard.css';

// eslint-disable-next-line no-unused-vars
export default function ActionCard({ title, icon: Icon, colorClass }) {
  return (
    <Card className="action-card cursor-pointer">
      <div className={`action-icon-wrapper ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div className="action-info">
        <h3>{title}</h3>
      </div>
    </Card>
  );
}
