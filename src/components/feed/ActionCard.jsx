import React from 'react';
import Card from '../ui/Card';
import './ActionCard.css';

export default function ActionCard({ title, icon: Icon, colorClass }) {
  return (
    <div className={`action-card cursor-pointer ${colorClass}`}>
      <Icon size={22} className="action-icon" />
      <span className="action-title">{title}</span>
    </div>
  );
}
