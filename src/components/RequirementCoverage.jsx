import React from 'react';
import { BarChart3, CheckCircle2, Star, Key } from 'lucide-react';
import './RequirementCoverage.css';

const RequirementCoverage = ({ matchResult }) => {
  if (!matchResult) return null;

  const {
    requiredSkills = [],
    preferredSkills = [],
    matchedSkills = [],
    matchedKeywords = [],
    missingKeywords = []
  } = matchResult;

  const reqTotal = requiredSkills.length;
  const reqMatched = requiredSkills.filter(s => matchedSkills.includes(s)).length;
  const reqPct = reqTotal > 0 ? Math.round((reqMatched / reqTotal) * 100) : 100;

  const prefTotal = preferredSkills.length;
  const prefMatched = preferredSkills.filter(s => matchedSkills.includes(s)).length;
  const prefPct = prefTotal > 0 ? Math.round((prefMatched / prefTotal) * 100) : 100;

  const kwTotal = matchedKeywords.length + missingKeywords.length;
  const kwMatched = matchedKeywords.length;
  const kwPct = kwTotal > 0 ? Math.round((kwMatched / kwTotal) * 100) : 100;

  return (
    <div className="hn-card glass-card coverage-card animate-fade-in">
      <div className="section-card-header">
        <BarChart3 size={20} className="header-icon-primary" />
        <h3 className="section-card-title">Job Requirement Coverage</h3>
      </div>

      <div className="coverage-metrics-grid">
        {/* Required Skills Coverage */}
        <div className="coverage-item">
          <div className="coverage-meta-row">
            <div className="coverage-label-group">
              <CheckCircle2 size={16} className="icon-red" />
              <span className="coverage-name">Required Skills</span>
            </div>
            <span className="coverage-fraction">
              <strong>{reqMatched}</strong> / {reqTotal} matched ({reqPct}%)
            </span>
          </div>
          <div className="coverage-bar-bg">
            <div className="coverage-bar-fill red-bar" style={{ width: `${reqPct}%` }} />
          </div>
        </div>

        {/* Preferred Skills Coverage */}
        <div className="coverage-item">
          <div className="coverage-meta-row">
            <div className="coverage-label-group">
              <Star size={16} className="icon-amber" />
              <span className="coverage-name">Preferred Skills</span>
            </div>
            <span className="coverage-fraction">
              <strong>{prefMatched}</strong> / {prefTotal} matched ({prefPct}%)
            </span>
          </div>
          <div className="coverage-bar-bg">
            <div className="coverage-bar-fill amber-bar" style={{ width: `${prefPct}%` }} />
          </div>
        </div>

        {/* Keywords Coverage */}
        <div className="coverage-item">
          <div className="coverage-meta-row">
            <div className="coverage-label-group">
              <Key size={16} className="icon-purple" />
              <span className="coverage-name">Important Keywords</span>
            </div>
            <span className="coverage-fraction">
              <strong>{kwMatched}</strong> / {kwTotal} matched ({kwPct}%)
            </span>
          </div>
          <div className="coverage-bar-bg">
            <div className="coverage-bar-fill purple-bar" style={{ width: `${kwPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementCoverage;
