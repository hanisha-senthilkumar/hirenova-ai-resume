import { INITIAL_JOBS } from './mockData';
import { calculateComprehensiveMatch, ALL_SKILLS } from './matchingEngine';

const STORAGE_KEY = 'hirenova_jobs_data';

// Load jobs from localStorage or fallback to INITIAL_JOBS
export const getStoredJobs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading stored jobs:', e);
  }
  return INITIAL_JOBS;
};

// Save jobs to localStorage
export const saveStoredJobs = (jobs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.error('Error saving jobs:', e);
  }
};

/**
 * Automatically rank and score all available jobs against a user's resume and profile
 */
export const getRankedRecommendedJobs = (resumeText = '', userProfile = null) => {
  const jobs = getStoredJobs();
  const skillsPool = userProfile?.skills?.join(', ') || '';
  const textToCompare = resumeText || skillsPool || 'Software Engineer Developer';

  return jobs.map((job) => {
    const jdText = `${job.title} ${job.description} Required Skills: ${job.requiredSkills.join(', ')} Preferred Skills: ${job.preferredSkills.join(', ')}`;
    const match = calculateComprehensiveMatch(textToCompare, jdText, null);

    return {
      ...job,
      matchScore: match.overallScore,
      matchGrade: match.matchGrade,
      badgeColor: match.badgeColor,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      detailedMissingSkills: match.detailedMissingSkills,
      skillMatch: match.skillMatch,
      keywordMatch: match.keywordMatch,
      experienceMatch: match.experienceMatch,
      educationMatch: match.educationMatch,
      projectRelevance: match.projectRelevance,
      suggestions: match.suggestions
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Extract structured requirements from raw JD text
 */
export const parseJobDescriptionText = (jdText) => {
  if (!jdText) return null;
  const jdLower = jdText.toLowerCase();

  const detectedSkills = [];
  ALL_SKILLS.forEach((skill) => {
    const regex = new RegExp(`\\b${skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(jdLower) && !detectedSkills.includes(skill)) {
      detectedSkills.push(skill);
    }
  });

  // Role / Title extraction heuristic
  const firstLine = jdText.split('\n')[0]?.trim() || 'Software Engineer';
  let title = firstLine.length < 50 ? firstLine : 'Software Engineer';

  return {
    title,
    requiredSkills: detectedSkills.slice(0, 6),
    preferredSkills: detectedSkills.slice(6, 10),
    technicalSkills: detectedSkills,
    softSkills: ['Problem Solving', 'Communication', 'Teamwork', 'Agile'],
    educationRequirement: jdLower.includes('master') ? "Master's degree preferred" : "Bachelor's degree in CS or equivalent",
    experienceRequirement: jdLower.match(/(\d+\+?\s*years?)/i)?.[0] || '2+ years practical experience'
  };
};

/**
 * Admin Job Operations
 */
export const addJob = (newJob) => {
  const jobs = getStoredJobs();
  const job = {
    id: `job-${Date.now()}`,
    postedDate: 'Just now',
    source: 'HireNova Market Feed',
    ...newJob
  };
  const updated = [job, ...jobs];
  saveStoredJobs(updated);
  return updated;
};

export const updateJob = (id, updatedFields) => {
  const jobs = getStoredJobs();
  const updated = jobs.map((j) => (j.id === id ? { ...j, ...updatedFields } : j));
  saveStoredJobs(updated);
  return updated;
};

export const deleteJob = (id) => {
  const jobs = getStoredJobs();
  const updated = jobs.filter((j) => j.id !== id);
  saveStoredJobs(updated);
  return updated;
};

export const resetJobs = () => {
  saveStoredJobs(INITIAL_JOBS);
  return INITIAL_JOBS;
};
