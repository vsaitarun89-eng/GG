import React from 'react';
import MainLayout from '../components/layout/MainLayout';

export default function GymsPage() {
  return (
    <MainLayout>
      <div className="p-8 text-center" style={{ paddingTop: '100px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Gym Directory 🏋️‍♂️</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Find and rate gyms near you. Coming soon!</p>
      </div>
    </MainLayout>
  );
}
