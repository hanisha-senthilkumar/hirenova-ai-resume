import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Upload,
  Menu,
  X,
  LogIn,
  LayoutDashboard,
  FileSearch,
  FileCheck,
  Briefcase,
  FolderGit2,
  Milestone,
  User,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import UserDropdown from './UserDropdown';
import MobileMenu from './MobileMenu';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/job-matcher', icon: FileSearch },
    { name: 'Build Resume', path: '/build-resume', icon: FileCheck },
    { name: 'Recommended Jobs', path: '/recommended-jobs', icon: Briefcase },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Career Roadmap', path: '/roadmap', icon: Milestone },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Admin', path: '/admin', icon: ShieldAlert }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Sparkles className="brand-icon" size={18} />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">HireNova</span>
            <span className="brand-subtext">AI CAREER PLATFORM</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Notification Bell */}
          <NotificationBell />

          {isSignedIn ? (
            <>
              <UserDropdown />
              <button
                className="btn btn-primary btn-upload"
                onClick={() => navigate('/job-matcher')}
              >
                <Upload size={16} />
                <span>Upload Resume</span>
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary btn-signin-nav"
              onClick={() => navigate('/login')}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <MobileMenu
          navLinks={navLinks}
          isActive={isActive}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
