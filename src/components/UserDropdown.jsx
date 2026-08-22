import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, LogOut, User as UserIcon, Bell, Milestone, ShieldAlert, Sparkles, KeyRound, ShieldCheck } from 'lucide-react';
import './UserDropdown.css';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut, loginAsAdmin, loginAsUser } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const username = user?.name || user?.username || 'Alex Morgan';
  const email = user?.email || 'alex.morgan@example.com';
  const role = user?.role || (isAdmin ? 'admin' : 'user');
  const initial = username.charAt(0).toUpperCase() || 'A';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    navigate('/login');
  };

  const handleSwitchRole = async () => {
    setIsOpen(false);
    if (isAdmin) {
      await loginAsUser('Alex Morgan', 'alex.morgan@example.com');
      navigate('/dashboard');
    } else {
      await loginAsAdmin();
      navigate('/admin');
    }
  };

  return (
    <div className="user-dropdown-wrapper" ref={dropdownRef}>
      <button
        className="user-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={`avatar-circle ${isAdmin ? 'avatar-admin' : ''}`}>{initial}</div>
        <div className="user-nav-labels">
          <span className="user-dropdown-name">{username}</span>
          <span className={`role-badge-nav ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
            {isAdmin ? 'ADMIN' : 'USER'}
          </span>
        </div>
        <ChevronDown size={14} className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="user-dropdown-menu animate-fade-in glass-card">
          <div className="dropdown-user-header">
            <div className="dropdown-user-row">
              <p className="dropdown-user-name">{username}</p>
              <span className={`role-badge-pill ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
                {isAdmin ? '🛡️ Administrator' : '👤 Candidate'}
              </span>
            </div>
            <p className="dropdown-user-email">{email}</p>
          </div>

          <div className="dropdown-divider" />

          {/* Quick 1-Click Role Switcher */}
          <button className="dropdown-item switch-role-item" onClick={handleSwitchRole}>
            {isAdmin ? (
              <>
                <UserIcon size={16} className="text-primary" />
                <span>Switch to Job Seeker</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} className="text-primary" />
                <span>Switch to Admin Portal</span>
              </>
            )}
          </button>

          <div className="dropdown-divider" />

          <button
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              navigate('/profile');
            }}
          >
            <UserIcon size={16} />
            <span>Career Profile</span>
          </button>

          <button
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              navigate('/roadmap');
            }}
          >
            <Milestone size={16} />
            <span>Career Roadmap</span>
          </button>

          <button
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              navigate('/notifications');
            }}
          >
            <Bell size={16} />
            <span>Notifications & Alerts</span>
          </button>

          <button
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              navigate('/admin');
            }}
          >
            <ShieldAlert size={16} />
            <span>Admin Data Manager</span>
          </button>

          <div className="dropdown-divider" />

          <button className="dropdown-item sign-out-item" onClick={handleSignOut}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
