import React from 'react';
import './MainLayout.css';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function MainLayout({ children, fullWidth = false }) {
  return (
    <div className="main-layout">
      <Sidebar className="layout-sidebar" />

      <div className="layout-content">
        <TopBar />
        <main className={fullWidth ? 'main-full-container' : 'main-feed-container'}>
          {children}
        </main>
      </div>
    </div>
  );
}
