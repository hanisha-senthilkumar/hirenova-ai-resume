const NOTIFICATIONS_STORAGE_KEY = 'hirenova_notifications_data';
const SETTINGS_STORAGE_KEY = 'hirenova_notification_settings';

export const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: true,
  jobAlerts: true,
  skillAlerts: true,
  resumeAlerts: true,
  applicationReminders: true,
  minMatchScore: 70,
  frequency: 'daily', // instant | daily | weekly
  preferredLocations: ['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX']
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'job_alert',
    title: 'New High-Match Job Opportunity!',
    message: 'Cloud Infrastructure Engineer at Nimbus Scale Systems matches your profile with 88% ATS alignment.',
    timestamp: '10 minutes ago',
    read: false,
    jobId: 'job-1',
    matchScore: 88,
    missingSkills: ['Kubernetes']
  },
  {
    id: 'notif-2',
    type: 'skill_alert',
    title: 'Trending Market Skill Alert',
    message: '78% of active Cloud & DevOps job postings in your region require Terraform. Consider completing the Cloud-Native File Storage project to bridge this gap.',
    timestamp: '2 hours ago',
    read: false,
    skill: 'Terraform',
    actionLink: '/projects'
  },
  {
    id: 'notif-3',
    type: 'resume_alert',
    title: 'ATS Resume Score Improvement',
    message: 'Your resume has 3 high-priority improvements identified (Quantifiable Metrics & Targeted Summary). Boost your ATS score from 78% to 92%.',
    timestamp: 'Yesterday',
    read: true,
    actionLink: '/job-matcher'
  },
  {
    id: 'notif-4',
    type: 'reminder',
    title: 'Application Reminder: NovaStack Tech',
    message: 'You saved "Full Stack React & Node Developer" 3 days ago. Application closes soon!',
    timestamp: '2 days ago',
    read: true,
    jobId: 'job-2'
  }
];

export const getStoredNotifications = () => {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading notifications:', e);
  }
  return INITIAL_NOTIFICATIONS;
};

export const saveStoredNotifications = (notifs) => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error('Error saving notifications:', e);
  }
};

export const getNotificationSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (data) return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    console.error('Error reading notification settings:', e);
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
};

export const saveNotificationSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving notification settings:', e);
  }
};

/**
 * Generate fresh personalized notifications based on latest user profile and matching jobs
 */
export const checkAndGenerateNotifications = (rankedJobs = [], userProfile = null) => {
  const currentNotifs = getStoredNotifications();
  const settings = getNotificationSettings();

  if (!settings.enabled) return currentNotifs;

  const newNotifs = [];

  // 1. High match job alert
  const topJob = rankedJobs.find((j) => (j.matchScore || 0) >= (settings.minMatchScore || 70));
  if (topJob && !currentNotifs.some((n) => n.jobId === topJob.id)) {
    newNotifs.push({
      id: `notif-job-${Date.now()}`,
      type: 'job_alert',
      title: `New High-Match Job: ${topJob.title}`,
      message: `${topJob.company} matches your profile with a strong ${topJob.matchScore}% ATS score.`,
      timestamp: 'Just now',
      read: false,
      jobId: topJob.id,
      matchScore: topJob.matchScore,
      missingSkills: topJob.missingSkills?.slice(0, 2) || []
    });
  }

  // 2. Skill gap alert
  if (topJob && topJob.missingSkills && topJob.missingSkills.length > 0) {
    const missingSkill = topJob.missingSkills[0];
    newNotifs.push({
      id: `notif-skill-${Date.now()}`,
      type: 'skill_alert',
      title: `Skill Gap Identified: ${missingSkill}`,
      message: `Your target role "${topJob.title}" requires ${missingSkill}. Build a bridging project to strengthen your candidacy.`,
      timestamp: 'Just now',
      read: false,
      skill: missingSkill,
      actionLink: '/projects'
    });
  }

  if (newNotifs.length > 0) {
    const merged = [...newNotifs, ...currentNotifs];
    saveStoredNotifications(merged);
    return merged;
  }

  return currentNotifs;
};
