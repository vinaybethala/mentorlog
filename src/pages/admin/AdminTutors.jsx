import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, Button, Badge } from '../../components/ui';
import { Plus, Search } from 'lucide-react';
import './AdminList.css';

export const AdminTutors = () => {
  const [tutors, setTutors] = useState([]);
  
  useEffect(() => {
    const fetchTutors = async () => {
      const data = await api.getTutors();
      setTutors(data);
    };
    fetchTutors();
  }, []);

  return (
    <div className="admin-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Tutors</h1>
          <p className="page-subtitle">View and manage all active tutors.</p>
        </div>
        <Button size="lg"><Plus size={18} style={{ marginRight: '8px' }}/> Add Tutor</Button>
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
                  <td>{tutor.subjects.join(', ')}</td>
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
    </div>
  );
};
