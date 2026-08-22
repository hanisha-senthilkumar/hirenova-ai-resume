import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import './UserDropdown.css';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Safe fallback username
  const username = user?.username || user?.name || 'User';
  const email = user?.email || null;
  const initial = username.charAt(0).toUpperCase() || 'U';

  // Close dropdown on outside click
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

  return (
    <div className="user-dropdown-wrapper" ref={dropdownRef}>
      <button
        className="user-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="avatar-circle">{initial}</div>
        <span className="user-dropdown-name">{username}</span>
        <ChevronDown size={14} className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="user-dropdown-menu animate-fade-in">
          <div className="dropdown-user-header">
            <p className="dropdown-user-name">{username}</p>
            {email ? (
              <p className="dropdown-user-email">{email}</p>
            ) : (
              <p className="dropdown-user-badge">Puter Account</p>
            )}
          </div>

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
