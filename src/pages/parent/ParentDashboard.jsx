import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, Badge } from '../../components/ui';
import { CheckCircle, Clock, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './Parent.css';

export const ParentDashboard = () => {
  const { user } = useAuth();
  const [parentInfo, setParentInfo] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [logs, setLogs] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [homework, setHomework] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Since Parent can have multiple students, we simplify by showing the first one for the demo
      const pInfo = await api.getParentByUserId(user.id);
      setParentInfo(pInfo);
      
      if (pInfo && pInfo.studentIds.length > 0) {
        const studentId = pInfo.studentIds[0];
        const sInfo = await api.getStudentById(studentId);
        setStudentInfo(sInfo);

        const sLogs = await api.getProgressLogs({ studentId });
        setLogs(sLogs);

        const sAtt = await api.getAttendance({ studentId });
        setAttendance(sAtt);

        const sHw = await api.getHomework({ studentId });
        setHomework(sHw);
      }
    };
    fetchData();
  }, [user.id]);

  if (!parentInfo) return <div className="loading">Loading parent portal...</div>;
  if (!studentInfo) return <div className="loading">No assigned students found.</div>;

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const attPercentage = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 100;

  return (
    <div className="parent-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Parent Portal</h1>
          <p className="page-subtitle">Welcome, {parentInfo.name}. Here is the overview for {studentInfo.name}.</p>
        </div>
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">Attendance</p>
              <h3 className="stat-value">{attPercentage}%</h3>
            </div>
            <div className="stat-icon bg-blue"><CheckCircle size={24} /></div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">Pending Homework</p>
              <h3 className="stat-value">{homework.filter(h => h.status !== 'Completed').length}</h3>
            </div>
            <div className="stat-icon bg-orange"><BookOpen size={24} /></div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div>
              <p className="stat-label">Recent Updates</p>
              <h3 className="stat-value">{logs.length}</h3>
            </div>
            <div className="stat-icon bg-green"><TrendingUp size={24} /></div>
          </CardContent>
        </Card>
      </div>

      <div className="parent-grid">
        <div className="timeline-section">
          <Card className="timeline-card">
            <CardHeader title="Learning Timeline" subtitle="Recent updates from tutors" />
            <CardContent>
              {logs.length === 0 ? (
                <div className="empty-state">No progress logs recorded yet.</div>
              ) : (
                <div className="timeline">
                  {logs.map((log, index) => (
                    <div key={log.id} className="timeline-item">
                      <div className="timeline-marker">
                        <CheckCircle size={20} className="marker-icon" />
                        {index !== logs.length - 1 && <div className="timeline-line"></div>}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>{log.topic}</h4>
                          <span className="time-ago">
                            <Clock size={12} />
                            {formatDistanceToNow(new Date(log.date), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="timeline-meta">
                          <Badge variant="primary">{log.subject}</Badge>
                          <Badge variant="success">{log.type}</Badge>
                        </div>
                        <p className="timeline-remarks">{log.remarks}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="sidebar-section">
          <Card className="mb-6">
            <CardHeader title="Student Profile" />
            <CardContent>
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Name</span>
                  <span className="info-value">{studentInfo.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Class</span>
                  <span className="info-value">{studentInfo.class}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Homework Status" />
            <CardContent>
              <div className="homework-list">
                {homework.length === 0 ? (
                  <p className="empty-text">No homework assigned.</p>
                ) : (
                  homework.map(hw => (
                    <div key={hw.id} className="homework-item">
                      <div className="hw-details">
                        <p className="hw-title">{hw.topic}</p>
                        <p className="hw-meta">{hw.subject} • Due {hw.dueDate}</p>
                      </div>
                      <Badge variant={hw.status === 'Completed' ? 'success' : 'warning'}>
                        {hw.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
