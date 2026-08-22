import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import {
  Milestone,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  FolderGit2,
  FileCheck,
  Send,
  ArrowRight,
  Sparkles,
  Trophy
} from 'lucide-react';
import './CareerRoadmapPage.css';

const CareerRoadmapPage = () => {
  const { profile, structuredResume, roadmapProgress, toggleRoadmapStep } = useProfile();
  const navigate = useNavigate();

  const targetRole = profile?.targetRole || 'Cloud Infrastructure Engineer';
  const currentSkills = profile?.skills || ['AWS', 'Docker', 'Linux', 'CI/CD', 'Git'];
  const missingSkills = ['Kubernetes (EKS)', 'Terraform (IaC)', 'ArgoCD / GitOps', 'System Telemetry'];

  const completedCount = Object.values(roadmapProgress).filter(Boolean).length;
  const totalSteps = 6;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const ROADMAP_STAGES = [
    {
      id: 'step1',
      title: 'Stage 1: Current Baseline & Profile Analysis',
      tag: 'Completed',
      desc: 'Extracted current skills, experience, and baseline ATS compatibility from your uploaded resume.',
      icon: CheckCircle2,
      skills: currentSkills.slice(0, 5),
      actionText: 'Review Profile',
      actionLink: '/profile'
    },
    {
      id: 'step2',
      title: 'Stage 2: Skill Gap Identification',
      tag: 'Analyzed',
      desc: `Pinpointed essential requirements for ${targetRole} currently absent from your resume.`,
      icon: AlertTriangle,
      skills: missingSkills,
      actionText: 'Run Job Match',
      actionLink: '/job-matcher'
    },
    {
      id: 'step3',
      title: 'Stage 3: Targeted Learning & Sandbox Labs',
      tag: 'In Progress',
      desc: 'Master Kubernetes cluster orchestration, Terraform multi-tier provisioning, and GitOps deployments.',
      icon: BookOpen,
      skills: ['Kubernetes Docs & Labs', 'HashiCorp Terraform Tutorials', 'AWS Well-Architected Framework'],
      actionText: 'View Topics',
      actionLink: '/projects'
    },
    {
      id: 'step4',
      title: 'Stage 4: Build Bridging Portfolio Projects',
      tag: 'Hands-On',
      desc: 'Construct production-grade projects demonstrating real-world IaC and containerization mastery.',
      icon: FolderGit2,
      skills: ['Cloud-Native File Storage System', 'Automated CI/CD GitOps Pipeline'],
      actionText: 'Explore Projects',
      actionLink: '/projects'
    },
    {
      id: 'step5',
      title: 'Stage 5: ATS Resume Update & Optimization',
      tag: 'Optimization',
      desc: 'Incorporate new verified project achievements into our ATS-compliant resume builder and download PDF.',
      icon: FileCheck,
      skills: ['Quantifiable Outcomes (X-Y-Z)', 'ATS Format Validation'],
      actionText: 'Build ATS Resume',
      actionLink: '/build-resume'
    },
    {
      id: 'step6',
      title: 'Stage 6: Target Job Applications & Alerts',
      tag: 'Career Launch',
      desc: 'Apply directly to verified market job openings with >85% ATS match alignment.',
      icon: Send,
      skills: ['Tailored Cover Letters', 'Direct Recruiter Outreach'],
      actionText: 'Browse Recommended Jobs',
      actionLink: '/recommended-jobs'
    }
  ];

  return (
    <div className="career-roadmap-page animate-fade-in">
      <PageHeader
        badgeText="PERSONALIZED CAREER ROADMAP"
        title="Your Career Acceleration Roadmap"
        description={`Interactive step-by-step pathway from your current skill profile to landing a high-impact role as a ${targetRole}.`}
      />

      {/* Progress Header Card */}
      <div className="hn-card roadmap-progress-hero">
        <div className="progress-hero-left">
          <div className="trophy-circle">
            <Trophy size={32} className="text-primary" />
          </div>
          <div>
            <span className="pill-sub">CAREER ACCELERATION TRACK</span>
            <h2 className="roadmap-target-heading">Target Role: {targetRole}</h2>
            <p className="roadmap-subtext">
              Track your milestones. Click checkboxes as you complete each step along your career journey.
            </p>
          </div>
        </div>

        <div className="progress-hero-right">
          <div className="pct-display">
            <span className="pct-number">{progressPercent}%</span>
            <span className="pct-label">{completedCount} of {totalSteps} Milestones</span>
          </div>
          <div className="big-progress-bar">
            <div className="big-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Timeline Stages Flow */}
      <div className="roadmap-timeline">
        {ROADMAP_STAGES.map((stage, idx) => {
          const isDone = roadmapProgress[stage.id];
          const IconComponent = stage.icon;

          return (
            <div key={stage.id} className={`roadmap-stage-card hn-card ${isDone ? 'completed-stage' : ''}`}>
              <div className="stage-checkbox-col">
                <input
                  type="checkbox"
                  id={`chk-${stage.id}`}
                  checked={isDone}
                  onChange={() => toggleRoadmapStep(stage.id)}
                  className="stage-checkbox"
                />
                <div className="step-badge-num">Step {idx + 1}</div>
              </div>

              <div className="stage-content-col">
                <div className="stage-header-row">
                  <div className="stage-title-wrap">
                    <IconComponent size={20} className={isDone ? 'text-emerald' : 'text-primary'} />
                    <h3 className="stage-title">{stage.title}</h3>
                  </div>
                  <span className={`stage-tag ${isDone ? 'done' : ''}`}>
                    {isDone ? '✓ Completed' : stage.tag}
                  </span>
                </div>

                <p className="stage-desc">{stage.desc}</p>

                {/* Associated Skills / Milestones */}
                <div className="stage-skills-box">
                  <span className="box-lbl">Key Focus Areas:</span>
                  <div className="stage-pills-wrap">
                    {stage.skills.map((s, i) => (
                      <span key={i} className="stage-skill-pill">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="stage-action-bar">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(stage.actionLink)}
                  >
                    <span>{stage.actionText}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareerRoadmapPage;
