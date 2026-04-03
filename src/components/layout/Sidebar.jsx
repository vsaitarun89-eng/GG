import React from 'react';
import { Home, Compass, User, TrendingUp, Settings, PlusCircle, Dumbbell, Award, MessageSquare, MapPin } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Button from '../ui/Button';
import './Sidebar.css';

export default function Sidebar({ className = '' }) {
  let user = { fullName: "Unknown User" };
  try {
    const raw = localStorage.getItem('gainGridUser');
    if (raw && raw !== 'undefined') {
      user = JSON.parse(raw);
    }
  } catch {
    // defaults used
  }
  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : '?';

  const navItems = [
    { icon: Home, label: 'Feed', path: '/home' },
    { icon: Compass, label: 'Discover', path: '/explore' },
    { icon: Dumbbell, label: 'Workout', path: '/workout' },
    { icon: Award, label: 'Challenges', path: '/challenges' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: MapPin, label: 'Gyms', path: '/gyms' },
    { icon: TrendingUp, label: 'My Progress', path: '/progress' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-header">
        <h2 className="logo-text text-xl">Gain<span className="text-primary">Grid</span></h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Button variant="primary" fullWidth className="create-post-btn">
          <PlusCircle size={20} />
          New Log
        </Button>
        
        <div className="user-profile-summary mt-4">
          <div className="avatar-placeholder">{initial}</div>
          <div className="user-info">
            <span className="user-name">{user.fullName}</span>
            <span className="user-level">Lvl 1 Athlete</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
