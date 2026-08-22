import React from 'react';
import { CheckCircle2, Clock, Lock, Sparkles } from 'lucide-react';
import './ReadinessCard.css';

const ReadinessCard = ({ isResumeReady, isJdReady }) => {
  return (
    <div className="hn-card glass-card readiness-card animate-fade-in">
      <div className="readiness-header">
        <div className="readiness-title-group">
          <Sparkles size={18} className="readiness-icon" />
          <h3 className="readiness-card-title">Analysis Readiness</h3>
        </div>
        <span className="readiness-pipeline-tag">Pipeline Pipeline</span>
      </div>

      <div className="readiness-states-grid">
        {/* State 1: Resume */}
        <div className={`readiness-item ${isResumeReady ? 'ready' : 'waiting'}`}>
          <div className="item-status-icon">
            {isResumeReady ? <CheckCircle2 size={16} /> : <Clock size={16} />}
          </div>
          <div className="item-info">
            <span className="item-label">Resume</span>
            <span className="item-state-text">
              {isResumeReady ? '✓ Text extracted' : 'Waiting for upload'}
            </span>
          </div>
        </div>

        {/* State 2: Job Description */}
        <div className={`readiness-item ${isJdReady ? 'ready' : 'waiting'}`}>
          <div className="item-status-icon">
            {isJdReady ? <CheckCircle2 size={16} /> : <Clock size={16} />}
          </div>
          <div className="item-info">
            <span className="item-label">Job Description</span>
            <span className="item-state-text">
              {isJdReady ? '✓ Ready for analysis' : 'Waiting for job description'}
            </span>
          </div>
        </div>

        {/* State 3: Matching Engine */}
        <div className="readiness-item locked">
          <div className="item-status-icon">
            <Lock size={16} />
          </div>
          <div className="item-info">
            <span className="item-label">Matching Engine</span>
            <span className="item-state-text">🔒 Coming in Phase 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadinessCard;
