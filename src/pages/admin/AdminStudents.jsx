import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, Button, Badge, Modal, Input, Select } from '../../components/ui';
import { Plus, Search } from 'lucide-react';
import './AdminList.css';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', age: '', dob: '', gender: '', class: '', subjects: '',
    parentName: '', parentContact: '', parentEmail: '', address: '',
    admissionDate: '', email: '', password: '', confirmPassword: '', status: 'Active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
    setError('');
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createStudent({
        ...formData,
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s)
      });
      await fetchStudents();
      setSuccess('Student account created successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          name: '', age: '', dob: '', gender: '', class: '', subjects: '',
          parentName: '', parentContact: '', parentEmail: '', address: '',
          admissionDate: '', email: '', password: '', confirmPassword: '', status: 'Active'
        });
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message);
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

      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Create Student Account">
        <form onSubmit={handleAddStudent} className="complex-form">
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          
          <div className="form-section">
            <h4 className="section-title">Personal Details</h4>
            <div className="form-grid">
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
              <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
              <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
              <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} required options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]} />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Academic Details</h4>
            <div className="form-grid">
              <Input label="Class / Grade" name="class" value={formData.class} onChange={handleChange} required />
              <Input label="Subjects (comma separated)" name="subjects" value={formData.subjects} onChange={handleChange} placeholder="Math, Science" required />
              <Input label="Admission Date" name="admissionDate" type="date" value={formData.admissionDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Parent / Guardian Details</h4>
            <div className="form-grid">
              <Input label="Parent Name" name="parentName" value={formData.parentName} onChange={handleChange} required />
              <Input label="Parent Phone" name="parentContact" value={formData.parentContact} onChange={handleChange} required />
              <Input label="Parent Email" name="parentEmail" type="email" value={formData.parentEmail} onChange={handleChange} required />
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Account Credentials</h4>
            <div className="form-grid">
              <Input label="Student Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <Select label="Status" name="status" value={formData.status} onChange={handleChange} required options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]} />
              <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button" disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Create Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
