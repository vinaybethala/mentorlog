import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, Badge, ScheduleWidget } from '../../components/ui';
import { CheckCircle, Clock, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import './Student.css';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [homework, setHomework] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const p = await api.getStudentById(user.id);
      setProfile(p);
      const l = await api.getProgressLogs({ studentId: user.id });
      setLogs(l);
      const a = await api.getAttendance({ studentId: user.id });
      setAttendance(a);
      const h = await api.getHomework({ studentId: user.id });
      setHomework(h);
    };
    fetchData();
  }, [user.id]);

  const present = attendance.filter(a => a.status === 'Present').length;
  const attPct = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 100;
  const pendingHw = homework.filter(h => h.status !== 'Completed').length;

  return (
    <div className="student-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user.name}! Here's your learning overview.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <Card className={`stat-card ${attPct < 70 ? 'stat-danger' : ''}`}>
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">Attendance Rate</p>
              <h3 className="stat-value">{attPct}%</h3>
              {attPct < 70 && <p className="stat-warning">⚠️ Below threshold</p>}
            </div>
            <div className={`stat-icon ${attPct < 70 ? 'bg-red' : 'bg-blue'}`}>
              <CheckCircle size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">Pending Homework</p>
              <h3 className="stat-value">{pendingHw}</h3>
            </div>
            <div className={`stat-icon ${pendingHw > 2 ? 'bg-red' : 'bg-orange'}`}>
              <BookOpen size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">Tutor Updates</p>
              <h3 className="stat-value">{logs.length}</h3>
            </div>
            <div className="stat-icon bg-green">
              <TrendingUp size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="student-grid">
        <div className="main-col">
          {/* Homework Tracker */}
          <Card className="mb-6">
            <CardHeader title="Homework & Assignments" subtitle="Track your pending tasks" />
            <CardContent>
              {homework.length === 0 ? (
                <div className="empty-state">No homework assigned yet.</div>
              ) : (
                <div className="hw-tracker">
                  {homework.map(hw => (
                    <div key={hw.id} className="hw-tracker-item">
                      <div className="hw-tracker-left">
                        <p className="hw-tracker-title">{hw.topic}</p>
                        <p className="hw-tracker-meta">{hw.subject} • Due: {hw.dueDate}</p>
                      </div>
                      <Badge variant={
                        hw.status === 'Completed' ? 'success' :
                        hw.status === 'Missing' ? 'danger' : 'warning'
                      }>{hw.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Timeline */}
          <Card>
            <CardHeader title="Progress Timeline" subtitle="Tutor updates & remarks" />
            <CardContent>
              {logs.length === 0 ? (
                <div className="empty-state">No progress logged yet.</div>
              ) : (
                <div className="timeline">
                  {logs.map((log, i) => (
                    <div key={log.id} className="timeline-item">
                      <div className="timeline-marker">
                        <div className="timeline-dot"></div>
                        {i !== logs.length - 1 && <div className="timeline-line"></div>}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>{log.topic}</h4>
                          <span className="time-ago">
                            <Clock size={12} />
                            {new Date(log.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="timeline-meta">
                          <Badge variant="primary">{log.subject}</Badge>
                          <Badge variant="success">{log.type}</Badge>
                        </div>
                        {log.remarks && <p className="timeline-remarks">"{log.remarks}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="side-col">
          {/* Profile */}
          {profile && (
            <Card className="mb-6">
              <CardHeader title="My Profile" />
              <CardContent>
                <div className="student-profile-card">
                  <div className="profile-avatar">{user.name.charAt(0)}</div>
                  <div className="profile-info">
                    <div className="info-row"><span className="info-label">Name</span><span className="info-value">{profile.name}</span></div>
                    <div className="info-row"><span className="info-label">Class</span><span className="info-value">{profile.class}</span></div>
                    <div className="info-row"><span className="info-label">Subjects</span><span className="info-value">{(profile.subjects || []).join(', ')}</span></div>
                    <div className="info-row"><span className="info-label">Tutor</span><span className="info-value">Assigned</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attendance Summary */}
          <Card className="mb-6">
            <CardHeader title="Attendance Summary" />
            <CardContent>
              <div className="att-bar-wrapper">
                <div className="att-bar-track">
                  <div className="att-bar-fill" style={{ width: `${attPct}%`, backgroundColor: attPct < 70 ? 'var(--color-danger)' : 'var(--color-success)' }}></div>
                </div>
                <p className="att-bar-label">{attPct}% attendance ({present}/{attendance.length} sessions)</p>
              </div>
              <div className="att-breakdown">
                {['Present', 'Absent', 'Late', 'Leave'].map(s => (
                  <div key={s} className="att-stat">
                    <span className="att-count">{attendance.filter(a => a.status === s).length}</span>
                    <span className="att-label">{s}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <ScheduleWidget userRole="student" userClass={profile?.class} />
        </div>
      </div>
    </div>
  );
};
