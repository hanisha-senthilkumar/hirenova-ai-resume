import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';
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
          <p className="footer-tagline">AI-Powered Career Intelligence Platform</p>
          <p className="footer-message">Analyze Resumes. Bridge Skill Gaps. Accelerate Careers.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h4 className="footer-col-heading">AI Tools</h4>
            <Link to="/job-matcher" className="footer-link">Resume & JD Analyzer</Link>
            <Link to="/build-resume" className="footer-link">ATS Resume Builder</Link>
            <Link to="/recommended-jobs" className="footer-link">Recommended Jobs</Link>
          </div>

          <div className="footer-column">
            <h4 className="footer-col-heading">Career Growth</h4>
            <Link to="/projects" className="footer-link">Role-Based Projects</Link>
            <Link to="/roadmap" className="footer-link">Career Roadmap</Link>
            <Link to="/notifications" className="footer-link">Job & Skill Alerts</Link>
          </div>

          <div className="footer-column">
            <h4 className="footer-col-heading">Account & Admin</h4>
            <Link to="/profile" className="footer-link">Career Profile</Link>
            <Link to="/admin" className="footer-link">Admin Data Panel</Link>
            <Link to="/login" className="footer-link">Sign In / Sign Up</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HireNova. Intelligent ATS Compatibility & Career Acceleration.</p>
      </div>
    </footer>
  );
};

export default Footer;
