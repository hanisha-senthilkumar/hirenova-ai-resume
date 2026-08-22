import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand-section">
          <Link to="/" className="footer-brand">
            <div className="footer-icon-wrapper">
              <Sparkles size={16} />
            </div>
            <span className="footer-title">HireNova</span>
          </Link>
          <p className="footer-tagline">AI-Powered Career Intelligence</p>
          <p className="footer-message">Match Smarter. Improve Faster. Get Hired.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h4 className="footer-col-heading">Platform</h4>
            <Link to="/dashboard" className="footer-link">Dashboard</Link>
            <Link to="/job-matcher" className="footer-link">Job Matcher</Link>
          </div>

          <div className="footer-column">
            <h4 className="footer-col-heading">Account</h4>
            <Link to="/login" className="footer-link">Sign In with Puter</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HireNova. All rights reserved. Resume & Job Match Intelligence.</p>
      </div>
    </footer>
  );
};

export default Footer;
