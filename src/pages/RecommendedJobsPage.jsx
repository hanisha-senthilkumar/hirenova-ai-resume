import React, { useState, useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';
import { getRankedRecommendedJobs } from '../services/jobService';
import PageHeader from '../components/PageHeader';
import JobDetailsModal from '../components/JobDetailsModal';
import {
  Briefcase,
  Search,
  Filter,
  Bookmark,
  ExternalLink,
  MapPin,
  Building,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import './RecommendedJobsPage.css';

const RecommendedJobsPage = () => {
  const { profile, structuredResume, savedJobIds, toggleSaveJob } = useProfile();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkType, setSelectedWorkType] = useState('All');
  const [minMatch, setMinMatch] = useState(0);
  const [sortBy, setSortBy] = useState('match'); // match | recent
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);

  // Compute live ranked jobs
  const rankedJobs = useMemo(() => {
    return getRankedRecommendedJobs(structuredResume?.summary || '', profile);
  }, [structuredResume, profile]);

  // Apply filters
  const filteredJobs = useMemo(() => {
    return rankedJobs.filter((job) => {
      if (onlySaved && !savedJobIds.includes(job.id)) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesSkills = job.requiredSkills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
      }

      if (selectedWorkType !== 'All' && job.workType !== selectedWorkType) {
        return false;
      }

      if (job.matchScore < minMatch) {
        return false;
      }

      return true;
    });
  }, [rankedJobs, searchQuery, selectedWorkType, minMatch, onlySaved, savedJobIds]);

  const handleOpenDetails = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="recommended-jobs-page animate-fade-in">
      <PageHeader
        badgeText="MARKET DISCOVERY & MATCHING"
        title="Recommended Jobs For You"
        description="AI-ranked opportunities evaluated directly against your active resume skills, experience depth, and career preferences."
      />

      {/* Filter and Search Bar */}
      <div className="hn-card jobs-filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="hn-input has-icon search-input"
            placeholder="Search by job title, company, or skill (e.g. AWS, React, Python)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-group">
          {/* Work Type Filter */}
          <select
            className="hn-input filter-select"
            value={selectedWorkType}
            onChange={(e) => setSelectedWorkType(e.target.value)}
          >
            <option value="All">All Work Types</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">On-site</option>
          </select>

          {/* Minimum Match Filter */}
          <select
            className="hn-input filter-select"
            value={minMatch}
            onChange={(e) => setMinMatch(Number(e.target.value))}
          >
            <option value={0}>All Match %</option>
            <option value={80}>80%+ High Fit</option>
            <option value={70}>70%+ Moderate Fit</option>
            <option value={60}>60%+ Partial Fit</option>
          </select>

          {/* Saved Filter Toggle */}
          <button
            className={`btn btn-secondary filter-toggle-btn ${onlySaved ? 'active' : ''}`}
            onClick={() => setOnlySaved(!onlySaved)}
          >
            <Bookmark size={15} fill={onlySaved ? 'currentColor' : 'none'} />
            <span>Saved ({savedJobIds.length})</span>
          </button>
        </div>
      </div>

      {/* Active Results Summary */}
      <div className="results-count-row">
        <span>Showing <strong>{filteredJobs.length}</strong> matching career opportunities</span>
        <span className="source-verification-tag">✓ Verified Job Market Sources (LinkedIn, Greenhouse, Lever)</span>
      </div>

      {/* Job Cards Grid */}
      <div className="job-listings-grid">
        {filteredJobs.length === 0 ? (
          <div className="hn-card empty-results-card">
            <Briefcase size={36} className="text-muted" />
            <h3>No jobs found matching your filter criteria</h3>
            <p>Try adjusting your search query, lowering the match threshold, or resetting filters.</p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedWorkType('All');
                setMinMatch(0);
                setOnlySaved(false);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            return (
              <div key={job.id} className="hn-card job-card-main animate-fade-in">
                <div className="job-card-header">
                  <div className="header-badge-row">
                    <span className="work-type-pill">{job.workType}</span>
                    <span className="posted-pill">{job.postedDate}</span>
                  </div>
                  <button
                    className={`bookmark-btn ${isSaved ? 'saved' : ''}`}
                    onClick={() => toggleSaveJob(job.id)}
                    aria-label="Save job"
                  >
                    <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="job-card-body">
                  <h3 className="job-title" onClick={() => handleOpenDetails(job)}>
                    {job.title}
                  </h3>
                  <div className="job-company-row">
                    <Building size={14} />
                    <strong>{job.company}</strong>
                    <span>•</span>
                    <MapPin size={14} />
                    <span>{job.location}</span>
                  </div>

                  {job.salary && (
                    <div className="job-salary-row">
                      <DollarSign size={14} />
                      <span>{job.salary}</span>
                    </div>
                  )}

                  <p className="job-snippet">{job.description?.slice(0, 160)}...</p>

                  {/* Match Meter */}
                  <div className="card-match-meter">
                    <div className="meter-label-row">
                      <span className="match-grade">{job.matchGrade}</span>
                      <strong className="match-num">{job.matchScore}% ATS Score</strong>
                    </div>
                    <div className="meter-track">
                      <div className="meter-fill" style={{ width: `${job.matchScore}%` }} />
                    </div>
                  </div>

                  {/* Required Skills Badges */}
                  <div className="skills-badge-list">
                    {job.requiredSkills.map((skill, i) => (
                      <span key={i} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="job-card-footer">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenDetails(job)}
                  >
                    Match Details
                  </button>

                  <a
                    href={job.sourceUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <span>Apply ({job.source})</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Deep-dive Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default RecommendedJobsPage;
