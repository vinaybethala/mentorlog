import React from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, LayoutDashboard, Users, BookOpen, DollarSign, BarChart2, Menu, X } from 'lucide-react';
import { NotificationBell } from '../ui/NotificationBell';
import './Layout.css';

const navItems = {
  admin: [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Tutors', path: '/admin/tutors', icon: BookOpen },
    { label: 'Fee Management', path: '/admin/fees', icon: DollarSign },
    { label: 'Reports', path: '/admin/reports', icon: BarChart2 },
  ],
  tutor: [
    { label: 'Dashboard', path: '/tutor', icon: LayoutDashboard },
    { label: 'Session Log', path: '/tutor/log', icon: BookOpen },
  ],
  student: [
    { label: 'My Dashboard', path: '/student', icon: LayoutDashboard },
  ],
  parent: [
    { label: 'Parent Portal', path: '/parent', icon: LayoutDashboard },
  ]
};

export const Layout = ({ role }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
      <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
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
              onClick={() => setMobileMenuOpen(false)}
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
          <div className="header-left-mobile">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="header-title">
              <h2>Welcome, {user.name}</h2>
            </div>
          </div>
          <div className="header-profile">
            <NotificationBell />
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
