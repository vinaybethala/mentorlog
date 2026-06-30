import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, Button, Badge, Modal, Input } from '../../components/ui';
import { Plus, Search } from 'lucide-react';
import './AdminList.css';

export const AdminTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', contact: '', subjects: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    setIsSubmitting(true);
    try {
      await api.createTutor({
        ...formData,
        subjects: formData.subjects.split(',').map(s => s.trim())
      });
      await fetchTutors();
      setIsModalOpen(false);
      setFormData({ name: '', email: '', contact: '', subjects: '' });
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Tutor">
        <form onSubmit={handleAddTutor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <Input label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} required />
          <Input label="Subjects (comma separated)" name="subjects" value={formData.subjects} onChange={handleChange} required placeholder="Math, Science, English" />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Add Tutor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
