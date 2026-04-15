import React from 'react';
import './MainLayout.css';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Sidebar className="layout-sidebar" />
      
      <div className="layout-content">
        <TopBar />
        <main className="main-feed-container">
          {children}
        </main>
      </div>
    </div>
  );
}
