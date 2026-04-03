import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { Users, LogOut, Activity, BarChart, DollarSign, Database, Monitor } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('gainGridToken');
    if (!token) {
      navigate('/');
      return;
    }

    fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized or failed to fetch');
        return res.json();
      })
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('gainGridToken');
    localStorage.removeItem('gainGridUser');
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Gain<span className="text-primary">Admin</span></h2>
        </div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart size={18} /> Overview
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> Users
          </button>
          <button className="admin-nav-item" onClick={() => alert('Analytics Coming Soon')}>
            <Activity size={18} /> Analytics
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main animate-fade-in">
        <header className="admin-header">
          <h1>{activeTab === 'dashboard' ? 'Admin Overview' : 'User Management'}</h1>
        </header>

        <section className="admin-content">
          {error && <div className="error-banner">{error}</div>}
          
          {activeTab === 'dashboard' && (
            <div className="admin-dashboard-grid">
              <div className="admin-metric-card">
                <div className="metric-icon bg-green"><Users size={24}/></div>
                <div className="metric-data">
                  <p className="metric-label">Total Users</p>
                  <h3>{users.length}</h3>
                  <span className="metric-change positive">+12% this week</span>
                </div>
              </div>
              <div className="admin-metric-card">
                <div className="metric-icon bg-blue"><Monitor size={24}/></div>
                <div className="metric-data">
                  <p className="metric-label">Active Sessions</p>
                  <h3>34</h3>
                  <span className="metric-change neutral">Steady</span>
                </div>
              </div>
              <div className="admin-metric-card">
                <div className="metric-icon bg-purple"><DollarSign size={24}/></div>
                <div className="metric-data">
                  <p className="metric-label">Revenue Mock</p>
                  <h3>$142,500</h3>
                  <span className="metric-change positive">+4% MRR</span>
                </div>
              </div>
              <div className="admin-metric-card">
                <div className="metric-icon bg-orange"><Database size={24}/></div>
                <div className="metric-data">
                  <p className="metric-label">Storage</p>
                  <h3>84%</h3>
                  <span className="metric-change negative">Approaching Limit</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            loading ? (
              <div className="loading-spinner">Loading users...</div>
            ) : (
              <div className="table-container animate-fade-in">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.full_name}</td>
                        <td>@{user.username || 'N/A'}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
}
