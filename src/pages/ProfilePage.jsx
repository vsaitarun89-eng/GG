import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { Settings, Award, Users, Activity, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const MOCK_STREAK = Array.from({ length: 84 }).map(() => Math.floor(Math.random() * 4));

export default function ProfilePage() {
  const navigate = useNavigate();
  
  let user = {};
  try {
    const raw = localStorage.getItem('gainGridUser');
    if (raw && raw !== 'undefined') {
      user = JSON.parse(raw);
    }
  } catch {
    // defaults used
  }
  
  const handleLogout = () => {
    localStorage.removeItem('gainGridToken');
    localStorage.removeItem('gainGridUser');
    navigate('/');
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <MainLayout>
      <div className="profile-container animate-fade-in">
        
        <header className="profile-header">
          <div className="profile-info-section">
            <div className="profile-avatar-large">
              {user.profilePhoto && user.profilePhoto.length > 5 ? (
                <img src={user.profilePhoto} alt="Profile" />
              ) : (
                <span>{getInitial(user.fullName)}</span>
              )}
            </div>
            <div className="profile-details">
              <h1>{user.fullName || 'Unknown Athlete'}</h1>
              <span className="profile-username">@{user.username || 'user'}</span>
              
              <div className="profile-tags">
                {user.fitness_level && <span className="profile-tag level">{user.fitness_level}</span>}
                {user.goal && <span className="profile-tag goal">{user.goal}</span>}
                {user.role === 'admin' && <span className="profile-tag admin">ADMIN</span>}
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <Button variant="outline" className="icon-btn" onClick={() => navigate('/settings')}>
              <Settings size={18} /> Edit
            </Button>
            <Button variant="secondary" className="icon-btn" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </Button>
          </div>
        </header>

        <div className="profile-stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Activity size={24}/></div>
            <div className="stat-value">124</div>
            <div className="stat-label">Workouts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Users size={24}/></div>
            <div className="stat-value">4.2k</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Award size={24}/></div>
            <div className="stat-value">LVL 8</div>
            <div className="stat-label">Rank</div>
          </div>
        </div>

        <section className="profile-section">
          <h3>Activity Streak (12 Weeks)</h3>
          <div className="streak-map">
            {/* Generating mock heatmap blocks */}
            {MOCK_STREAK.map((lvl, i) => (
              <div 
                key={i} 
                className={`streak-block lvl-${lvl}`}
                title={`Day ${i+1}`}
              ></div>
            ))}
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
