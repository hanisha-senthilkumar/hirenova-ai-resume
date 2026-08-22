import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { Sparkles, Briefcase, GraduationCap, MapPin, CheckCircle2, ArrowRight, X } from 'lucide-react';
import './ProfileSetupModal.css';

const ProfileSetupModal = () => {
  const { showOnboarding, completeOnboarding, profile, loadDemoProfile } = useProfile();

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || 'Alex Morgan',
    targetRole: profile?.targetRole || 'Cloud Infrastructure Engineer',
    skills: profile?.skills?.join(', ') || 'AWS, Docker, Linux, CI/CD, Git, Python, Bash',
    education: profile?.education || "Bachelor's in Computer Science",
    experienceLevel: profile?.experienceLevel || 'Mid-Level (2-4 Years)',
    preferredLocation: profile?.location || 'San Francisco, CA / Remote',
    workPreference: profile?.workPreference || 'Hybrid / Remote',
    careerInterests: profile?.careerInterests || 'Cloud Architecture, Kubernetes, Microservices'
  });

  if (!showOnboarding) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    completeOnboarding({
      ...formData,
      skills: skillsArray
    });
  };

  const handleSkipOrDemo = (type) => {
    loadDemoProfile(type);
    completeOnboarding();
  };

  return (
    <div className="onboarding-overlay animate-fade-in">
      <div className="onboarding-modal glass-card">
        <div className="onboarding-header">
          <div className="badge-pill">
            <Sparkles size={14} />
            <span>ONE-TIME CAREER SETUP</span>
          </div>
          <button
            className="btn-close-modal"
            onClick={() => completeOnboarding()}
            aria-label="Close setup"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="onboarding-title">Welcome to HireNova! 🚀</h2>
        <p className="onboarding-subtitle">
          Complete your career profile once. We'll automatically calculate ATS match scores, detect skill gaps, and recommend tailored jobs and projects.
        </p>

        {/* Quick Demo Fill Buttons */}
        <div className="demo-presets-banner">
          <span className="demo-label">Quick 1-Click Setup:</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSkipOrDemo('cloudEngineer')}
          >
            ☁️ Cloud / DevOps Preset
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSkipOrDemo('fullStackDev')}
          >
            💻 Full Stack React Preset
          </button>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="hn-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Target Job Role</label>
              <div className="input-with-icon">
                <Briefcase size={16} className="input-icon" />
                <input
                  type="text"
                  className="hn-input has-icon"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="e.g. Cloud Infrastructure Engineer"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Core Technical & Soft Skills (comma separated)</label>
            <textarea
              className="hn-input hn-textarea"
              rows={2}
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g. AWS, Docker, Kubernetes, Python, React, CI/CD"
              required
            />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Experience Level</label>
              <select
                className="hn-input hn-select"
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              >
                <option value="Entry-Level (0-2 Years)">Entry-Level (0-2 Years)</option>
                <option value="Mid-Level (2-4 Years)">Mid-Level (2-4 Years)</option>
                <option value="Senior (5+ Years)">Senior (5+ Years)</option>
                <option value="Student / New Grad">Student / New Grad</option>
              </select>
            </div>

            <div className="form-group">
              <label>Preferred Location</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon" />
                <input
                  type="text"
                  className="hn-input has-icon"
                  value={formData.preferredLocation}
                  onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                  placeholder="e.g. San Francisco, CA or Remote"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Work Type Preference</label>
              <select
                className="hn-input hn-select"
                value={formData.workPreference}
                onChange={(e) => setFormData({ ...formData, workPreference: e.target.value })}
              >
                <option value="Remote / Hybrid">Remote / Hybrid</option>
                <option value="Remote Only">Remote Only</option>
                <option value="Hybrid Only">Hybrid Only</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Education & Academic Degree</label>
            <div className="input-with-icon">
              <GraduationCap size={16} className="input-icon" />
              <input
                type="text"
                className="hn-input has-icon"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="e.g. B.S. in Computer Science"
              />
            </div>
          </div>

          <div className="onboarding-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => completeOnboarding()}
            >
              Skip for Now
            </button>
            <button type="submit" className="btn btn-primary">
              <span>Save & Launch Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupModal;
