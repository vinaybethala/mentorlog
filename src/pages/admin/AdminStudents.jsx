import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, Button, Badge } from '../../components/ui';
import { Plus, Search } from 'lucide-react';
import './AdminList.css';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  
  useEffect(() => {
    const fetchStudents = async () => {
      const data = await api.getStudents();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  return (
    <div className="admin-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Students</h1>
          <p className="page-subtitle">View and manage all enrolled students in the academy.</p>
        </div>
        <Button size="lg"><Plus size={18} style={{ marginRight: '8px' }}/> Add Student</Button>
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
    </div>
  );
};
