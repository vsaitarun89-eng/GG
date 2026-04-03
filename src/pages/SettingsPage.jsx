import React from 'react';
import MainLayout from '../components/layout/MainLayout';

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="p-8 text-center" style={{ paddingTop: '100px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Settings ⚙️</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Configure your app preferences. Coming soon!</p>
      </div>
    </MainLayout>
  );
}
