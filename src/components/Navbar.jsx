import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Upload, Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserDropdown from './UserDropdown';
import MobileMenu from './MobileMenu';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ONLY AI-5 Scope Navigation Items
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Job Matcher', path: '/job-matcher' },
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
            <span className="brand-subtext">AI CAREER INTELLIGENCE</span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Only Dashboard & Job Matcher) */}
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
