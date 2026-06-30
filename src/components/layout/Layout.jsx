import React from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, LayoutDashboard, Users, BookOpen } from 'lucide-react';
import './Layout.css';

const navItems = {
  admin: [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Tutors', path: '/admin/tutors', icon: BookOpen },
  ],
  tutor: [
    { label: 'Dashboard', path: '/tutor', icon: LayoutDashboard },
    { label: 'Student Log', path: '/tutor/log', icon: BookOpen },
  ],
  student: [
    { label: 'My Progress', path: '/student', icon: LayoutDashboard },
  ],
  parent: [
    { label: 'Parent Portal', path: '/parent', icon: LayoutDashboard },
  ]
};

export const Layout = ({ role }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const items = navItems[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">MentorLog</div>
          <span className="role-badge">{user.role}</span>
        </div>
        <nav className="sidebar-nav">
          {items.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-header glass">
          <div className="header-title">
            <h2>Welcome back, {user.name}</h2>
          </div>
          <div className="header-profile">
            <div className="avatar">{user.name.charAt(0)}</div>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
