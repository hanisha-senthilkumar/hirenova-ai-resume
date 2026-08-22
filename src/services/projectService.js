import { INITIAL_PROJECTS } from './mockData';

const STORAGE_KEY = 'hirenova_projects_data';

export const getStoredProjects = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading stored projects:', e);
  }
  return INITIAL_PROJECTS;
};

export const saveStoredProjects = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects:', e);
  }
};

/**
 * Get project recommendations matching user's target role or missing skills
 */
export const getRecommendedProjectsForUser = (targetRole = '', missingSkills = []) => {
  const projects = getStoredProjects();
  const roleLower = (targetRole || '').toLowerCase();
  const missingLower = (missingSkills || []).map((s) => s.toLowerCase());

  return projects.map((project) => {
    let relevanceScore = 0;

    // Check target role alignment
    const matchesRole = project.targetRoles.some((r) =>
      r.toLowerCase().includes(roleLower) || roleLower.includes(r.toLowerCase())
    );
    if (matchesRole) relevanceScore += 40;

    // Check bridged missing skills
    const bridgedSkills = project.skillsGained.filter((s) =>
      missingLower.some((ms) => s.toLowerCase().includes(ms) || ms.includes(s.toLowerCase()))
    );
    relevanceScore += bridgedSkills.length * 20;

    return {
      ...project,
      relevanceScore: Math.min(100, relevanceScore),
      bridgedSkills
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
};

/**
 * Admin Project Operations
 */
export const addProject = (newProj) => {
  const projects = getStoredProjects();
  const project = {
    id: `proj-${Date.now()}`,
    ...newProj
  };
  const updated = [project, ...projects];
  saveStoredProjects(updated);
  return updated;
};

export const updateProject = (id, updatedFields) => {
  const projects = getStoredProjects();
  const updated = projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
  saveStoredProjects(updated);
  return updated;
};

export const deleteProject = (id) => {
  const projects = getStoredProjects();
  const updated = projects.filter((p) => p.id !== id);
  saveStoredProjects(updated);
  return updated;
};

export const resetProjects = () => {
  saveStoredProjects(INITIAL_PROJECTS);
  return INITIAL_PROJECTS;
};
