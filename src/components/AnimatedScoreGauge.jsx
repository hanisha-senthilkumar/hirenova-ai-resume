import React, { useState, useEffect } from 'react';
import { Target, Info, ChevronDown, ChevronUp, CheckCircle2, Sparkles, FileText } from 'lucide-react';
import './AnimatedScoreGauge.css';

const AnimatedScoreGauge = ({ matchResult }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [showFormula, setShowFormula] = useState(false);

  const targetScore = matchResult?.overallScore || 0;

  // Score count-up animation
  useEffect(() => {
    setDisplayScore(0);
    let start = 0;
    const duration = 1000; // 1 second animation
    const steps = 30;
    const increment = targetScore / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetScore]);

  if (!matchResult) return null;

  const { scoreLabel, skillCoverage, keywordCoverage, textSimilarity } = matchResult;

  // Determine gauge color styling based on target score
  let scoreClass = 'score-moderate';
  if (targetScore >= 80) scoreClass = 'score-strong';
  else if (targetScore < 40) scoreClass = 'score-weak';

  return (
    <div className="hn-card glass-card hero-score-card animate-fade-in">
      <div className="hero-score-header">
        <div className="badge-pill">
          <Target size={14} />
          <span>YOUR RESUME MATCH</span>
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

      {/* Main Score Display */}
      <div className="hero-score-main">
        <div className={`score-circle-outer ${scoreClass}`}>
          <div className="score-circle-inner">
            <span className="score-number">{displayScore}%</span>
            <span className="score-sub-label">OVERALL MATCH</span>
          </div>
        </div>

        <div className="score-meta-group">
          <h2 className="score-label-heading">{scoreLabel}</h2>
          <p className="score-label-subtext">
            Based on skill alignment, keyword coverage and text similarity.
          </p>
        </div>
      </div>

      {/* Formula Explanation Expandable Box */}
      {showFormula && (
        <div className="formula-box animate-fade-in">
          <h4 className="formula-box-heading">How HireNova Calculates Your Match</h4>
          <div className="formula-pills-row">
            <div className="formula-pill">
              <span className="pill-pct">45%</span>
              <span className="pill-name">Skill Match</span>
            </div>
            <div className="formula-pill">
              <span className="pill-pct">25%</span>
              <span className="pill-name">Keyword Match</span>
            </div>
            <div className="formula-pill">
              <span className="pill-pct">30%</span>
              <span className="pill-name">TF-IDF Text Similarity</span>
            </div>
          </div>
          <p className="formula-desc">
            HireNova combines skill coverage, important job-description keywords and TF-IDF cosine similarity to produce an explainable match score.
          </p>
        </div>
      )}

      {/* Dynamic Breakdown Metric Cards */}
      <div className="breakdown-cards-grid">
        <div className="hn-card metric-glass-card">
          <div className="metric-title-row">
            <CheckCircle2 size={18} className="icon-green" />
            <span className="metric-title">Skill Match</span>
          </div>
          <div className="metric-score-row">
            <span className="metric-val">{skillCoverage}%</span>
            <span className="metric-weight">Weight: 45%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill green-fill" style={{ width: `${skillCoverage}%` }} />
          </div>
        </div>

        <div className="hn-card metric-glass-card">
          <div className="metric-title-row">
            <Sparkles size={18} className="icon-purple" />
            <span className="metric-title">Keyword Match</span>
          </div>
          <div className="metric-score-row">
            <span className="metric-val">{keywordCoverage}%</span>
            <span className="metric-weight">Weight: 25%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill purple-fill" style={{ width: `${keywordCoverage}%` }} />
          </div>
        </div>

        <div className="hn-card metric-glass-card">
          <div className="metric-title-row">
            <FileText size={18} className="icon-indigo" />
            <span className="metric-title">Text Similarity</span>
          </div>
          <div className="metric-score-row">
            <span className="metric-val">{textSimilarity}%</span>
            <span className="metric-weight">Weight: 30% (TF-IDF)</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill indigo-fill" style={{ width: `${textSimilarity}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedScoreGauge;
