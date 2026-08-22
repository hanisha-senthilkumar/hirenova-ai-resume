import React from 'react';
import PageHeader from '../components/PageHeader';
import { User, Mail, ShieldAlert, CheckCircle } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="profile-page animate-fade-in">
      <PageHeader
        badgeText="USER ACCOUNT"
        title="Profile"
        description="Manage your HireNova user profile and settings."
      />

      <div className="hn-card profile-card">
        <div className="profile-header-group">
          <div className="profile-avatar">H</div>
          <div className="profile-title-meta">
            <h2 className="profile-user-name">Guest User</h2>
            <span className="profile-type-badge">Static Guest Session</span>
          </div>
        </div>

        <div className="profile-details-list">
          <div className="profile-detail-row">
            <div className="detail-label">
              <Mail size={18} />
              <span>Email Address</span>
            </div>
            <div className="detail-value text-muted">Not connected</div>
          </div>

          <div className="profile-detail-row">
            <div className="detail-label">
              <ShieldAlert size={18} />
              <span>Authentication Status</span>
            </div>
            <div className="detail-value status-tag">No Auth Required (Phase 1A)</div>
          </div>
        </div>

        <div className="profile-notice-box">
          <p>
            <strong>Note:</strong> Authentication logic, account synchronization, and Puter.js integration will be connected in future development phases.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
