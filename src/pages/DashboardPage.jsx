import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { getRankedRecommendedJobs } from '../services/jobService';
import { getRecommendedProjectsForUser } from '../services/projectService';
import PageHeader from '../components/PageHeader';
import JobDetailsModal from '../components/JobDetailsModal';
import {
  Sparkles,
  ArrowRight,
  Upload,
  Briefcase,
  Target,
  AlertTriangle,
  CheckCircle2,
  FolderGit2,
  Bell,
  Milestone,
  FileCheck,
  TrendingUp,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile, structuredResume, notifications, roadmapProgress, toggleRoadmapStep } = useProfile();

  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  // Compute live ranking against user profile
  const rankedJobs = getRankedRecommendedJobs(structuredResume?.summary || '', profile);
  const topJobs = rankedJobs.slice(0, 3);
  const targetRole = profile?.targetRole || 'Cloud Infrastructure Engineer';

  // Compute missing skills across top target jobs
  const topJobMissing = topJobs[0]?.missingSkills || ['Kubernetes', 'Terraform'];
  const recommendedProjects = getRecommendedProjectsForUser(targetRole, topJobMissing).slice(0, 3);

  // Estimated ATS profile score based on top job match
  const profileScore = topJobs[0]?.matchScore || 82;

  const completedSteps = Object.values(roadmapProgress).filter(Boolean).length;
  const roadmapPct = Math.round((completedSteps / Object.keys(roadmapProgress).length) * 100);

  const handleOpenJob = (job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <PageHeader
        badgeText="AI CAREER INTELLIGENCE PLATFORM"
        title={`Welcome back, ${profile?.fullName || 'Alex'}!`}
        description="Here is your real-time career intelligence overview, ATS alignment score, and personalized next steps."
      />

      {/* Top Hero Stats & Quick Actions Grid */}
      <div className="dash-hero-grid">
        {/* Main ATS Score Card */}
        <div className="hn-card dash-score-card">
          <div className="card-top-row">
            <span className="pill-sub">OVERALL ATS COMPATIBILITY</span>
            <span className="status-live-indicator">LIVE ENGINE</span>
          </div>

          <div className="score-hero-display">
            <div className="circle-score-gauge">
              <span className="big-score-num">{profileScore}%</span>
              <span className="score-unit">ATS FIT</span>
            </div>
            <div className="score-details-col">
              <h3 className="target-role-title">{targetRole}</h3>
              <p className="role-match-desc">
                Your profile demonstrates strong alignment for <strong>{targetRole}</strong> opportunities.
              </p>
              <div className="mini-metrics-row">
                <span className="mini-metric">
                  <CheckCircle2 size={14} className="text-emerald" />
                  <strong>{profile?.skills?.length || 8}</strong> Matched Skills
                </span>
                <span className="mini-metric">
                  <AlertTriangle size={14} className="text-amber" />
                  <strong>{topJobMissing.length}</strong> Skill Gaps
                </span>
              </div>
            </div>
          </div>

          <div className="dash-score-actions">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/job-matcher')}
            >
              <span>Analyze New Resume / JD</span>
              <ArrowRight size={15} />
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/build-resume')}
            >
              <FileCheck size={15} />
              <span>Optimize in Builder</span>
            </button>
          </div>
        </div>

        {/* Career Progress & Roadmap Widget */}
        <div className="hn-card dash-roadmap-widget">
          <div className="card-top-row">
            <span className="pill-sub">CAREER ROADMAP PROGRESS</span>
            <span className="progress-badge">{roadmapPct}% COMPLETE</span>
          </div>

          <h3 className="widget-title">Career Acceleration Path</h3>
          <p className="widget-subtitle">Track your path from skill-gap bridging to job offers.</p>

          <div className="roadmap-progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${roadmapPct}%` }} />
          </div>

          <div className="mini-checklist">
            <label className="check-item">
              <input
                type="checkbox"
                checked={roadmapProgress.step1}
                onChange={() => toggleRoadmapStep('step1')}
              />
              <span>1. Complete Career Profile & Resume Parse</span>
            </label>
            <label className="check-item">
              <input
                type="checkbox"
                checked={roadmapProgress.step2}
                onChange={() => toggleRoadmapStep('step2')}
              />
              <span>2. Identify Missing Skills ({topJobMissing.slice(0, 2).join(', ')})</span>
            </label>
            <label className="check-item">
              <input
                type="checkbox"
                checked={roadmapProgress.step3}
                onChange={() => toggleRoadmapStep('step3')}
              />
              <span>3. Bridge Skill Gap with Recommended Project</span>
            </label>
            <label className="check-item">
              <input
                type="checkbox"
                checked={roadmapProgress.step4}
                onChange={() => toggleRoadmapStep('step4')}
              />
              <span>4. Export ATS-Friendly Resume PDF</span>
            </label>
          </div>

          <button
            className="btn btn-outline btn-sm w-full"
            style={{ marginTop: '1rem' }}
            onClick={() => navigate('/roadmap')}
          >
            <span>View Full Interactive Roadmap</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Dashboard Body */}
      <div className="dash-body-grid">
        {/* Left Column: Top Matching Jobs & Missing Skills */}
        <div className="dash-col-left">
          {/* Top Matching Jobs */}
          <div className="hn-card">
            <div className="section-header-row">
              <div className="sec-title-group">
                <Briefcase size={20} className="text-primary" />
                <h3>Top Matching Jobs For You</h3>
              </div>
              <button
                className="btn-link"
                onClick={() => navigate('/recommended-jobs')}
              >
                <span>View all ({rankedJobs.length})</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="job-cards-list">
              {topJobs.map((job) => (
                <div key={job.id} className="dash-job-card" onClick={() => handleOpenJob(job)}>
                  <div className="dash-job-main">
                    <div className="job-match-badge">{job.matchScore}% Match</div>
                    <div className="job-info-texts">
                      <h4 className="job-title-text">{job.title}</h4>
                      <p className="job-company-sub">
                        {job.company} • {job.location} • <span className="salary-tag">{job.salary}</span>
                      </p>
                      <div className="job-tags-row">
                        {job.requiredSkills.slice(0, 4).map((s, idx) => (
                          <span key={idx} className="skill-mini-tag">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm">Details</button>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Skills Intelligence */}
          <div className="hn-card" style={{ marginTop: '1.5rem' }}>
            <div className="sec-title-group" style={{ marginBottom: '1rem' }}>
              <AlertTriangle size={20} className="text-amber" />
              <h3>Critical Missing Skills to Learn</h3>
            </div>
            <p className="section-subtext">
              These high-demand skills are frequently required by top hiring teams in your target role.
            </p>

            <div className="missing-skills-grid">
              {topJobMissing.map((skill, i) => (
                <div key={i} className="missing-skill-card">
                  <div className="skill-card-top">
                    <span className="missing-pill">Gap #{i + 1}</span>
                    <h4 className="missing-name">{skill}</h4>
                  </div>
                  <p className="missing-rationale">
                    Required in {85 - i * 10}% of active {targetRole} job postings.
                  </p>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => navigate('/projects')}
                  >
                    <span>View Project to Learn</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Projects & Alerts */}
        <div className="dash-col-right">
          {/* Bridging Projects */}
          <div className="hn-card">
            <div className="section-header-row">
              <div className="sec-title-group">
                <FolderGit2 size={20} className="text-primary" />
                <h3>Recommended Projects</h3>
              </div>
              <button className="btn-link" onClick={() => navigate('/projects')}>
                <span>Explore all</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="projects-mini-list">
              {recommendedProjects.map((proj) => (
                <div key={proj.id} className="project-mini-item">
                  <div className="proj-badge-row">
                    <span className={`diff-pill ${proj.difficulty.toLowerCase()}`}>
                      {proj.difficulty}
                    </span>
                    <span className="skills-bridged-count">
                      + Bridges {proj.skillsGained.slice(0, 2).join(', ')}
                    </span>
                  </div>
                  <h4 className="proj-mini-title">{proj.title}</h4>
                  <p className="proj-mini-desc">{proj.shortDescription}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="hn-card" style={{ marginTop: '1.5rem' }}>
            <div className="section-header-row">
              <div className="sec-title-group">
                <Bell size={20} className="text-primary" />
                <h3>Recent Job & Career Alerts</h3>
              </div>
              <button className="btn-link" onClick={() => navigate('/notifications')}>
                <span>Settings</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="alerts-mini-list">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="alert-mini-card">
                  <span className={`alert-indicator ${notif.type}`} />
                  <div className="alert-text-box">
                    <h5 className="alert-title">{notif.title}</h5>
                    <p className="alert-body">{notif.message}</p>
                    <span className="alert-time">{notif.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
