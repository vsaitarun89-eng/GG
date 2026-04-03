import React from 'react';
import MainLayout from '../components/layout/MainLayout';

export default function MessagesPage() {
  return (
    <MainLayout>
      <div className="p-8 text-center" style={{ paddingTop: '100px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Messages 💬</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Chat with athletes and coaches. Coming soon!</p>
      </div>
    </MainLayout>
  );
}
