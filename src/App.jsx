import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import OnboardingPage from './pages/OnboardingPage';
import ExplorePage from './pages/ExplorePage';
import WorkoutPage from './pages/WorkoutPage';
import ChallengesPage from './pages/ChallengesPage';
import MessagesPage from './pages/MessagesPage';
import GymsPage from './pages/GymsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ProgressPage from './pages/ProgressPage';

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
  );
}

export default App;
