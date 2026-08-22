import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useProfile();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notif-bell-wrapper" ref={dropdownRef}>
      <button
        className="notif-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notif-dropdown-menu glass-card animate-fade-in">
          <div className="notif-dropdown-header">
            <div className="dropdown-title-group">
              <h4>Notifications</h4>
              {unreadCount > 0 && <span className="unread-tag">{unreadCount} New</span>}
            </div>
            {unreadCount > 0 && (
              <button
                className="btn-mark-all"
                onClick={markAllNotificationsRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-list-scroll">
            {notifications.length === 0 ? (
              <div className="empty-notifs">
                <Sparkles size={24} className="text-muted" />
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${!n.read ? 'unread' : ''}`}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.jobId) navigate('/recommended-jobs');
                    else if (n.actionLink) navigate(n.actionLink);
                    setIsOpen(false);
                  }}
                >
                  <div className="notif-item-header">
                    <span className={`notif-type-tag ${n.type}`}>{n.type?.replace('_', ' ')}</span>
                    <span className="notif-time">{n.timestamp}</span>
                  </div>
                  <h5 className="notif-title">{n.title}</h5>
                  <p className="notif-msg">{n.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="notif-dropdown-footer">
            <button
              className="btn-view-all-notifs"
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
            >
              <span>Notification Center & Settings</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
