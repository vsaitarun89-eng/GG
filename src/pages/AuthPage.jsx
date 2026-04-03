import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import './AuthPage.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      // Save token and user
      localStorage.setItem('gainGridToken', data.token);
      localStorage.setItem('gainGridUser', JSON.stringify(data.user));
      
      // Redirect based on role and onboarding status
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (data.user.onboarding_completed === 0) {
        navigate('/onboarding');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container glow-bg animate-fade-in">
      <div className="auth-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>
        
        <div className="auth-header">
          <h2>Continue with Email</h2>
          <p>Welcome to GainGrid</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${!isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(false); setError(null); }}
            type="button"
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(true); setError(null); }}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form-fields" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label>FULL NAME</label>
              <input 
                type="text" 
                placeholder="Rahul Sharma" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required={isSignUp}
              />
            </div>
          )}

          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>PASSWORD</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Min. 6 characters" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
              <button 
                type="button" 
                className="pwd-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth className="auth-submit-btn">
            {isLoading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
          </Button>
        </form>

        <div className="auth-footer">
          {!isSignUp && (
            <div className="mb-4">
              <a href="#" className="forgot-link">Forgot your password?</a>
            </div>
          )}
          
          <p>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span 
              className="text-primary cursor-pointer font-bold" 
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
