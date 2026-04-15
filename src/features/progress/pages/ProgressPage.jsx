import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

export default function ProgressPage() {
  return (
    <MainLayout>
      <div className="p-8 text-center" style={{ paddingTop: '100px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>My Progress 📈</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Track weight, body fat, and muscle mass via charts. Coming soon!</p>
      </div>
    </MainLayout>
  );
}
