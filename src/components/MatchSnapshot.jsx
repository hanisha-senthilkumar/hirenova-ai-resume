import React from 'react';
import { Sparkles, Camera, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import './MatchSnapshot.css';

const MatchSnapshot = ({ matchResult, fileName }) => {
  if (!matchResult) return null;

  const {
    overallScore = 0,
    scoreLabel = '',
    matchedSkills = [],
    missingSkills = [],
    requiredSkills = [],
    keywordCoverage = 0
  } = matchResult;

  const strongestSkills = matchedSkills.slice(0, 3);
  const missingRequired = missingSkills.filter((s) => requiredSkills.includes(s));
  const topGap = missingRequired[0] || missingSkills[0] || 'None detected';

  return (
    <div className="hn-card glass-card snapshot-card animate-fade-in" id="match-snapshot-card">
      <div className="snapshot-card-header">
        <div className="snapshot-brand-group">
          <div className="snapshot-logo-icon">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="snapshot-brand-title">HireNova</h4>
            <span className="snapshot-brand-sub">AI CAREER INTELLIGENCE</span>
          </div>
        </div>

        <div className="snapshot-demo-badge">
          <Camera size={13} />
          <span>DEMO SNAPSHOT</span>
        </div>
      </div>

      <div className="snapshot-body-grid">
        {/* Score Pill */}
        <div className="snapshot-score-box">
          <span className="snapshot-score-num">{overallScore}%</span>
          <span className="snapshot-score-label">{scoreLabel}</span>
        </div>

        {/* Details Column */}
        <div className="snapshot-details-col">
          <div className="snapshot-detail-row">
            <span className="detail-meta-label">
              <CheckCircle2 size={13} className="green" />
              <span>Strongest Skills:</span>
            </span>
            <span className="detail-meta-val">
              {strongestSkills.length > 0 ? strongestSkills.join(', ') : 'General qualifications'}
            </span>
          </div>

          <div className="snapshot-detail-row">
            <span className="detail-meta-label">
              <AlertTriangle size={13} className="amber" />
              <span>Top Skill Gap:</span>
            </span>
            <span className="detail-meta-val gap-highlight">{topGap}</span>
          </div>

          <div className="snapshot-detail-row">
            <span className="detail-meta-label">
              <Key size={13} className="purple" />
              <span>Keyword Coverage:</span>
            </span>
            <span className="detail-meta-val">{keywordCoverage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSnapshot;
