import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';

import AuthPage from './features/auth/pages/AuthPage';
import OnboardingPage from './features/auth/pages/OnboardingPage';

import HomePage from './features/feed/pages/HomePage';
import ExplorePage from './features/feed/pages/ExplorePage';

import WorkoutPage from './features/workout/pages/WorkoutPage';
import GymsPage from './features/gyms/pages/GymsPage';
import ChallengesPage from './features/challenges/pages/ChallengesPage';
import MessagesPage from './features/messages/pages/MessagesPage';
import ProgressPage from './features/progress/pages/ProgressPage';

import ProfilePage from './features/profile/pages/ProfilePage';
import SettingsPage from './features/profile/pages/SettingsPage';

import AdminDashboard from './pages/admin/AdminDashboard'; // Assuming Admin stays in pages/admin for now

function AdminRoute({ children }) {
  const userStr = localStorage.getItem('gainGridUser');
  if (!userStr) return <Navigate to="/" />;
  
  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch {
    user = null;
  }
  
  if (!user || user.role !== 'admin') return <Navigate to="/home" />;
  
  return children;
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('gainGridToken');
  const userStr = localStorage.getItem('gainGridUser');
  if (!token || !userStr) return <Navigate to="/" />;
  
  let user;
  try {
    user = JSON.parse(userStr);
  } catch {
    return <Navigate to="/" />;
  }
  
  if (user && user.onboarding_completed === 0) return <Navigate to="/onboarding" />;
  
  return children;
}

function OnboardingRoute({ children }) {
  const token = localStorage.getItem('gainGridToken');
  const userStr = localStorage.getItem('gainGridUser');
  if (!token || !userStr) return <Navigate to="/" />;
  
  let user;
  try {
    user = JSON.parse(userStr);
  } catch {
    return <Navigate to="/" />;
  }
  
  if (user && user.onboarding_completed === 1) return <Navigate to="/home" />;
  
  return children;
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><ExplorePage /></PrivateRoute>} />
          <Route path="/workout" element={<PrivateRoute><WorkoutPage /></PrivateRoute>} />
          <Route path="/challenges" element={<PrivateRoute><ChallengesPage /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
          <Route path="/gyms" element={<PrivateRoute><GymsPage /></PrivateRoute>} />
          <Route path="/progress" element={<PrivateRoute><ProgressPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />

          <Route path="/onboarding" element={
            <OnboardingRoute>
              <OnboardingPage />
            </OnboardingRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
