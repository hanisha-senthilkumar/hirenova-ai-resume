import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Target, Upload, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page animate-fade-in">
      <PageHeader
        badgeText="AI CAREER INTELLIGENCE PLATFORM"
        title="Resume & Job Match Intelligence"
        description="Compare your resume with a job description and discover how well your profile aligns before you apply."
      />

      {/* Main SaaS Action Hero Box */}
      <div className="hn-card dashboard-hero-card">
        <div className="dash-hero-content">
          <div className="dash-hero-badge">AI-5 MATCH ENGINE READY</div>
          <h2 className="dash-hero-title">Ready to analyze your job fit?</h2>
          <p className="dash-hero-text">
            Upload your latest resume (PDF or TXT) and paste your target job description to uncover key missing skills and keywords.
          </p>
          <div className="dash-hero-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/job-matcher')}
            >
              <span>Start Job Match</span>
              <ArrowRight size={18} />
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/job-matcher')}
            >
              <Upload size={18} />
              <span>Upload Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Capabilities Grid */}
      <div className="grid-responsive-3 dashboard-overview-grid">
        <div className="hn-card dash-info-card">
          <div className="dash-info-icon-box">
            <Target size={22} />
          </div>
          <h3 className="dash-info-title">Match Comparison</h3>
          <p className="dash-info-desc">
            Direct side-by-side analysis of your resume skills against target job description requirements.
          </p>
        </div>

        <div className="hn-card dash-info-card">
          <div className="dash-info-icon-box">
            <FileText size={22} />
          </div>
          <h3 className="dash-info-title">PDF & TXT Support</h3>
          <p className="dash-info-desc">
            No manual retyping required. Upload your existing resume file directly to start comparison.
          </p>
        </div>

        <div className="hn-card dash-info-card">
          <div className="dash-info-icon-box">
            <CheckCircle2 size={22} />
          </div>
          <h3 className="dash-info-title">Keyword Gap Analysis</h3>
          <p className="dash-info-desc">
            Identify critical missing skills and keyword optimizations to enhance your job applications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
