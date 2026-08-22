import React from 'react';
import { X, ExternalLink, Bookmark, CheckCircle2, AlertTriangle, ArrowRight, Building, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import './JobDetailsModal.css';

const JobDetailsModal = ({ job, isOpen, onClose }) => {
  const { savedJobIds, toggleSaveJob } = useProfile();
  const navigate = useNavigate();

  if (!isOpen || !job) return null;

  const isSaved = savedJobIds.includes(job.id);

  return (
    <div className="job-modal-overlay animate-fade-in">
      <div className="job-modal-content glass-card">
        {/* Header */}
        <div className="job-modal-header">
          <div className="job-title-group">
            <span className="job-posted-pill">{job.postedDate || 'Recent'}</span>
            <h2 className="modal-job-title">{job.title}</h2>
            <div className="job-meta-row">
              <span className="meta-item">
                <Building size={15} />
                <strong>{job.company}</strong>
              </span>
              <span className="meta-item">
                <MapPin size={15} />
                {job.location}
              </span>
              <span className="meta-item">
                <Briefcase size={15} />
                {job.workType} • {job.experienceLevel}
              </span>
              {job.salary && (
                <span className="meta-item salary">
                  <DollarSign size={15} />
                  {job.salary}
                </span>
              )}
            </div>
          </div>

          <button className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="job-modal-body">
          {/* Match Score Banner */}
          <div className="job-match-banner">
            <div className="match-banner-left">
              <div className="match-score-pill">
                <span className="score-num">{job.matchScore || 85}%</span>
                <span className="score-lbl">ATS FIT</span>
              </div>
              <div className="match-banner-text">
                <h4 className="banner-heading">{job.matchGrade || 'Strong Match'}</h4>
                <p className="banner-sub">
                  Based on your resume skills, experience level, and keyword alignment.
                </p>
              </div>
            </div>

            <div className="match-banner-actions">
              <button
                className={`btn btn-secondary ${isSaved ? 'saved' : ''}`}
                onClick={() => toggleSaveJob(job.id)}
              >
                <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                <span>{isSaved ? 'Saved' : 'Save Job'}</span>
              </button>

              <a
                href={job.sourceUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <span>Apply on {job.source || 'Original Site'}</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Skill Breakdown Grid */}
          <div className="job-skills-breakdown-grid">
            {/* Matching Skills */}
            <div className="skill-box matching-box">
              <div className="box-header">
                <CheckCircle2 size={18} className="text-emerald" />
                <h4>Matching Skills ({job.matchedSkills?.length || job.requiredSkills?.slice(0, 3).length || 0})</h4>
              </div>
              <div className="badge-list">
                {(job.matchedSkills?.length ? job.matchedSkills : job.requiredSkills?.slice(0, 3))?.map((s, i) => (
                  <span key={i} className="skill-tag match">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="skill-box missing-box">
              <div className="box-header">
                <AlertTriangle size={18} className="text-amber" />
                <h4>Missing / Skill Gaps ({job.missingSkills?.length || 1})</h4>
              </div>
              <div className="badge-list">
                {(job.missingSkills?.length ? job.missingSkills : ['Kubernetes'])?.map((s, i) => (
                  <span key={i} className="skill-tag gap">
                    + {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Job Description */}
          <div className="job-section-block">
            <h3 className="section-title">Job Overview & Responsibilities</h3>
            <div className="jd-text-content">
              {job.description?.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Requirements Details */}
          <div className="job-section-block">
            <h3 className="section-title">Requirements & Qualifications</h3>
            <ul className="req-list">
              <li><strong>Education:</strong> {job.educationRequirement || "Bachelor's degree or equivalent"}</li>
              <li><strong>Experience:</strong> {job.experienceRequirement || 'Relevant professional experience'}</li>
              <li><strong>Required Technologies:</strong> {job.requiredSkills?.join(', ')}</li>
              {job.preferredSkills && <li><strong>Preferred Qualifications:</strong> {job.preferredSkills.join(', ')}</li>}
            </ul>
          </div>

          {/* Quick Actions to Bridge Gap */}
          <div className="bridge-gap-callout">
            <div className="callout-text">
              <h4>Want to improve your match for this role?</h4>
              <p>Build a role-based project or optimize your resume in our ATS Resume Builder.</p>
            </div>
            <div className="callout-buttons">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onClose();
                  navigate('/projects');
                }}
              >
                <span>View Bridging Projects</span>
                <ArrowRight size={14} />
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onClose();
                  navigate('/build-resume');
                }}
              >
                <span>Build ATS Resume</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
