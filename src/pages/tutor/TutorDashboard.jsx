import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, Button, ScheduleWidget } from '../../components/ui';
import { useNavigate } from 'react-router-dom';
import { Users, FileText } from 'lucide-react';
import './Tutor.css';

export const TutorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="tutor-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tutor Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here is your teaching overview.</p>
        </div>
        <Button size="lg" onClick={() => navigate('/tutor/log')}>
          <FileText size={18} style={{ marginRight: '8px' }} /> Log New Session
        </Button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <ScheduleWidget userRole="tutor" userId={user.id} />
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">My Students</p>
              <h3 className="stat-value">12</h3>
            </div>
            <div className="stat-icon bg-blue"><Users size={24} /></div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">Sessions Logged</p>
              <h3 className="stat-value">48</h3>
            </div>
            <div className="stat-icon bg-green"><FileText size={24} /></div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="My Subjects" subtitle="Subjects you are currently teaching" />
        <CardContent>
          <div className="subject-tags">
            {user.subjects?.map(sub => (
              <span key={sub} className="subject-tag">{sub}</span>
            ))}
            {!user.subjects?.length && <p>No subjects assigned.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
