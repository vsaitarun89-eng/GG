import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulated login gating using provided credentials
    if (email === 'tarun@gmail.com' && password === 'S@i85t@run') {
      navigate('/home');
    } else {
      // For now, accept anything to demonstrate UI, or enforce it.
      navigate('/home');
    }
  };

  return (
    <div className="landing-container glow-bg animate-fade-in">
      <div className="landing-content">
        <div className="logo-container">
          <h1 className="logo-text">Gain<span className="text-primary">Grid</span></h1>
          <p className="subtitle">India's Gym Community</p>
        </div>

        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-value">50K+</span>
            <span className="stat-label">Athletes</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">1200+</span>
            <span className="stat-label">Gyms</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">50+</span>
            <span className="stat-label">Cities</span>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" variant="primary" fullWidth className="mt-4 submit-btn">
            Sign In / Continue
          </Button>

          <Button type="button" variant="secondary" fullWidth className="mt-2 text-white">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
        </form>

        <div className="footer-links">
          <a href="#">Terms of Service</a>
          <span>•</span>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
