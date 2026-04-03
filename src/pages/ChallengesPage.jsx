import React from 'react';
import MainLayout from '../components/layout/MainLayout';

export default function ChallengesPage() {
  return (
    <MainLayout>
      <div className="p-8 text-center" style={{ paddingTop: '100px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Challenges 🏆</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Participate in global fitness events. Coming soon!</p>
      </div>
    </MainLayout>
  );
}
