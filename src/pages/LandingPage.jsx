import React from 'react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  CheckCircle2,
  FileCheck,
  Briefcase,
  FolderGit2,
  Milestone,
  Bell,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: 'Explainable ATS Match Engine',
      description: 'Calculate multi-factor alignment: Skills, Keywords, Experience, Education, and Project Relevance.'
    },
    {
      icon: TrendingUp,
      title: 'Missing Skills & Keyword Intelligence',
      description: 'Uncover critical missing qualifications with contextual explanations and constructive learning recommendations.'
    },
    {
      icon: FileCheck,
      title: 'ATS Resume Builder & PDF Export',
      description: 'Build, reorder, and download professional ATS-compliant resumes with clean layouts and instant formatting.'
    },
    {
      icon: Briefcase,
      title: 'Ranked Job Discovery',
      description: 'Browse verified job listings from LinkedIn, Greenhouse, and Lever ranked automatically by your profile match.'
    },
    {
      icon: FolderGit2,
      title: 'Role-Based Bridging Projects',
      description: 'Build targeted engineering projects that bridge your exact skill gaps and prove production readiness.'
    },
    {
      icon: Milestone,
      title: 'Personalized Career Roadmap',
      description: 'Interactive step-by-step career path tracking your journey from current skills to your dream job offer.'
    }
  ];

  return (
    <div className="landing-page animate-fade-in">
      <Hero />

      {/* Main Features Grid */}
      <section className="features-section">
        <div className="features-header">
          <div className="badge-pill">COMPREHENSIVE CAREER SUITE</div>
          <h2 className="features-title">Everything You Need To Accelerate Your Tech Career</h2>
          <p className="features-subtitle">
            An all-in-one AI career assistant for students and job seekers to optimize resumes, bridge skill gaps, and land high-match roles.
          </p>
        </div>

        <div className="grid-responsive-3 features-grid">
          {features.map((feat, index) => (
            <FeatureCard
              key={index}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
            />
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="hn-card landing-cta-banner">
        <div className="cta-banner-content">
          <h2>Ready to discover your ATS match score?</h2>
          <p>Upload your resume in seconds and get instant multi-factor career intelligence.</p>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/job-matcher')}
        >
          <span>Start Free Analysis</span>
          <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
