import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { Card, Button, Badge, Modal, Input, Select } from '../../components/ui';
import { Plus, Search, Edit2, CheckCircle, XCircle } from 'lucide-react';
import './AdminList.css';

const EMPTY_ADD_FORM = {
  name: '', age: '', dob: '', gender: '', phone: '', subjects: '',
  qualification: '', experience: '', address: '', bankName: '', bankAccount: '',
  ifsc: '', branch: '', joiningDate: '', salaryType: 'Monthly',
  email: '', password: '', confirmPassword: '', status: 'Active'
};

// Toast component
const Toast = ({ message, type, onClose }) => (
  <div className={`toast toast-${type}`}>
    <span className="toast-icon">
      {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
    </span>
    <span>{message}</span>
    <button className="toast-close" onClick={onClose}>×</button>
  </div>
);

export const AdminTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState(EMPTY_ADD_FORM);
  const [isAddSubmitting, setIsAddSubmitting] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTutors = useCallback(async () => {
    const data = await api.getTutors();
    setTutors(data);
  }, []);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  // --- Add Tutor ---
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTutor = async (e) => {
    e.preventDefault();
    setAddError('');
    if (addFormData.password !== addFormData.confirmPassword) {
      setAddError('Passwords do not match.');
      return;
    }
    setIsAddSubmitting(true);
    try {
      await api.createTutor({
        ...addFormData,
        subjects: addFormData.subjects.split(',').map(s => s.trim()).filter(s => s)
      });
      await fetchTutors();
      setIsAddModalOpen(false);
      setAddFormData(EMPTY_ADD_FORM);
      showToast('Tutor account created successfully!', 'success');
    } catch (err) {
      setAddError(err.message);
    } finally {
      setIsAddSubmitting(false);
    }
  };

  // --- Edit Tutor ---
  const openEditModal = (tutor) => {
    setEditingTutor(tutor);
    setEditFormData({
      name: tutor.name || '',
      age: tutor.age || '',
      dob: tutor.dob || '',
      gender: tutor.gender || '',
      phone: tutor.contact || tutor.phone || '',
      subjects: Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : (tutor.subjects || ''),
      qualification: tutor.qualification || '',
      experience: tutor.experience || '',
      address: tutor.address || '',
      bankName: tutor.bankName || '',
      bankAccount: tutor.bankAccount || '',
      ifsc: tutor.ifsc || '',
      branch: tutor.branch || '',
      joiningDate: tutor.joiningDate || '',
      salaryType: tutor.salaryType || 'Monthly',
      email: tutor.email || '',
      status: tutor.status || 'Active',
      password: '',
      confirmPassword: '',
    });
    setEditError('');
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditTutor = async (e) => {
    e.preventDefault();
    setEditError('');

    if (editFormData.password && editFormData.password !== editFormData.confirmPassword) {
      setEditError('Passwords do not match.');
      return;
    }

    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      setEditError('Name and Email are required.');
      return;
    }

    setIsEditSubmitting(true);
    try {
      const payload = {
        ...editFormData,
        subjects: editFormData.subjects.split(',').map(s => s.trim()).filter(s => s),
        contact: editFormData.phone, // map phone -> contact for DB field
      };
      // Only include password if it was set
      if (!payload.password || payload.password.trim() === '') {
        delete payload.password;
        delete payload.confirmPassword;
      }

      await api.updateTutor(editingTutor.userId, payload);
      await fetchTutors();
      setIsEditModalOpen(false);
      setEditingTutor(null);
      showToast('Tutor updated successfully!', 'success');
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const filteredTutors = tutors.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(t.subjects) ? t.subjects.join(', ') : (t.subjects || '')).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-list-page">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Tutors</h1>
          <p className="page-subtitle">View and manage all active tutors.</p>
        </div>
        <Button size="lg" onClick={() => { setAddError(''); setAddFormData(EMPTY_ADD_FORM); setIsAddModalOpen(true); }}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Add Tutor
        </Button>
      </div>

      <Card>
        <div className="list-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search tutors..."
              className="search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
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
              {filteredTutors.map(tutor => (
                <tr key={tutor.id}>
                  <td>
                    <div className="user-info">
                      <div className="avatar-sm">{tutor.name.charAt(0)}</div>
                      <span>{tutor.name}</span>
                    </div>
                  </td>
                  <td>{Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : tutor.subjects}</td>
                  <td>{tutor.email}</td>
                  <td>{tutor.contact || tutor.phone}</td>
                  <td>
                    <Badge variant={tutor.status === 'Active' ? 'success' : 'warning'}>
                      {tutor.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => openEditModal(tutor)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit2 size={14} /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTutors.length === 0 && (
            <div className="empty-state">
              {searchQuery ? 'No tutors match your search.' : 'No tutors found.'}
            </div>
          )}
        </div>
      </Card>

      {/* ── ADD TUTOR MODAL ── */}
      <Modal isOpen={isAddModalOpen} onClose={() => !isAddSubmitting && setIsAddModalOpen(false)} title="Create Tutor Account">
        <form onSubmit={handleAddTutor} className="complex-form">
          {addError && <div className="form-error">{addError}</div>}

          <div className="form-section">
            <h4 className="section-title">Personal Details</h4>
            <div className="form-grid">
              <Input label="Full Name" name="name" value={addFormData.name} onChange={handleAddChange} required />
              <Input label="Age" name="age" type="number" value={addFormData.age} onChange={handleAddChange} required />
              <Input label="Date of Birth" name="dob" type="date" value={addFormData.dob} onChange={handleAddChange} required />
              <Select label="Gender" name="gender" value={addFormData.gender} onChange={handleAddChange} required options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]} />
              <Input label="Phone Number" name="phone" value={addFormData.phone} onChange={handleAddChange} required />
              <Input label="Address" name="address" value={addFormData.address} onChange={handleAddChange} required />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Professional Details</h4>
            <div className="form-grid">
              <Input label="Subjects Taught (comma separated)" name="subjects" value={addFormData.subjects} onChange={handleAddChange} required />
              <Input label="Qualification" name="qualification" value={addFormData.qualification} onChange={handleAddChange} required />
              <Input label="Experience (Years)" name="experience" value={addFormData.experience} onChange={handleAddChange} required />
              <Input label="Joining Date" name="joiningDate" type="date" value={addFormData.joiningDate} onChange={handleAddChange} required />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Bank Details</h4>
            <div className="form-grid">
              <Input label="Bank Name" name="bankName" value={addFormData.bankName} onChange={handleAddChange} required />
              <Input label="Account Number" name="bankAccount" value={addFormData.bankAccount} onChange={handleAddChange} required />
              <Input label="IFSC Code" name="ifsc" value={addFormData.ifsc} onChange={handleAddChange} required />
              <Input label="Branch Name" name="branch" value={addFormData.branch} onChange={handleAddChange} required />
              <Select label="Salary Type" name="salaryType" value={addFormData.salaryType} onChange={handleAddChange} required options={[
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Hourly', label: 'Hourly' }
              ]} />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Account Credentials</h4>
            <div className="form-grid">
              <Input label="Tutor Email" name="email" type="email" value={addFormData.email} onChange={handleAddChange} required />
              <Select label="Status" name="status" value={addFormData.status} onChange={handleAddChange} required options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]} />
              <Input label="Password" name="password" type="password" value={addFormData.password} onChange={handleAddChange} autoComplete="new-password" required />
              <Input label="Confirm Password" name="confirmPassword" type="password" value={addFormData.confirmPassword} onChange={handleAddChange} autoComplete="new-password" required />
            </div>
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)} type="button" disabled={isAddSubmitting}>Cancel</Button>
            <Button type="submit" isLoading={isAddSubmitting}>Create Account</Button>
          </div>
        </form>
      </Modal>

      {/* ── EDIT TUTOR MODAL ── */}
      <Modal isOpen={isEditModalOpen} onClose={() => !isEditSubmitting && setIsEditModalOpen(false)} title={`Edit Tutor — ${editingTutor?.name || ''}`}>
        <form onSubmit={handleEditTutor} className="complex-form">
          {editError && <div className="form-error">{editError}</div>}

          <div className="form-section">
            <h4 className="section-title">Personal Details</h4>
            <div className="form-grid">
              <Input label="Full Name" name="name" value={editFormData.name || ''} onChange={handleEditChange} required />
              <Input label="Age" name="age" type="number" value={editFormData.age || ''} onChange={handleEditChange} />
              <Input label="Date of Birth" name="dob" type="date" value={editFormData.dob || ''} onChange={handleEditChange} />
              <Select label="Gender" name="gender" value={editFormData.gender || ''} onChange={handleEditChange} options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]} />
              <Input label="Phone Number" name="phone" value={editFormData.phone || ''} onChange={handleEditChange} />
              <Input label="Address" name="address" value={editFormData.address || ''} onChange={handleEditChange} />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Professional Details</h4>
            <div className="form-grid">
              <Input label="Subjects Taught (comma separated)" name="subjects" value={editFormData.subjects || ''} onChange={handleEditChange} />
              <Input label="Qualification" name="qualification" value={editFormData.qualification || ''} onChange={handleEditChange} />
              <Input label="Experience (Years)" name="experience" value={editFormData.experience || ''} onChange={handleEditChange} />
              <Input label="Joining Date" name="joiningDate" type="date" value={editFormData.joiningDate || ''} onChange={handleEditChange} />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Bank Details</h4>
            <div className="form-grid">
              <Input label="Bank Name" name="bankName" value={editFormData.bankName || ''} onChange={handleEditChange} />
              <Input label="Account Number" name="bankAccount" value={editFormData.bankAccount || ''} onChange={handleEditChange} />
              <Input label="IFSC Code" name="ifsc" value={editFormData.ifsc || ''} onChange={handleEditChange} />
              <Input label="Branch Name" name="branch" value={editFormData.branch || ''} onChange={handleEditChange} />
              <Select label="Salary Type" name="salaryType" value={editFormData.salaryType || 'Monthly'} onChange={handleEditChange} options={[
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Hourly', label: 'Hourly' }
              ]} />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Account Settings</h4>
            <div className="form-grid">
              <Input label="Login Email" name="email" type="email" value={editFormData.email || ''} onChange={handleEditChange} required />
              <Select label="Account Status" name="status" value={editFormData.status || 'Active'} onChange={handleEditChange} required options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]} />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Change Password <span className="optional-label">(optional — leave blank to keep current)</span></h4>
            <div className="form-grid">
              <Input label="New Password" name="password" type="password" value={editFormData.password || ''} onChange={handleEditChange} autoComplete="new-password" placeholder="Leave blank to keep unchanged" />
              <Input label="Confirm New Password" name="confirmPassword" type="password" value={editFormData.confirmPassword || ''} onChange={handleEditChange} autoComplete="new-password" placeholder="Leave blank to keep unchanged" />
            </div>
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)} type="button" disabled={isEditSubmitting}>Cancel</Button>
            <Button type="submit" isLoading={isEditSubmitting}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
