import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Save,
  Trash2,
  Download,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const { profile, updateProfile, loadDemoProfile, clearAllUserData, structuredResume } = useProfile();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || 'Alex Morgan',
    email: profile?.email || 'alex.morgan@example.com',
    phone: profile?.phone || '+1 (555) 234-5678',
    location: profile?.location || 'San Francisco, CA',
    targetRole: profile?.targetRole || 'Cloud Infrastructure Engineer',
    experienceLevel: profile?.experienceLevel || 'Mid-Level (2-4 Years)',
    workPreference: profile?.workPreference || 'Hybrid / Remote',
    skills: profile?.skills?.join(', ') || 'AWS, Docker, Linux, CI/CD, Git, Python, Bash',
    education: profile?.education || "Bachelor's in Computer Science",
    careerInterests: profile?.careerInterests || 'Cloud Architecture, Kubernetes, SRE',
    bio: profile?.bio || 'Passionate engineer building scalable infrastructure and modern web applications.'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateProfile({
      ...formData,
      skills: skillsArray
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownloadData = () => {
    const fullData = {
      profile,
      structuredResume,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hirenova_career_profile_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to delete and reset your career profile data? This action cannot be undone.')) {
      clearAllUserData();
      alert('All local profile data has been cleared.');
    }
  };

  return (
    <div className="profile-page animate-fade-in">
      <PageHeader
        badgeText="USER PROFILE & CAREER PREFERENCES"
        title="Career Profile & Preferences"
        description="Manage your persistent career information, preferred job roles, skills database, and privacy data controls."
      />

      {/* Demo Switcher Quick Banner */}
      <div className="hn-card demo-switcher-card">
        <div className="switcher-text">
          <Sparkles size={18} className="text-primary" />
          <span>Switch Sample Career Profiles for Instant Testing:</span>
        </div>
        <div className="switcher-btns">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => loadDemoProfile('cloudEngineer')}
          >
            ☁️ Load Cloud / DevOps Profile
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => loadDemoProfile('fullStackDev')}
          >
            💻 Load Full Stack Profile
          </button>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* Main Profile Form */}
        <div className="hn-card profile-form-card">
          <div className="form-header-row">
            <h3>Career Profile Information</h3>
            {savedSuccess && (
              <span className="save-badge animate-fade-in">
                <CheckCircle2 size={14} />
                <span>Changes Saved!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="profile-edit-form">
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
                <input
                  type="text"
                  className="hn-input"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="hn-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="hn-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

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
                <label>Work Type Preference</label>
                <select
                  className="hn-input hn-select"
                  value={formData.workPreference}
                  onChange={(e) => setFormData({ ...formData, workPreference: e.target.value })}
                >
                  <option value="Hybrid / Remote">Hybrid / Remote</option>
                  <option value="Remote Only">Remote Only</option>
                  <option value="Hybrid Only">Hybrid Only</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Location & Relocation Preferences</label>
              <input
                type="text"
                className="hn-input"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. San Francisco, CA or Remote"
              />
            </div>

            <div className="form-group">
              <label>Core Skills (comma separated)</label>
              <textarea
                className="hn-input hn-textarea"
                rows={3}
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g. AWS, Docker, Kubernetes, React, Python, Git"
              />
            </div>

            <div className="form-group">
              <label>Education & Academic Credentials</label>
              <input
                type="text"
                className="hn-input"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="e.g. B.S. in Computer Science"
              />
            </div>

            <div className="form-group">
              <label>Professional Bio & Summary</label>
              <textarea
                className="hn-input hn-textarea"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="form-actions-bar">
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>Save Profile Preferences</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar: Privacy & Security */}
        <div className="profile-side-col">
          {/* Privacy Box */}
          <div className="hn-card privacy-card">
            <div className="side-sec-header">
              <ShieldCheck size={20} className="text-emerald" />
              <h4>Privacy & Data Security</h4>
            </div>
            <p className="privacy-text">
              Your resume and career data are stored locally in private application storage. We do not sell or expose your resumes publicly.
            </p>

            <div className="privacy-actions">
              <button className="btn btn-secondary btn-sm w-full" onClick={handleDownloadData}>
                <Download size={14} />
                <span>Export Profile Data (JSON)</span>
              </button>

              <button className="btn btn-outline btn-sm w-full danger-btn" onClick={handleResetData}>
                <Trash2 size={14} />
                <span>Delete Profile & Reset Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
