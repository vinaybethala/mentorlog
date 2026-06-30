import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, Badge } from '../../components/ui';
import { CheckCircle, Clock, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './Student.css';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const studentData = await api.getStudentById(user.id);
      setStudentInfo(studentData);
      const studentLogs = await api.getProgressLogs({ studentId: user.id });
      setLogs(studentLogs);
    };
    fetchData();
  }, [user.id]);

  if (!studentInfo) return <div className="loading">Loading student profile...</div>;

  return (
    <div className="student-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Progress</h1>
          <p className="page-subtitle">Welcome back, {studentInfo.name}. Track your learning journey.</p>
        </div>
      </div>

      <div className="student-grid">
        <div className="timeline-section">
          <Card className="timeline-card">
            <CardHeader title="Learning Timeline" subtitle="Recent updates from your tutors" />
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
          <Card className="profile-card mb-6">
            <CardHeader title="Profile Summary" />
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
                <div className="info-row">
                  <span className="info-label">Parent Contact</span>
                  <span className="info-value">{studentInfo.parentContact}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="subjects-card">
            <CardHeader title="Enrolled Subjects" />
            <CardContent>
              <div className="subject-list">
                {studentInfo.subjects?.map(sub => (
                  <div key={sub} className="subject-item">
                    <BookOpen size={16} className="text-primary" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
