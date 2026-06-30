import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, Button, Input, Select } from '../../components/ui';
import './Tutor.css';

export const TutorLog = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    attendance: 'Present',
    type: 'topic completed',
    topic: '',
    remarks: '',
    assignHomework: false,
    hwTopic: '',
    hwDueDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await api.getStudents();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess('');
    const today = new Date().toISOString().split('T')[0];

    try {
      // 1. Mark Attendance
      await api.createAttendance({
        studentId: formData.studentId,
        tutorId: user.id,
        subject: formData.subject,
        date: today,
        status: formData.attendance
      });

      // 2. Log Progress
      await api.createProgressLog({
        studentId: formData.studentId,
        tutorId: user.id,
        subject: formData.subject,
        type: formData.type,
        topic: formData.topic,
        remarks: formData.remarks
      });

      // 3. Assign Homework (optional)
      if (formData.assignHomework && formData.hwTopic) {
        await api.createHomework({
          studentId: formData.studentId,
          tutorId: user.id,
          subject: formData.subject,
          topic: formData.hwTopic,
          status: 'Assigned',
          dueDate: formData.hwDueDate || today
        });
      }

      setSuccess('Session details, attendance, and homework recorded successfully!');
      
      // Reset form but keep student/subject
      setFormData(prev => ({ 
        ...prev, 
        topic: '', remarks: '', assignHomework: false, hwTopic: '', hwDueDate: '', attendance: 'Present'
      }));

      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tutor-log-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Smarter Session Workflow</h1>
          <p className="page-subtitle">Record attendance, update progress, and assign homework in one go.</p>
        </div>
      </div>

      <Card className="log-form-card">
        <CardContent style={{ paddingTop: '2rem' }}>
          {success && <div className="success-banner">{success}</div>}
          <form onSubmit={handleSubmit} className="complex-form">
            
            <div className="form-section">
              <h4 className="section-title">1. Class Selection</h4>
              <div className="form-grid">
                <Select 
                  label="Student" 
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  options={students.map(s => ({ value: s.userId, label: s.name }))}
                />
                <Select 
                  label="Subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  options={(user.subjects || []).map(s => ({ value: s, label: s }))}
                />
              </div>
            </div>

            <div className="form-section">
              <h4 className="section-title">2. Attendance</h4>
              <div className="form-grid">
                <Select 
                  label="Status" 
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  required
                  options={[
                    { value: 'Present', label: 'Present' },
                    { value: 'Absent', label: 'Absent' },
                    { value: 'Late', label: 'Late' },
                    { value: 'Leave', label: 'Leave' }
                  ]}
                />
              </div>
            </div>

            <div className="form-section">
              <h4 className="section-title">3. Teaching Progress</h4>
              <div className="form-grid">
                <Select 
                  label="Update Type" 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  options={[
                    { value: 'unit revision done', label: 'Unit Revision Done' },
                    { value: 'homework checked', label: 'Homework Checked' },
                    { value: 'topic completed', label: 'Topic Completed' },
                    { value: 'tests/quiz feedback', label: 'Tests/Quiz Feedback' }
                  ]}
                />
                <Input 
                  label="Topic / Chapter Covered" 
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Algebra Chapter 2"
                />
              </div>
              <div className="ui-input-group mt-4">
                <label className="ui-label">Remarks</label>
                <textarea 
                  className="ui-input" 
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter detailed remarks about the student's performance..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-section">
              <h4 className="section-title">4. Homework (Optional)</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 500 }}>
                <input 
                  type="checkbox" 
                  name="assignHomework" 
                  checked={formData.assignHomework} 
                  onChange={handleChange} 
                  style={{ width: '18px', height: '18px' }}
                />
                Assign Homework
              </label>

              {formData.assignHomework && (
                <div className="form-grid">
                  <Input 
                    label="Homework Topic" 
                    name="hwTopic"
                    value={formData.hwTopic}
                    onChange={handleChange}
                    required={formData.assignHomework}
                    placeholder="e.g. Solve exercises 1-15"
                  />
                  <Input 
                    label="Due Date" 
                    name="hwDueDate"
                    type="date"
                    value={formData.hwDueDate}
                    onChange={handleChange}
                    required={formData.assignHomework}
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                Submit All Session Data
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
