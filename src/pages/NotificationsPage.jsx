import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Bookmark,
  Settings,
  RefreshCw,
  Sparkles,
  Sliders,
  Check
} from 'lucide-react';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    notificationSettings,
    updateNotificationSettings,
    triggerLiveJobAlertsCheck
  } = useProfile();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // all | job_alert | skill_alert | resume_alert | reminder | settings
  const [isChecking, setIsChecking] = useState(false);

  const handleSimulateCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      triggerLiveJobAlertsCheck();
      setIsChecking(false);
    }, 600);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  return (
    <div className="notifications-page animate-fade-in">
      <PageHeader
        badgeText="JOB & CAREER NOTIFICATIONS"
        title="Personalized Alerts & Notifications"
        description="Stay updated with new job matches, trending market skill alerts, resume score improvements, and application deadlines."
      />

      {/* Top Controls Bar */}
      <div className="hn-card notif-controls-card">
        <div className="controls-left">
          <button
            className={`notif-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>All Alerts ({notifications.length})</span>
          </button>
          <button
            className={`notif-tab-btn ${activeTab === 'job_alert' ? 'active' : ''}`}
            onClick={() => setActiveTab('job_alert')}
          >
            <span>Job Alerts</span>
          </button>
          <button
            className={`notif-tab-btn ${activeTab === 'skill_alert' ? 'active' : ''}`}
            onClick={() => setActiveTab('skill_alert')}
          >
            <span>Skill Alerts</span>
          </button>
          <button
            className={`notif-tab-btn ${activeTab === 'resume_alert' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume_alert')}
          >
            <span>Resume Alerts</span>
          </button>
          <button
            className={`notif-tab-btn ${activeTab === 'reminder' ? 'active' : ''}`}
            onClick={() => setActiveTab('reminder')}
          >
            <span>Reminders</span>
          </button>
          <button
            className={`notif-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={14} />
            <span>Alert Settings</span>
          </button>
        </div>

        <div className="controls-right">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleSimulateCheck}
            disabled={isChecking}
          >
            <RefreshCw size={14} className={isChecking ? 'spin-icon' : ''} />
            <span>{isChecking ? 'Scanning Market...' : 'Scan For New Opportunities'}</span>
          </button>

          {unreadCount > 0 && (
            <button className="btn btn-outline btn-sm" onClick={markAllNotificationsRead}>
              <Check size={14} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'settings' ? (
        /* Settings Panel */
        <div className="hn-card settings-panel-card animate-fade-in">
          <div className="settings-header">
            <Sliders size={20} className="text-primary" />
            <h3>Notification & Alert Preferences</h3>
          </div>
          <p className="settings-desc">
            Configure how often you receive notifications and customize your match thresholds.
          </p>

          <div className="settings-form">
            <div className="setting-toggle-row">
              <div>
                <strong>Enable Personalized Career Notifications</strong>
                <p>Receive job alerts, skill gap insights, and reminder digests.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.enabled}
                onChange={(e) => updateNotificationSettings({ ...notificationSettings, enabled: e.target.checked })}
                className="setting-checkbox"
              />
            </div>

            <div className="setting-toggle-row">
              <div>
                <strong>High Match Job Alerts</strong>
                <p>Notify when a job matching above your threshold is published.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.jobAlerts}
                onChange={(e) => updateNotificationSettings({ ...notificationSettings, jobAlerts: e.target.checked })}
                className="setting-checkbox"
              />
            </div>

            <div className="setting-toggle-row">
              <div>
                <strong>Market Skill Trend Alerts</strong>
                <p>Notify when emerging technical requirements appear in your field.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.skillAlerts}
                onChange={(e) => updateNotificationSettings({ ...notificationSettings, skillAlerts: e.target.checked })}
                className="setting-checkbox"
              />
            </div>

            <div className="setting-toggle-row">
              <div>
                <strong>Saved Application Reminders</strong>
                <p>Remind you to submit applications for bookmarked jobs.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.applicationReminders}
                onChange={(e) => updateNotificationSettings({ ...notificationSettings, applicationReminders: e.target.checked })}
                className="setting-checkbox"
              />
            </div>

            <div className="form-grid-2" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Minimum Match Score Threshold (%)</label>
                <select
                  className="hn-input hn-select"
                  value={notificationSettings.minMatchScore}
                  onChange={(e) => updateNotificationSettings({ ...notificationSettings, minMatchScore: Number(e.target.value) })}
                >
                  <option value={60}>60% (Broad Range)</option>
                  <option value={70}>70% (Recommended)</option>
                  <option value={80}>80% (High Match Only)</option>
                  <option value={90}>90% (Strict Alignment)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notification Frequency</label>
                <select
                  className="hn-input hn-select"
                  value={notificationSettings.frequency}
                  onChange={(e) => updateNotificationSettings({ ...notificationSettings, frequency: e.target.value })}
                >
                  <option value="instant">Instant Real-Time Alerts</option>
                  <option value="daily">Daily Career Digest</option>
                  <option value="weekly">Weekly Opportunity Summary</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Notifications List */
        <div className="notif-cards-list">
          {filteredNotifications.length === 0 ? (
            <div className="hn-card empty-results-card">
              <Sparkles size={36} className="text-muted" />
              <h3>No notifications in this category</h3>
              <p>Click "Scan For New Opportunities" to search for fresh market opportunities.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`hn-card notif-card-row ${!notif.read ? 'unread-card' : ''}`}
                onClick={() => markNotificationRead(notif.id)}
              >
                <div className="notif-row-left">
                  <div className={`notif-icon-bubble ${notif.type}`}>
                    {notif.type === 'job_alert' && <Bell size={18} />}
                    {notif.type === 'skill_alert' && <AlertTriangle size={18} />}
                    {notif.type === 'resume_alert' && <FileCheck size={18} />}
                    {notif.type === 'reminder' && <Bookmark size={18} />}
                  </div>

                  <div className="notif-row-body">
                    <div className="notif-meta-line">
                      <span className={`notif-type-tag ${notif.type}`}>
                        {notif.type?.replace('_', ' ')}
                      </span>
                      <span className="notif-date">{notif.timestamp}</span>
                      {!notif.read && <span className="unread-dot">New</span>}
                    </div>

                    <h4 className="notif-row-title">{notif.title}</h4>
                    <p className="notif-row-message">{notif.message}</p>
                  </div>
                </div>

                <div className="notif-row-action">
                  {notif.jobId && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(notif.id);
                        navigate('/recommended-jobs');
                      }}
                    >
                      View Job
                    </button>
                  )}
                  {notif.actionLink && !notif.jobId && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(notif.id);
                        navigate(notif.actionLink);
                      }}
                    >
                      Explore
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
