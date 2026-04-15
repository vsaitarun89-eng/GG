import React from 'react';
import { Search, Bell } from 'lucide-react';
import './TopBar.css';

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search gyms, athletes or split routines..." 
          className="search-input"
        />
      </div>
      
      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>
      </div>
    </header>
  );
}
