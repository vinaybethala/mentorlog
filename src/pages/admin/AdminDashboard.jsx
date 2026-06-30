import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, Badge } from '../../components/ui';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { Users, BookOpen, TrendingUp, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import './AdminDashboard.css';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const load = async () => {
      const s = await api.getAdvancedStats();
      setStats(s);
      setRecentActivity(s.recentActivity || []);

      // Get at-risk students with full names
      const allStudents = await api.getStudents();
      const allAtt = await api.getAttendance();
      const allHw = await api.getHomework();
      const allLogs = await api.getProgressLogs();
      const at = allStudents.filter(student => {
        const sAtt = allAtt.filter(a => a.studentId === student.userId);
        const sPresent = sAtt.filter(a => a.status === 'Present').length;
        const attPct = sAtt.length > 0 ? (sPresent / sAtt.length) * 100 : 100;
        const missingHw = allHw.filter(h => h.studentId === student.userId && h.status === 'Missing').length;
        const noRecentLog = !allLogs.find(l => l.studentId === student.userId
          && new Date(l.date) > new Date(Date.now() - 14 * 86400000));
        return attPct < 70 || missingHw > 2 || noRecentLog;
      });
      setAtRiskStudents(at);
    };
    load();
  }, []);

  if (!stats) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ color: 'var(--color-text-secondary)' }}>Loading analytics...</div>
    </div>
  );

  const kpis = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-blue' },
    { label: 'Total Tutors', value: stats.totalTutors, icon: BookOpen, color: 'bg-purple' },
    { label: 'Attendance Rate', value: `${stats.attRate}%`, icon: CheckCircle, color: 'bg-green' },
    { label: 'Homework Rate', value: `${stats.hwRate}%`, icon: TrendingUp, color: 'bg-orange' },
    { label: 'Fee Collected', value: `₹${(stats.totalPaid || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-teal' },
    { label: 'At-Risk Students', value: stats.atRiskCount, icon: AlertTriangle, color: stats.atRiskCount > 0 ? 'bg-red' : 'bg-green' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Academy Dashboard</h1>
          <p className="page-subtitle">Complete overview of your academy's performance and operations.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <Card key={i} className="stat-card">
            <CardContent className="stat-content">
              <div>
                <p className="stat-label">{k.label}</p>
                <h3 className="stat-value">{k.value}</h3>
              </div>
              <div className={`stat-icon ${k.color}`}>
                <k.icon size={24} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Attendance Trend Chart */}
        <Card>
          <CardHeader title="Attendance Trend" subtitle="Monthly attendance rate (%)" />
          <CardContent>
            {stats.attendanceTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats.attendanceTrend}>
                  <defs>
                    <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip formatter={(val) => [`${val}%`, 'Attendance']} />
                  <Area type="monotone" dataKey="rate" stroke="#6366f1" fill="url(#attGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">No attendance data yet. Tutors need to mark attendance first.</div>
            )}
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card>
          <CardHeader title="Subject Distribution" subtitle="Students per subject" />
          <CardContent>
            {stats.subjectDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={stats.subjectDistribution} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {stats.subjectDistribution.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">No subjects data yet.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="dashboard-grid">
        {/* At-Risk Students */}
        <Card className={atRiskStudents.length > 0 ? 'risk-card' : ''}>
          <CardHeader
            title={`⚠️ At-Risk Students (${atRiskStudents.length})`}
            subtitle="Low attendance, missing homework, or no recent updates"
          />
          <CardContent>
            {atRiskStudents.length === 0 ? (
              <div className="empty-state success-state">✅ No at-risk students — great work!</div>
            ) : (
              <div className="risk-list">
                {atRiskStudents.map(s => (
                  <div key={s.id} className="risk-item">
                    <div className="user-info">
                      <div className="avatar-sm risk">{s.name.charAt(0)}</div>
                      <div>
                        <p className="risk-name">{s.name}</p>
                        <p className="risk-class">{s.class}</p>
                      </div>
                    </div>
                    <Badge variant="danger">At Risk</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader title="Recent Activity" subtitle="Latest session updates" />
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="empty-state">No recent activity.</div>
            ) : (
              <div className="activity-feed">
                {recentActivity.map((log, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-dot"></div>
                    <div className="activity-content">
                      <p className="activity-text">
                        <strong>{log.subject}</strong> — {log.topic}
                      </p>
                      <p className="activity-time">{new Date(log.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fee Summary Bar */}
      <Card>
        <CardHeader title="Fee Collection Summary" subtitle="Overall fee progress" />
        <CardContent>
          <div className="fee-summary">
            <div className="fee-bar-wrapper">
              <div className="fee-bar-track">
                <div
                  className="fee-bar-fill"
                  style={{ width: `${stats.totalDue > 0 ? Math.round((stats.totalPaid / (stats.totalPaid + stats.totalDue)) * 100) : 100}%` }}
                ></div>
              </div>
              <div className="fee-bar-labels">
                <span>₹{(stats.totalPaid || 0).toLocaleString()} collected</span>
                <span>₹{(stats.totalDue || 0).toLocaleString()} outstanding</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
