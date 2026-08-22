import React, { useState } from 'react';
import { Target, Info, ChevronDown, ChevronUp, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import './ScoreBreakdownCard.css';

const ScoreBreakdownCard = ({ matchResult }) => {
  const [showFormula, setShowFormula] = useState(false);

  if (!matchResult) return null;

  const { overallScore, scoreLabel, skillCoverage, keywordCoverage, textSimilarity } = matchResult;

  // Determine color theme based on score
  let scoreColorClass = 'score-moderate';
  if (overallScore >= 80) scoreColorClass = 'score-strong';
  else if (overallScore < 40) scoreColorClass = 'score-weak';

  return (
    <div className="hn-card glass-card score-breakdown-card animate-fade-in">
      <div className="score-card-header">
        <div className="badge-pill">
          <Target size={14} />
          <span>MATCHING ENGINE RESULTS</span>
        </div>
        <button
          className="btn btn-secondary btn-sm formula-toggle-btn"
          onClick={() => setShowFormula(!showFormula)}
        >
          <Info size={14} />
          <span>How score is calculated</span>
          {showFormula ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Main Overall Score Gauge & Label */}
      <div className="score-main-display">
        <div className={`score-circle-gauge ${scoreColorClass}`}>
          <div className="gauge-inner">
            <span className="gauge-score-val">{overallScore}%</span>
            <span className="gauge-score-sub">Overall Match</span>
          </div>
        </div>

        <div className="score-label-meta">
          <h2 className="score-status-title">{scoreLabel}</h2>
          <p className="score-status-desc">
            Calculated by HireNova's deterministic matching engine comparing your resume against the target job description requirements.
          </p>
        </div>
      </div>

      {/* Formula Explanation Collapsible Box */}
      {showFormula && (
        <div className="formula-explanation-box animate-fade-in">
          <h4 className="formula-box-title">Score Weighting Formula</h4>
          <div className="formula-weights-grid">
            <div className="formula-weight-item">
              <span className="weight-pct">45%</span>
              <span className="weight-name">Skill Match</span>
            </div>
            <div className="formula-weight-item">
              <span className="weight-pct">25%</span>
              <span className="weight-name">Keyword Match</span>
            </div>
            <div className="formula-weight-item">
              <span className="weight-pct">30%</span>
              <span className="weight-name">TF-IDF Text Similarity</span>
            </div>
          </div>
          <p className="formula-text-note">
            Your overall score is calculated by HireNova's matching engine using weighted skill coverage, keyword coverage and TF-IDF cosine similarity.
          </p>
        </div>
      )}

      {/* Three Breakdown Metric Cards */}
      <div className="score-breakdown-grid">
        <div className="hn-card breakdown-metric-card">
          <div className="metric-header">
            <CheckCircle2 size={18} className="metric-icon" />
            <span className="metric-name">Skill Match</span>
          </div>
          <span className="metric-val">{skillCoverage}%</span>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${skillCoverage}%` }} />
          </div>
          <span className="metric-weight-tag">Weight: 45%</span>
        </div>

        <div className="hn-card breakdown-metric-card">
          <div className="metric-header">
            <Sparkles size={18} className="metric-icon" />
            <span className="metric-name">Keyword Match</span>
          </div>
          <span className="metric-val">{keywordCoverage}%</span>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${keywordCoverage}%` }} />
          </div>
          <span className="metric-weight-tag">Weight: 25%</span>
        </div>

        <div className="hn-card breakdown-metric-card">
          <div className="metric-header">
            <FileText size={18} className="metric-icon" />
            <span className="metric-name">Text Similarity</span>
          </div>
          <span className="metric-val">{textSimilarity}%</span>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${textSimilarity}%` }} />
          </div>
          <span className="metric-weight-tag">Weight: 30% (TF-IDF)</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBreakdownCard;
