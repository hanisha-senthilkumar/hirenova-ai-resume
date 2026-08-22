import React from 'react';
import { FileText, FileSearch, Cpu, Check, Lock } from 'lucide-react';
import './StepIndicator.css';

const StepIndicator = ({ isResumeReady, isJdReady }) => {
  return (
    <div className="step-indicator-wrapper animate-fade-in">
      {/* Step 1: Resume */}
      <div className={`step-pill ${isResumeReady ? 'completed' : 'active'}`}>
        <span className="step-icon-badge">
          {isResumeReady ? <Check size={14} /> : <FileText size={14} />}
        </span>
        <span className="step-label">01 Resume</span>
      </div>

      <div className="step-connector" />

      {/* Step 2: Job Description */}
      <div
        className={`step-pill ${
          isJdReady ? 'completed' : isResumeReady ? 'active' : 'pending'
        }`}
      >
        <span className="step-icon-badge">
          {isJdReady ? <Check size={14} /> : <FileSearch size={14} />}
        </span>
        <span className="step-label">02 Job Description</span>
      </div>

      <div className="step-connector" />

      {/* Step 3: Analysis */}
      <div className="step-pill locked">
        <span className="step-icon-badge">
          <Lock size={13} />
        </span>
        <span className="step-label">03 Analysis</span>
      </div>
    </div>
  );
};

export default StepIndicator;
