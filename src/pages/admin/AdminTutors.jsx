import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, Button, Badge, Modal, Input, Select } from '../../components/ui';
import { Plus, Search } from 'lucide-react';
import './AdminList.css';

export const AdminTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', age: '', dob: '', gender: '', phone: '', subjects: '',
    qualification: '', experience: '', address: '', bankName: '', bankAccount: '',
    ifsc: '', branch: '', joiningDate: '', salaryType: 'Monthly',
    email: '', password: '', confirmPassword: '', status: 'Active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const fetchTutors = async () => {
    const data = await api.getTutors();
    setTutors(data);
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTutor = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createTutor({
        ...formData,
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s)
      });
      await fetchTutors();
      setSuccess('Tutor account created successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          name: '', age: '', dob: '', gender: '', phone: '', subjects: '',
          qualification: '', experience: '', address: '', bankName: '', bankAccount: '',
          ifsc: '', branch: '', joiningDate: '', salaryType: 'Monthly',
          email: '', password: '', confirmPassword: '', status: 'Active'
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
          <h1 className="page-title">Manage Tutors</h1>
          <p className="page-subtitle">View and manage all active tutors.</p>
        </div>
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '8px' }}/> Add Tutor
        </Button>
      </div>

      <Card>
        <div className="list-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search tutors..." className="search-input" />
          </div>
        </div>
        <div className="table-responsive">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subjects</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map(tutor => (
                <tr key={tutor.id}>
                  <td>
                    <div className="user-info">
                      <div className="avatar-sm">{tutor.name.charAt(0)}</div>
                      <span>{tutor.name}</span>
                    </div>
                  </td>
                  <td>{tutor.subjects?.join(', ')}</td>
                  <td>{tutor.email}</td>
                  <td>{tutor.contact}</td>
                  <td>
                    <Badge variant={tutor.status === 'Active' ? 'success' : 'warning'}>
                      {tutor.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="secondary" size="md">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tutors.length === 0 && (
            <div className="empty-state">No tutors found.</div>
          )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Create Tutor Account">
        <form onSubmit={handleAddTutor} className="complex-form">
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
              <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Professional Details</h4>
            <div className="form-grid">
              <Input label="Subjects Taught (comma separated)" name="subjects" value={formData.subjects} onChange={handleChange} required />
              <Input label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} required />
              <Input label="Experience (Years)" name="experience" value={formData.experience} onChange={handleChange} required />
              <Input label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Bank Details</h4>
            <div className="form-grid">
              <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} required />
              <Input label="Account Number" name="bankAccount" value={formData.bankAccount} onChange={handleChange} required />
              <Input label="IFSC Code" name="ifsc" value={formData.ifsc} onChange={handleChange} required />
              <Input label="Branch Name" name="branch" value={formData.branch} onChange={handleChange} required />
              <Select label="Salary Type" name="salaryType" value={formData.salaryType} onChange={handleChange} required options={[
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Hourly', label: 'Hourly' }
              ]} />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Account Credentials</h4>
            <div className="form-grid">
              <Input label="Tutor Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
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
