import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, Button, Badge, Modal, Input } from '../../components/ui';
import { Plus, Search } from 'lucide-react';
import './AdminList.css';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', class: '', email: '', parentContact: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fetchStudents = async () => {
    const data = await api.getStudents();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createStudent({
        ...formData,
        subjects: ['Math', 'Science'], // Default subjects for demo
      });
      await fetchStudents();
      setIsModalOpen(false);
      setFormData({ name: '', class: '', email: '', parentContact: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Students</h1>
          <p className="page-subtitle">View and manage all enrolled students in the academy.</p>
        </div>
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '8px' }}/> Add Student
        </Button>
      </div>

      <Card>
        <div className="list-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search students..." className="search-input" />
          </div>
        </div>
        <div className="table-responsive">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Email</th>
                <th>Parent Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>
                    <div className="user-info">
                      <div className="avatar-sm">{student.name.charAt(0)}</div>
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td>{student.class}</td>
                  <td>{student.email}</td>
                  <td>{student.parentContact}</td>
                  <td>
                    <Badge variant={student.status === 'Active' ? 'success' : 'warning'}>
                      {student.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="secondary" size="md">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="empty-state">No students found. Add one to get started.</div>
          )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student">
        <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <Input label="Class / Grade" name="class" value={formData.class} onChange={handleChange} required />
          <Input label="Parent Contact" name="parentContact" value={formData.parentContact} onChange={handleChange} required />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Add Student</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
