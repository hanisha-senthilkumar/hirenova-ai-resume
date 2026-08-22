import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './MobileMenu.css';

const MobileMenu = ({ navLinks, isActive, onClose }) => {
  const { user, isSignedIn, signOut } = useAuth();
  const navigate = useNavigate();

  const username = user?.username || user?.name || 'User';
  const initial = username.charAt(0).toUpperCase() || 'U';

  const handleUploadClick = () => {
    onClose();
    navigate('/job-matcher');
  };

  const handleSignOut = async () => {
    onClose();
    await signOut();
    navigate('/login');
  };

  const handleSignIn = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="mobile-menu-overlay animate-fade-in">
      <div className="mobile-menu-container">
        <nav className="mobile-nav-list">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-item ${isActive(link.path) ? 'active' : ''}`}
              onClick={onClose}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="mobile-menu-actions">
          {isSignedIn ? (
            <>
              <div className="mobile-profile-card">
                <div className="avatar-circle">{initial}</div>
                <div className="profile-info">
                  <span className="profile-title">{username}</span>
                  <span className="profile-subtitle">Puter Session Active</span>
                </div>
              </div>

              <button
                className="btn btn-primary w-full"
                onClick={handleUploadClick}
              >
                <Upload size={18} />
                <span>Upload Resume</span>
              </button>

              <button
                className="btn btn-secondary w-full mobile-signout-btn"
                onClick={handleSignOut}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary w-full"
              onClick={handleSignIn}
            >
              <LogIn size={18} />
              <span>Sign In with Puter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
