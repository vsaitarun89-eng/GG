import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import './OnboardingPage.css';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    fitnessLevel: '',
    goal: '',
    gymLocation: '',
    profilePhoto: ''
  });

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const completeOnboarding = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('gainGridToken');
      const res = await fetch('/api/auth/onboarding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to complete onboarding');
      
      // Update local storage with new user info
      localStorage.setItem('gainGridUser', JSON.stringify(data.user));
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* Step Renderers */
  const renderStep1 = () => (
    <div className="onboarding-step animate-fade-in">
      <h2>What's your name?</h2>
      <p className="subtitle">Let's set up your unique identity.</p>
      <div className="form-group mt-6">
        <label>USERNAME</label>
        <input 
          type="text" 
          placeholder="e.g. gymbro99" 
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
          required
        />
      </div>
      <Button 
        variant="primary" 
        fullWidth className="mt-8"
        onClick={nextStep}
        disabled={formData.username.length < 3}
      >
        Continue
      </Button>
    </div>
  );

  const renderStep2 = () => {
    const levels = [
      { id: 'Beginner', icon: '🌱', label: 'Beginner', desc: '< 6 months' },
      { id: 'Intermediate', icon: '💪', label: 'Intermediate', desc: '6 months - 2 years' },
      { id: 'Advanced', icon: '🔥', label: 'Advanced', desc: '2+ years' },
    ];
    
    return (
      <div className="onboarding-step animate-fade-in">
        <h2>How long have you been training?</h2>
        <div className="selection-grid mt-6">
          {levels.map(lvl => (
            <div 
              key={lvl.id} 
              className={`select-card ${formData.fitnessLevel === lvl.id ? 'active' : ''}`}
              onClick={() => { setFormData({...formData, fitnessLevel: lvl.id}); setTimeout(nextStep, 300); }}
            >
              <div className="select-icon">{lvl.icon}</div>
              <div className="select-text">
                <h4>{lvl.label}</h4>
                <p>{lvl.desc}</p>
              </div>
              {formData.fitnessLevel === lvl.id && <Check className="check-icon" />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const goals = [
      { id: 'Bulk Up', icon: '🏋️', label: 'Bulk Up' },
      { id: 'Lose Fat', icon: '🔥', label: 'Lose Fat' },
      { id: 'Build Strength', icon: '💪', label: 'Build Strength' },
      { id: 'Endurance', icon: '🏃', label: 'Endurance' },
      { id: 'General Fitness', icon: '⚡', label: 'General Fitness' },
    ];
    
    return (
      <div className="onboarding-step animate-fade-in">
        <h2>What are you training for?</h2>
        <div className="selection-grid mt-6">
          {goals.map(g => (
            <div 
              key={g.id} 
              className={`select-card ${formData.goal === g.id ? 'active' : ''}`}
              onClick={() => { setFormData({...formData, goal: g.id}); setTimeout(nextStep, 300); }}
            >
              <div className="select-icon">{g.icon}</div>
              <div className="select-text">
                <h4>{g.label}</h4>
              </div>
              {formData.goal === g.id && <Check className="check-icon" />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="onboarding-step animate-fade-in">
      <h2>Find where you train</h2>
      <p className="subtitle">Connect with others at your gym.</p>
      <div className="form-group mt-6">
        <label>YOUR GYM LOCATION</label>
        <input 
          type="text" 
          placeholder="e.g. Gold's Gym, LA Fitness..." 
          value={formData.gymLocation}
          onChange={(e) => setFormData({...formData, gymLocation: e.target.value})}
        />
      </div>
      <div className="step-actions mt-8">
        <Button variant="outline" className="flex-1" onClick={nextStep}>Skip</Button>
        <Button variant="primary" className="flex-1" onClick={nextStep} disabled={!formData.gymLocation}>Continue</Button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="onboarding-step animate-fade-in">
      <h2>Add a profile photo</h2>
      <p className="subtitle">Welcome Badge + 50 GP reward!</p>
      
      <div className="photo-upload-area mt-6">
        <div className="photo-circle">
          {formData.profilePhoto ? (
            <img src={formData.profilePhoto} alt="Profile" />
          ) : (
            <Camera size={40} className="text-muted" />
          )}
        </div>
        <Button 
          variant="secondary" 
          onClick={() => setFormData({...formData, profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + formData.username})}
        >
          Generate Avatar
        </Button>
      </div>

      {error && <div className="error-banner mt-4">{error}</div>}

      <div className="step-actions mt-8">
        <Button variant="outline" className="flex-1" onClick={completeOnboarding} disabled={loading}>Skip</Button>
        <Button variant="primary" className="flex-1" onClick={completeOnboarding} disabled={loading}>
          {loading ? 'Saving...' : '🎉 Complete Setup'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="onboarding-container glow-bg">
      <div className="onboarding-card">
        {step > 1 && (
          <button className="back-btn" onClick={prevStep}>
            <ChevronLeft size={20} />
          </button>
        )}
        
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>
        
        <div className="step-count">Step {step} of 5</div>

        <div className="onboarding-content">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>
      </div>
    </div>
  );
}
