import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, Badge } from '../../components/ui';
import { Users, BookOpen, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      const data = await api.getDashboardStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="loading">Loading dashboard...</div>;

  // Mock data for chart
  const chartData = [
    { name: 'Mon', activities: 4 },
    { name: 'Tue', activities: 3 },
    { name: 'Wed', activities: 7 },
    { name: 'Thu', activities: 5 },
    { name: 'Fri', activities: 8 },
    { name: 'Sat', activities: 2 },
    { name: 'Sun', activities: 9 },
  ];

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">Total Students</p>
              <h3 className="stat-value">{stats.totalStudents}</h3>
            </div>
            <div className="stat-icon bg-blue"><Users size={24} /></div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">Total Tutors</p>
              <h3 className="stat-value">{stats.totalTutors}</h3>
            </div>
            <div className="stat-icon bg-green"><BookOpen size={24} /></div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">Total Logs</p>
              <h3 className="stat-value">{stats.totalLogs}</h3>
            </div>
            <div className="stat-icon bg-purple"><Activity size={24} /></div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">Weekly Growth</p>
              <h3 className="stat-value">+12%</h3>
            </div>
            <div className="stat-icon bg-orange"><TrendingUp size={24} /></div>
          </CardContent>
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card className="chart-card">
          <CardHeader title="Activity Overview" subtitle="Progress logs recorded over the last 7 days" />
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                  />
                  <Line type="monotone" dataKey="activities" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="recent-activity-card">
          <CardHeader title="Recent Activity" />
          <CardContent>
            <div className="activity-list">
              {stats.recentActivity.map(log => (
                <div key={log.id} className="activity-item">
                  <div className="activity-indicator"></div>
                  <div className="activity-details">
                    <p className="activity-text">
                      <strong>New Log:</strong> {log.topic} ({log.subject})
                    </p>
                    <p className="activity-meta">
                      Student ID: {log.studentId} • {new Date(log.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="primary">{log.type}</Badge>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <p className="empty-text">No recent activity found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
