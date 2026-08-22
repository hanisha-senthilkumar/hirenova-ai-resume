import React, { useState, useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';
import { getStoredProjects } from '../services/projectService';
import PageHeader from '../components/PageHeader';
import {
  FolderGit2,
  Search,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Code,
  Compass,
  Cpu
} from 'lucide-react';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const { profile } = useProfile();
  const projects = getStoredProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  // Extract all unique roles from projects
  const allRoles = useMemo(() => {
    const rolesSet = new Set();
    projects.forEach((p) => p.targetRoles.forEach((r) => rolesSet.add(r)));
    return ['All', ...Array.from(rolesSet)];
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      if (selectedDifficulty !== 'All' && proj.difficulty !== selectedDifficulty) {
        return false;
      }

      if (selectedRole !== 'All' && !proj.targetRoles.includes(selectedRole)) {
        return false;
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = proj.title.toLowerCase().includes(q);
        const matchesDesc = proj.shortDescription.toLowerCase().includes(q);
        const matchesTech = proj.technologies.some((t) => t.toLowerCase().includes(q));
        const matchesSkills = proj.skillsGained.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTech && !matchesSkills) return false;
      }

      return true;
    });
  }, [projects, selectedDifficulty, selectedRole, searchQuery]);

  const toggleExpand = (id) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  return (
    <div className="projects-page animate-fade-in">
      <PageHeader
        badgeText="SKILL-GAP BRIDGING PORTFOLIO"
        title="Role-Based Project Recommendations"
        description="High-impact engineering projects tailored to bridge your exact missing skills, build portfolio credibility, and demonstrate production readiness."
      />

      {/* Filter and Search Bar */}
      <div className="hn-card projects-filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="hn-input has-icon search-input"
            placeholder="Search by technology (e.g. Docker, Terraform, React, SQL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-group">
          {/* Target Role Filter */}
          <select
            className="hn-input filter-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {allRoles.map((role, i) => (
              <option key={i} value={role}>
                {role === 'All' ? 'All Target Roles' : role}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            className="hn-input filter-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-catalog-grid">
        {filteredProjects.length === 0 ? (
          <div className="hn-card empty-results-card">
            <FolderGit2 size={36} className="text-muted" />
            <h3>No projects found matching your criteria</h3>
            <p>Try resetting filters or searching for different technologies.</p>
          </div>
        ) : (
          filteredProjects.map((proj) => {
            const isExpanded = expandedProjectId === proj.id;
            return (
              <div key={proj.id} className="hn-card project-card-main animate-fade-in">
                <div className="project-card-top">
                  <div className="proj-pills-row">
                    <span className={`diff-pill ${proj.difficulty.toLowerCase()}`}>
                      {proj.difficulty} Level
                    </span>
                    <span className="role-target-tag">
                      🎯 {proj.targetRoles[0]}
                    </span>
                  </div>

                  <h3 className="project-title">{proj.title}</h3>
                  <p className="project-short-desc">{proj.shortDescription}</p>

                  {/* Why Relevant Callout */}
                  <div className="relevance-callout-box">
                    <strong>Why this bridges your gap:</strong>
                    <p>{proj.relevanceReason}</p>
                  </div>

                  {/* Skills Gained */}
                  <div className="skills-gained-box">
                    <label>Skills & Competencies Gained:</label>
                    <div className="gained-tags-wrap">
                      {proj.skillsGained.map((skill, i) => (
                        <span key={i} className="skill-gained-pill">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="tech-stack-row">
                    <Code size={14} className="text-primary" />
                    <span>Stack: {proj.technologies.join(' • ')}</span>
                  </div>
                </div>

                {/* Step-by-Step Implementation Guide Accordion */}
                {isExpanded && (
                  <div className="project-expanded-guide animate-fade-in">
                    <div className="arch-outline-box">
                      <Cpu size={16} className="text-primary" />
                      <div>
                        <strong>Architecture Outline:</strong>
                        <p>{proj.architectureOutline}</p>
                      </div>
                    </div>

                    <div className="steps-list-box">
                      <strong>Step-by-Step Implementation Roadmap:</strong>
                      <ol className="steps-ordered-list">
                        {proj.stepGuide.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                <div className="project-card-footer">
                  <button
                    className="btn btn-outline btn-sm w-full"
                    onClick={() => toggleExpand(proj.id)}
                  >
                    <span>{isExpanded ? 'Hide Implementation Steps' : 'View Architecture & Step Guide'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
