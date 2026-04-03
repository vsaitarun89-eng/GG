import React from 'react';
import MainLayout from '../components/layout/MainLayout';

export default function ExplorePage() {
  return (
    <MainLayout>
      <div className="p-8 text-center" style={{ paddingTop: '100px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Explore 🌍</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Discover trending workouts and athletes. Coming soon!</p>
      </div>
    </MainLayout>
  );
}
