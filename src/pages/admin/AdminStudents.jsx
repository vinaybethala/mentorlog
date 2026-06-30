import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { Card, Button, Badge, Modal, Input, Select } from '../../components/ui';
import { Plus, Search, Edit2, CheckCircle, XCircle } from 'lucide-react';
import './AdminList.css';

const EMPTY_ADD_FORM = {
  name: '', age: '', dob: '', gender: '', class: '', subjects: '',
  parentName: '', parentContact: '', parentEmail: '', address: '',
  admissionDate: '', email: '', password: '', confirmPassword: '', status: 'Active'
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

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState(EMPTY_ADD_FORM);
  const [isAddSubmitting, setIsAddSubmitting] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStudents = useCallback(async () => {
    const data = await api.getStudents();
    setStudents(data);
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // --- Add Student ---
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setAddError('');
    if (addFormData.password !== addFormData.confirmPassword) {
      setAddError('Passwords do not match.');
      return;
    }
    setIsAddSubmitting(true);
    try {
      await api.createStudent({
        ...addFormData,
        subjects: addFormData.subjects.split(',').map(s => s.trim()).filter(s => s)
      });
      await fetchStudents();
      setIsAddModalOpen(false);
      setAddFormData(EMPTY_ADD_FORM);
      showToast('Student account created successfully!', 'success');
    } catch (err) {
      setAddError(err.message);
    } finally {
      setIsAddSubmitting(false);
    }
  };

  // --- Edit Student ---
  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditFormData({
      name: student.name || '',
      age: student.age || '',
      dob: student.dob || '',
      gender: student.gender || '',
      class: student.class || '',
      subjects: Array.isArray(student.subjects) ? student.subjects.join(', ') : (student.subjects || ''),
      parentName: student.parentName || '',
      parentContact: student.parentContact || '',
      parentEmail: student.parentEmail || '',
      address: student.address || '',
      admissionDate: student.admissionDate || '',
      email: student.email || '',
      status: student.status || 'Active',
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

  const handleEditStudent = async (e) => {
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
        subjects: editFormData.subjects.split(',').map(s => s.trim()).filter(s => s)
      };
      // Only include password if it was set
      if (!payload.password || payload.password.trim() === '') {
        delete payload.password;
        delete payload.confirmPassword;
      }

      await api.updateStudent(editingStudent.userId, payload);
      await fetchStudents();
      setIsEditModalOpen(false);
      setEditingStudent(null);
      showToast('Student updated successfully!', 'success');
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.class || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-list-page">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Students</h1>
          <p className="page-subtitle">View and manage all enrolled students in the academy.</p>
        </div>
        <Button size="lg" onClick={() => { setAddError(''); setAddFormData(EMPTY_ADD_FORM); setIsAddModalOpen(true); }}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Add Student
        </Button>
      </div>

      <Card>
        <div className="list-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search students..."
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
                <th>Class</th>
                <th>Email</th>
                <th>Parent Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
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
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => openEditModal(student)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit2 size={14} /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="empty-state">
              {searchQuery ? 'No students match your search.' : 'No students found. Add one to get started.'}
            </div>
          )}
        </div>
      </Card>

      {/* ── ADD STUDENT MODAL ── */}
      <Modal isOpen={isAddModalOpen} onClose={() => !isAddSubmitting && setIsAddModalOpen(false)} title="Create Student Account">
        <form onSubmit={handleAddStudent} className="complex-form">
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
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Academic Details</h4>
            <div className="form-grid">
              <Input label="Class / Grade" name="class" value={addFormData.class} onChange={handleAddChange} required />
              <Input label="Subjects (comma separated)" name="subjects" value={addFormData.subjects} onChange={handleAddChange} placeholder="Math, Science" required />
              <Input label="Admission Date" name="admissionDate" type="date" value={addFormData.admissionDate} onChange={handleAddChange} required />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Parent / Guardian Details</h4>
            <div className="form-grid">
              <Input label="Parent Name" name="parentName" value={addFormData.parentName} onChange={handleAddChange} required />
              <Input label="Parent Phone" name="parentContact" value={addFormData.parentContact} onChange={handleAddChange} required />
              <Input label="Parent Email" name="parentEmail" type="email" value={addFormData.parentEmail} onChange={handleAddChange} required />
              <Input label="Address" name="address" value={addFormData.address} onChange={handleAddChange} required />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Account Credentials</h4>
            <div className="form-grid">
              <Input label="Student Email" name="email" type="email" value={addFormData.email} onChange={handleAddChange} required />
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

      {/* ── EDIT STUDENT MODAL ── */}
      <Modal isOpen={isEditModalOpen} onClose={() => !isEditSubmitting && setIsEditModalOpen(false)} title={`Edit Student — ${editingStudent?.name || ''}`}>
        <form onSubmit={handleEditStudent} className="complex-form">
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
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Academic Details</h4>
            <div className="form-grid">
              <Input label="Class / Grade" name="class" value={editFormData.class || ''} onChange={handleEditChange} required />
              <Input label="Subjects (comma separated)" name="subjects" value={editFormData.subjects || ''} onChange={handleEditChange} placeholder="Math, Science" />
              <Input label="Admission Date" name="admissionDate" type="date" value={editFormData.admissionDate || ''} onChange={handleEditChange} />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Parent / Guardian Details</h4>
            <div className="form-grid">
              <Input label="Parent Name" name="parentName" value={editFormData.parentName || ''} onChange={handleEditChange} />
              <Input label="Parent Phone" name="parentContact" value={editFormData.parentContact || ''} onChange={handleEditChange} />
              <Input label="Parent Email" name="parentEmail" type="email" value={editFormData.parentEmail || ''} onChange={handleEditChange} />
              <Input label="Address" name="address" value={editFormData.address || ''} onChange={handleEditChange} />
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
