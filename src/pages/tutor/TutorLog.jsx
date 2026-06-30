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
    topic: '',
    type: 'homework done',
    remarks: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await api.getStudents();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    try {
      await api.createProgressLog({
        ...formData,
        tutorId: user.id
      });
      setSuccess(true);
      setFormData({ ...formData, topic: '', remarks: '' });
      setTimeout(() => setSuccess(false), 3000);
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
          <h1 className="page-title">Log Student Progress</h1>
          <p className="page-subtitle">Record teaching sessions and student updates.</p>
        </div>
      </div>

      <Card className="log-form-card">
        <CardHeader title="Session Details" />
        <CardContent>
          {success && <div className="success-banner">Progress log submitted successfully!</div>}
          <form onSubmit={handleSubmit} className="log-form">
            <div className="form-row">
              <Select 
                label="Student" 
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                options={students.map(s => ({ value: s.id, label: s.name }))}
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
            <div className="form-row">
              <Select 
                label="Update Type" 
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                options={[
                  { value: 'unit revision done', label: 'Unit Revision Done' },
                  { value: 'homework done', label: 'Homework Done' },
                  { value: 'topic completed', label: 'Topic Completed' },
                  { value: 'tests/quiz feedback', label: 'Tests/Quiz Feedback' }
                ]}
              />
              <Input 
                label="Topic / Chapter" 
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                placeholder="e.g. Algebra Chapter 2"
              />
            </div>
            <div className="form-row full-width">
              <div className="ui-input-group">
                <label className="ui-label">Remarks</label>
                <textarea 
                  className="ui-input" 
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter detailed remarks about the student's performance..."
                  required
                ></textarea>
              </div>
            </div>
            <Button type="submit" size="lg" isLoading={isLoading}>
              Submit Progress Log
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
