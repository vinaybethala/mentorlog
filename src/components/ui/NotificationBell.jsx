import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Bell } from 'lucide-react';
import './NotificationBell.css';

export const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const all = await api.getNotifications(user.id);
      setNotifications(all);
    };
    fetchNotifications();

    // Close dropdown on outside click
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user.id]);

  const unread = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const typeIcon = (type) => {
    const icons = { homework: '📚', progress: '📈', attendance: '📋', fee: '💰' };
    return icons[type] || '🔔';
  };

  return (
    <div className="notif-bell-wrapper" ref={ref}>
      <button className="notif-bell-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Notifications">
        <Bell size={20} />
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h4>Notifications</h4>
            <span>{unread} unread</span>
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <p className="notif-empty">No notifications yet.</p>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notif-item ${!notif.isRead ? 'notif-unread' : ''}`}
                  onClick={() => handleMarkRead(notif.id)}
                >
                  <span className="notif-icon">{typeIcon(notif.type)}</span>
                  <div className="notif-content">
                    <p className="notif-msg">{notif.message}</p>
                    <p className="notif-time">{new Date(notif.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
