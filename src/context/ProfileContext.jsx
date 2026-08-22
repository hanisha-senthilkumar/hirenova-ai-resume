import React, { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_RESUMES } from '../services/mockData';
import { getRankedRecommendedJobs } from '../services/jobService';
import {
  getStoredNotifications,
  saveStoredNotifications,
  getNotificationSettings,
  saveNotificationSettings,
  checkAndGenerateNotifications
} from '../services/notificationService';

const ProfileContext = createContext(null);

const PROFILE_STORAGE_KEY = 'hirenova_user_profile';
const RESUME_STORAGE_KEY = 'hirenova_structured_resume';
const SAVED_JOBS_KEY = 'hirenova_saved_jobs';
const ROADMAP_KEY = 'hirenova_roadmap_progress';
const ONBOARDING_KEY = 'hirenova_onboarding_completed';

export const ProfileProvider = ({ children }) => {
  // 1. Career Profile State
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading profile:', e);
    }
    return {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      targetRole: 'Cloud Infrastructure Engineer',
      experienceLevel: 'Mid-Level (3 Years)',
      workPreference: 'Hybrid / Remote',
      skills: ['AWS', 'Docker', 'Linux', 'CI/CD', 'Git', 'Python', 'Bash', 'REST API', 'MySQL'],
      education: 'B.S. in Computer Science, California State University',
      careerInterests: 'Cloud Infrastructure, Kubernetes, SRE & Platform Engineering',
      bio: 'Cloud and DevOps enthusiast focused on scalable cloud systems and automation pipelines.'
    };
  });

  // 2. Structured Resume State (for ATS Builder & Matcher)
  const [structuredResume, setStructuredResume] = useState(() => {
    try {
      const saved = localStorage.getItem(RESUME_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading resume:', e);
    }
    return SAMPLE_RESUMES.cloudEngineer;
  });

  // 3. Saved Jobs Bookmarks
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem(SAVED_JOBS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved jobs:', e);
    }
    return ['job-1', 'job-2'];
  });

  // 4. Career Roadmap Progress Checklist
  const [roadmapProgress, setRoadmapProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading roadmap progress:', e);
    }
    return {
      step1: true, // Resume Profile Setup
      step2: true, // Skill Gap Analysis
      step3: false, // Learn Kubernetes & Terraform
      step4: false, // Build Cloud Storage Project
      step5: false, // ATS Resume Update
      step6: false  // Job Applications
    };
  });

  // 5. Notifications & Settings State
  const [notifications, setNotifications] = useState(getStoredNotifications);
  const [notificationSettings, setSettingsState] = useState(getNotificationSettings);

  // 6. Onboarding Wizard Visibility
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) !== 'true';
    } catch (e) {
      return false;
    }
  });

  // Persist Profile
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  // Persist Resume
  useEffect(() => {
    try {
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(structuredResume));
    } catch (e) {}
  }, [structuredResume]);

  // Persist Saved Jobs
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobIds));
    } catch (e) {}
  }, [savedJobIds]);

  // Persist Roadmap
  useEffect(() => {
    try {
      localStorage.setItem(ROADMAP_KEY, JSON.stringify(roadmapProgress));
    } catch (e) {}
  }, [roadmapProgress]);

  // Toggle Bookmark
  const toggleSaveJob = (jobId) => {
    setSavedJobIds((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  // Update Profile
  const updateProfile = (fields) => {
    setProfile((prev) => ({ ...prev, ...fields }));
  };

  // Update Structured Resume
  const updateStructuredResume = (updatedResume) => {
    setStructuredResume(updatedResume);
    // Also sync top-level profile skills
    if (updatedResume.skills && updatedResume.skills.length > 0) {
      setProfile((prev) => ({
        ...prev,
        skills: Array.from(new Set([...prev.skills, ...updatedResume.skills]))
      }));
    }
  };

  // Update Roadmap Step
  const toggleRoadmapStep = (stepKey) => {
    setRoadmapProgress((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  // Mark Notification as read
  const markNotificationRead = (notifId) => {
    const updated = notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  // Update Notification Settings
  const updateNotificationSettings = (newSettings) => {
    setSettingsState(newSettings);
    saveNotificationSettings(newSettings);
  };

  // Complete Onboarding
  const completeOnboarding = (profileData) => {
    if (profileData) {
      updateProfile(profileData);
    }
    setShowOnboarding(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {}
  };

  // Load Preset Demo Profile (e.g. Cloud Engineer or Full Stack Dev)
  const loadDemoProfile = (type = 'cloudEngineer') => {
    const sample = SAMPLE_RESUMES[type] || SAMPLE_RESUMES.cloudEngineer;
    setStructuredResume(sample);
    setProfile({
      fullName: sample.name,
      email: sample.email,
      phone: sample.phone,
      location: sample.location,
      targetRole: sample.title,
      experienceLevel: 'Mid-Level (3 Years)',
      workPreference: 'Remote / Hybrid',
      skills: sample.skills,
      education: sample.education[0]?.degree || '',
      careerInterests: 'Cloud Systems, Full Stack Web Architecture, DevOps',
      bio: sample.summary
    });
  };

  // Privacy: Delete Profile & Clear All Local Data
  const clearAllUserData = () => {
    localStorage.clear();
    setProfile({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      targetRole: '',
      experienceLevel: 'Entry-Level',
      workPreference: 'Remote',
      skills: [],
      education: '',
      careerInterests: '',
      bio: ''
    });
    setStructuredResume({
      name: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: '',
      skills: [],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      languages: [],
      achievements: []
    });
    setSavedJobIds([]);
    setNotifications([]);
    setShowOnboarding(true);
  };

  // Trigger simulated live job check
  const triggerLiveJobAlertsCheck = () => {
    const ranked = getRankedRecommendedJobs(structuredResume?.summary || '', profile);
    const updated = checkAndGenerateNotifications(ranked, profile);
    setNotifications(updated);
    return updated;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        structuredResume,
        updateStructuredResume,
        savedJobIds,
        toggleSaveJob,
        roadmapProgress,
        toggleRoadmapStep,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        notificationSettings,
        updateNotificationSettings,
        showOnboarding,
        setShowOnboarding,
        completeOnboarding,
        loadDemoProfile,
        clearAllUserData,
        triggerLiveJobAlertsCheck
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export default ProfileContext;
