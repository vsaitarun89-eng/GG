import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Search, PlayCircle, Clock, Flame } from 'lucide-react';
import './WorkoutPage.css';

export default function WorkoutPage() {
  const [activeTab, setActiveTab] = useState('browse');

  const muscleGroups = [
    { name: 'Chest', icon: '⚡', color: '#ff4b4b' },
    { name: 'Back', icon: '💪', color: '#4b7bff' },
    { name: 'Legs', icon: '🦵', color: '#4bff4b' },
    { name: 'Arms', icon: '🦾', color: '#ffb54b' },
    { name: 'Core', icon: '🔥', color: '#ff4bff' },
    { name: 'Cardio', icon: '🏃', color: '#4bffff' },
  ];

  const popularWorkouts = [
    { title: 'Push Day Finisher', time: '45 min', intensity: 'High', cal: 420 },
    { title: 'Pull Day Essentials', time: '60 min', intensity: 'Medium', cal: 350 },
    { title: 'Leg Day Annihilation', time: '75 min', intensity: 'Extreme', cal: 600 },
    { title: 'Core Crusher', time: '15 min', intensity: 'High', cal: 150 },
  ];

  return (
    <MainLayout>
      <div className="workout-container animate-fade-in">
        <header className="workout-header">
          <h1>Workouts</h1>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search exercises, plans, creators..." />
          </div>
        </header>

        <nav className="workout-tabs">
          <button className={activeTab === 'library' ? 'active' : ''} onClick={() => setActiveTab('library')}>My Library</button>
          <button className={activeTab === 'browse' ? 'active' : ''} onClick={() => setActiveTab('browse')}>Browse</button>
          <button className={activeTab === 'plans' ? 'active' : ''} onClick={() => setActiveTab('plans')}>Plans</button>
        </nav>

        {activeTab === 'browse' && (
          <div className="browser-content">
            <section className="muscle-group-section">
              <h3>Muscle Groups</h3>
              <div className="muscle-grid">
                {muscleGroups.map(mg => (
                  <div className="muscle-card" key={mg.name} style={{ borderBottomColor: mg.color }}>
                    <span className="muscle-icon">{mg.icon}</span>
                    <h4>{mg.name}</h4>
                  </div>
                ))}
              </div>
            </section>

            <section className="popular-workouts-section">
              <h3>Popular Routines</h3>
              <div className="workout-list">
                {popularWorkouts.map((workout, i) => (
                  <div className="workout-list-item" key={i}>
                    <div className="workout-info">
                      <h4>{workout.title}</h4>
                      <div className="workout-meta">
                        <span><Clock size={14} /> {workout.time}</span>
                        <span><Flame size={14} /> {workout.cal} cal</span>
                        <span className={`intensity intensity-${workout.intensity.toLowerCase()}`}>{workout.intensity}</span>
                      </div>
                    </div>
                    <button className="play-btn">
                      <PlayCircle size={24} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab !== 'browse' && (
          <div className="empty-state">
            <p>You have no saved workouts yet. Browse to add some!</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
