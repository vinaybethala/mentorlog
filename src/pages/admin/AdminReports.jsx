import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, Button, Select, Badge } from '../../components/ui';
import { Download, FileText } from 'lucide-react';
import './AdminReports.css';

const exportCSV = (data, filename) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const AdminReports = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [homework, setHomework] = useState([]);
  const [fees, setFees] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filterClass, setFilterClass] = useState('All');
  const [filterType, setFilterType] = useState('attendance');

  useEffect(() => {
    const load = async () => {
      setStudents(await api.getStudents());
      setAttendance(await api.getAttendance());
      setHomework(await api.getHomework());
      setFees(await api.getFees());
      setLogs(await api.getProgressLogs());
    };
    load();
  }, []);

  const classes = ['All', ...new Set(students.map(s => s.class).filter(Boolean))];

  const filteredStudents = filterClass === 'All' ? students : students.filter(s => s.class === filterClass);

  const getAttReport = () => filteredStudents.map(s => {
    const sAtt = attendance.filter(a => a.studentId === s.userId);
    const present = sAtt.filter(a => a.status === 'Present').length;
    const pct = sAtt.length > 0 ? Math.round((present / sAtt.length) * 100) : 100;
    return { Student: s.name, Class: s.class, Email: s.email, 'Total Sessions': sAtt.length, Present: present, Percentage: `${pct}%` };
  });

  const getHwReport = () => filteredStudents.map(s => {
    const sHw = homework.filter(h => h.studentId === s.userId);
    const completed = sHw.filter(h => h.status === 'Completed').length;
    const missing = sHw.filter(h => h.status === 'Missing').length;
    return { Student: s.name, Class: s.class, 'Total HW': sHw.length, Completed: completed, Missing: missing, 'Completion Rate': sHw.length > 0 ? `${Math.round((completed / sHw.length) * 100)}%` : 'N/A' };
  });

  const getFeeReport = () => filteredStudents.map(s => {
    const fee = fees.find(f => f.studentId === s.userId);
    return { Student: s.name, Class: s.class, 'Total Fee': fee ? `₹${fee.totalAmount}` : 'N/A', Paid: fee ? `₹${fee.paidAmount}` : 'N/A', Due: fee ? `₹${fee.totalAmount - fee.paidAmount}` : 'N/A', Status: fee?.status || 'N/A' };
  });

  const getProgressReport = () => logs.map(log => {
    const student = students.find(s => s.userId === log.studentId);
    return { Student: student?.name || log.studentId, Subject: log.subject, Topic: log.topic, Type: log.type, Remarks: log.remarks, Date: new Date(log.date).toLocaleDateString() };
  });

  const reportData = filterType === 'attendance' ? getAttReport() : filterType === 'homework' ? getHwReport() : filterType === 'fees' ? getFeeReport() : getProgressReport();
  const reportHeaders = reportData.length > 0 ? Object.keys(reportData[0]) : [];

  const reportLabels = { attendance: 'Attendance Report', homework: 'Homework Report', fees: 'Fee Report', progress: 'Progress Report' };

  return (
    <div className="admin-reports-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Export</h1>
          <p className="page-subtitle">Generate and export detailed reports for analysis.</p>
        </div>
        <Button size="lg" onClick={() => exportCSV(reportData, `${filterType}-report.csv`)}>
          <Download size={18} style={{ marginRight: 8 }} /> Export CSV
        </Button>
      </div>

      <Card>
        <CardContent style={{ paddingTop: '1.5rem' }}>
          <div className="report-filters">
            <Select label="Report Type" value={filterType} onChange={e => setFilterType(e.target.value)} options={[
              { value: 'attendance', label: 'Attendance Report' },
              { value: 'homework', label: 'Homework Report' },
              { value: 'fees', label: 'Fee Report' },
              { value: 'progress', label: 'Progress Report' },
            ]} />
            <Select label="Filter by Class" value={filterClass} onChange={e => setFilterClass(e.target.value)} options={classes.map(c => ({ value: c, label: c }))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title={reportLabels[filterType]} subtitle={`${reportData.length} records found`} />
        <div className="table-responsive">
          <table className="ui-table">
            <thead>
              <tr>
                {reportHeaders.map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => (
                <tr key={i}>
                  {reportHeaders.map(h => <td key={h}>{row[h]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          {reportData.length === 0 && <div className="empty-state">No data available. Add students and records first.</div>}
        </div>
      </Card>
    </div>
  );
};
