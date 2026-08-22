import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import {
  getStoredJobs,
  addJob,
  deleteJob,
  resetJobs
} from '../services/jobService';
import {
  getStoredProjects,
  addProject,
  deleteProject,
  resetProjects
} from '../services/projectService';
import { SKILL_TAXONOMY } from '../services/mockData';
import {
  ShieldAlert,
  Briefcase,
  FolderGit2,
  Database,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Users,
  Activity
} from 'lucide-react';
import './AdminPage.css';

const AdminPage = () => {
  const [jobs, setJobs] = useState(getStoredJobs);
  const [projects, setProjects] = useState(getStoredProjects);
  const [activeTab, setActiveTab] = useState('jobs'); // jobs | projects | taxonomy | analytics

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: 'Remote',
    workType: 'Remote',
    salary: '$120,000 - $150,000',
    experienceLevel: 'Mid-Level',
    requiredSkills: '',
    preferredSkills: '',
    description: ''
  });

  // New Project Form State
  const [newProj, setNewProj] = useState({
    title: '',
    targetRoles: 'Cloud Infrastructure Engineer',
    difficulty: 'Intermediate',
    technologies: '',
    skillsGained: '',
    shortDescription: '',
    relevanceReason: '',
    architectureOutline: 'Client → API → Database',
    stepGuide: ['1. Setup repo and config.', '2. Build core feature.', '3. Deploy.']
  });

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company) return;

    const formattedJob = {
      ...newJob,
      requiredSkills: newJob.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      preferredSkills: newJob.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean)
    };

    const updated = addJob(formattedJob);
    setJobs(updated);
    setNewJob({
      title: '',
      company: '',
      location: 'Remote',
      workType: 'Remote',
      salary: '$120,000 - $150,000',
      experienceLevel: 'Mid-Level',
      requiredSkills: '',
      preferredSkills: '',
      description: ''
    });
  };

  const handleDeleteJob = (id) => {
    const updated = deleteJob(id);
    setJobs(updated);
  };

  const handleResetJobs = () => {
    if (window.confirm('Reset job postings to default catalog?')) {
      const reset = resetJobs();
      setJobs(reset);
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProj.title) return;

    const formattedProj = {
      ...newProj,
      targetRoles: [newProj.targetRoles],
      technologies: newProj.technologies.split(',').map((s) => s.trim()).filter(Boolean),
      skillsGained: newProj.skillsGained.split(',').map((s) => s.trim()).filter(Boolean)
    };

    const updated = addProject(formattedProj);
    setProjects(updated);
    setNewProj({
      title: '',
      targetRoles: 'Cloud Infrastructure Engineer',
      difficulty: 'Intermediate',
      technologies: '',
      skillsGained: '',
      shortDescription: '',
      relevanceReason: '',
      architectureOutline: 'Client → API → Database',
      stepGuide: ['1. Setup repo and config.', '2. Build core feature.', '3. Deploy.']
    });
  };

  const handleDeleteProject = (id) => {
    const updated = deleteProject(id);
    setProjects(updated);
  };

  const handleResetProjects = () => {
    if (window.confirm('Reset project catalog to defaults?')) {
      const reset = resetProjects();
      setProjects(reset);
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      <PageHeader
        badgeText="ADMINISTRATION & DATA MANAGEMENT"
        title="Admin Data Management Panel"
        description="Manage the live job postings directory, role-based project recommendations catalog, and skill taxonomy definitions."
      />

      {/* Stats Cards Row */}
      <div className="grid-responsive-3 admin-stats-row">
        <div className="hn-card admin-stat-card">
          <Briefcase size={24} className="text-primary" />
          <div className="stat-info">
            <span className="stat-val">{jobs.length}</span>
            <span className="stat-title">Active Market Jobs</span>
          </div>
        </div>

        <div className="hn-card admin-stat-card">
          <FolderGit2 size={24} className="text-primary" />
          <div className="stat-info">
            <span className="stat-val">{projects.length}</span>
            <span className="stat-title">Bridging Projects</span>
          </div>
        </div>

        <div className="hn-card admin-stat-card">
          <Database size={24} className="text-primary" />
          <div className="stat-info">
            <span className="stat-val">{Object.keys(SKILL_TAXONOMY).length}</span>
            <span className="stat-title">Skill Domains</span>
          </div>
        </div>
      </div>

      {/* Admin Tab Controller */}
      <div className="hn-card admin-tabs-card">
        <button
          className={`admin-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={16} />
          <span>Job Postings Manager ({jobs.length})</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <FolderGit2 size={16} />
          <span>Project Catalog ({projects.length})</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'taxonomy' ? 'active' : ''}`}
          onClick={() => setActiveTab('taxonomy')}
        >
          <Database size={16} />
          <span>Skill Taxonomy</span>
        </button>
      </div>

      {/* TAB 1: JOBS MANAGER */}
      {activeTab === 'jobs' && (
        <div className="admin-content-grid animate-fade-in">
          {/* Add Job Form */}
          <div className="hn-card">
            <h3 className="admin-sec-title">Add New Market Job Opening</h3>
            <form onSubmit={handleAddJob} className="admin-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="e.g. Senior DevOps Architect"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Hiring Company</label>
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="e.g. Apex Scale Tech"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="e.g. San Francisco, CA / Remote"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Work Type</label>
                  <select
                    className="hn-input hn-select"
                    value={newJob.workType}
                    onChange={(e) => setNewJob({ ...newJob, workType: e.target.value })}
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Required Skills (comma separated)</label>
                <input
                  type="text"
                  className="hn-input"
                  placeholder="e.g. AWS, Docker, Kubernetes, Terraform"
                  value={newJob.requiredSkills}
                  onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Job Overview / Description</label>
                <textarea
                  className="hn-input hn-textarea"
                  rows={3}
                  placeholder="Job responsibilities and qualifications..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                <Plus size={16} />
                <span>Publish Job Opening</span>
              </button>
            </form>
          </div>

          {/* Current Jobs List */}
          <div className="hn-card">
            <div className="admin-list-header">
              <h3 className="admin-sec-title">Current Job Directory ({jobs.length})</h3>
              <button className="btn btn-secondary btn-sm" onClick={handleResetJobs}>
                <RotateCcw size={14} />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="admin-items-list">
              {jobs.map((job) => (
                <div key={job.id} className="admin-item-row">
                  <div className="item-text">
                    <strong>{job.title}</strong>
                    <p>{job.company} • {job.location} ({job.workType})</p>
                    <span className="skills-inline">{job.requiredSkills?.join(', ')}</span>
                  </div>
                  <button className="btn-delete" onClick={() => handleDeleteJob(job.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS CATALOG */}
      {activeTab === 'projects' && (
        <div className="admin-content-grid animate-fade-in">
          {/* Add Project Form */}
          <div className="hn-card">
            <h3 className="admin-sec-title">Add Bridging Project</h3>
            <form onSubmit={handleAddProject} className="admin-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="e.g. Distributed Cache Proxy"
                    value={newProj.title}
                    onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Target Job Role</label>
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="e.g. Cloud Infrastructure Engineer"
                    value={newProj.targetRoles}
                    onChange={(e) => setNewProj({ ...newProj, targetRoles: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Technologies Used (comma separated)</label>
                <input
                  type="text"
                  className="hn-input"
                  placeholder="e.g. Redis, Node.js, Docker"
                  value={newProj.technologies}
                  onChange={(e) => setNewProj({ ...newProj, technologies: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Skills Gained (comma separated)</label>
                <input
                  type="text"
                  className="hn-input"
                  placeholder="e.g. Caching Architecture, In-Memory DB"
                  value={newProj.skillsGained}
                  onChange={(e) => setNewProj({ ...newProj, skillsGained: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <textarea
                  className="hn-input hn-textarea"
                  rows={2}
                  value={newProj.shortDescription}
                  onChange={(e) => setNewProj({ ...newProj, shortDescription: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                <Plus size={16} />
                <span>Save Bridging Project</span>
              </button>
            </form>
          </div>

          {/* Current Projects List */}
          <div className="hn-card">
            <div className="admin-list-header">
              <h3 className="admin-sec-title">Project Recommendations ({projects.length})</h3>
              <button className="btn btn-secondary btn-sm" onClick={handleResetProjects}>
                <RotateCcw size={14} />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="admin-items-list">
              {projects.map((proj) => (
                <div key={proj.id} className="admin-item-row">
                  <div className="item-text">
                    <strong>{proj.title}</strong>
                    <p>{proj.difficulty} Level • Target: {proj.targetRoles?.[0]}</p>
                    <span className="skills-inline">Stack: {proj.technologies?.join(', ')}</span>
                  </div>
                  <button className="btn-delete" onClick={() => handleDeleteProject(proj.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SKILL TAXONOMY */}
      {activeTab === 'taxonomy' && (
        <div className="taxonomy-grid animate-fade-in">
          {Object.entries(SKILL_TAXONOMY).map(([category, skills]) => (
            <div key={category} className="hn-card taxonomy-card">
              <h4 className="tax-cat-title">{category} ({skills.length})</h4>
              <div className="tax-tags-wrap">
                {skills.map((skill, idx) => (
                  <span key={idx} className="tax-skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
