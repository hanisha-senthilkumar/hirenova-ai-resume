import React from 'react';
import {
  Sparkles,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Award,
  RefreshCw,
  Loader2,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import './AiInsightsSection.css';

const AiInsightsSection = ({
  aiData,
  loading,
  error,
  onGenerate,
  onRegenerate,
  hasRun
}) => {
  return (
    <div className="hn-card glass-card ai-insights-card animate-fade-in">
      {/* Header */}
      <div className="ai-card-header">
        <div className="ai-badge-group">
          <div className="badge-pill ai-badge-pill">
            <Sparkles size={14} />
            <span>HIRENOVA AI INSIGHTS</span>
          </div>
          <p className="ai-header-sub">
            Puter AI explanation and actionable resume improvement recommendations.
          </p>
        </div>

        {!hasRun ? (
          <button
            className="btn btn-primary generate-ai-btn"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="btn-spinner" />
                <span>Generating Career Insights...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate AI Insights</span>
              </>
            )}
          </button>
        ) : (
          <button
            className="btn btn-secondary btn-sm regenerate-ai-btn"
            onClick={onRegenerate}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={14} className="btn-spinner" />
            ) : (
              <RefreshCw size={14} />
            )}
            <span>Regenerate Insights</span>
          </button>
        )}
      </div>

      {/* Privacy Note */}
      <div className="ai-privacy-note">
        <ShieldCheck size={14} />
        <span>AI insights are generated from the resume and job description provided for this analysis.</span>
      </div>

      {/* Error / Fallback Banner */}
      {error && (
        <div className="ai-fallback-banner animate-fade-in">
          <AlertCircle size={18} />
          <span>AI insights are temporarily unavailable. Your calculated match results are still available.</span>
        </div>
      )}

      {/* Loading Glass Banner */}
      {loading && (
        <div className="ai-loading-box animate-fade-in">
          <Loader2 size={32} className="ai-spinner" />
          <div className="loading-text-group">
            <h4 className="loading-title">Generating Career Insights...</h4>
            <p className="loading-sub">Analyzing your match results with HireNova AI...</p>
          </div>
        </div>
      )}

      {/* AI Insights Content when ready */}
      {aiData && !loading && (
        <div className="ai-insights-body animate-fade-in">
          {/* TASK 1: AI MATCH EXPLANATION */}
          <div className="ai-section-block">
            <div className="ai-section-title-row">
              <Lightbulb size={20} className="ai-section-icon" />
              <h3 className="ai-section-title">AI Match Explanation</h3>
            </div>
            <p className="ai-explanation-text">{aiData.summary}</p>
          </div>

          {/* TASK 7: APPLICATION READINESS */}
          <div className="ai-readiness-banner">
            <div className="readiness-meta">
              <span className="readiness-tag-label">Application Readiness</span>
              <h4 className="readiness-val">{aiData.readinessLabel}</h4>
            </div>
            <p className="readiness-disclaimer">
              Note: This assessment indicates resume-to-job alignment, not your likelihood of being hired.
            </p>
          </div>

          {/* TASK 2: PRIORITY SKILL GAPS */}
          {aiData.priorityGaps && aiData.priorityGaps.length > 0 && (
            <div className="ai-section-block">
              <div className="ai-section-title-row">
                <AlertCircle size={20} className="ai-section-icon amber" />
                <h3 className="ai-section-title">Priority Skill Gaps</h3>
              </div>
              <div className="priority-gaps-grid">
                {aiData.priorityGaps.map((gap, i) => (
                  <div key={i} className="gap-card">
                    <div className="gap-card-header">
                      <h4 className="gap-skill-name">{gap.skill}</h4>
                      <span className={`priority-badge ${gap.priority?.toLowerCase() || 'medium'}`}>
                        {gap.priority} Priority
                      </span>
                    </div>
                    <p className="gap-reason">{gap.reason}</p>
                    <p className="gap-action">
                      💡 <strong>Suggested Action:</strong> {gap.suggestedAction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TASK 3: KEYWORD IMPROVEMENT SUGGESTIONS */}
          {aiData.keywordSuggestions && aiData.keywordSuggestions.length > 0 && (
            <div className="ai-section-block">
              <div className="ai-section-title-row">
                <TrendingUp size={20} className="ai-section-icon purple" />
                <h3 className="ai-section-title">Keyword Improvement Suggestions</h3>
              </div>
              <div className="keyword-suggestions-list">
                {aiData.keywordSuggestions.map((kw, i) => (
                  <div key={i} className="keyword-suggestion-item">
                    <div className="kw-item-header">
                      <span className="kw-name">{kw.keyword}</span>
                      <span className="kw-section">{kw.sectionSuggestion}</span>
                    </div>
                    <p className="kw-importance">{kw.importance}</p>
                    <p className="kw-tip">
                      📌 <strong>Tip:</strong> {kw.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TASK 4: ACTIONABLE RESUME IMPROVEMENTS */}
          {aiData.improvements && aiData.improvements.length > 0 && (
            <div className="ai-section-block">
              <div className="ai-section-title-row">
                <FileCheck size={20} className="ai-section-icon green" />
                <h3 className="ai-section-title">Improve Your Resume</h3>
              </div>
              <div className="improvements-list">
                {aiData.improvements.map((step, i) => (
                  <div key={i} className="improvement-step">
                    <span className="step-num-badge">{i + 1}</span>
                    <p className="step-text">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TASK 5: STRONGEST MATCHES */}
          {aiData.strengths && aiData.strengths.length > 0 && (
            <div className="ai-section-block">
              <div className="ai-section-title-row">
                <Award size={20} className="ai-section-icon green" />
                <h3 className="ai-section-title">Your Strongest Matches</h3>
              </div>
              <div className="strengths-grid">
                {aiData.strengths.map((item, i) => (
                  <div key={i} className="strength-item-card">
                    <div className="strength-item-header">
                      <CheckCircle2 size={16} className="green" />
                      <span className="strength-name">{item.skill}</span>
                    </div>
                    <p className="strength-desc">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TASK 6: ROLE REQUIREMENT SNAPSHOT */}
          {aiData.roleSnapshot && (
            <div className="ai-section-block">
              <div className="ai-section-title-row">
                <HelpCircle size={20} className="ai-section-icon slate" />
                <h3 className="ai-section-title">Role Requirement Snapshot</h3>
              </div>
              <div className="snapshot-grid">
                {aiData.roleSnapshot.coreSkills?.length > 0 && (
                  <div className="snapshot-col">
                    <span className="snapshot-col-title">Core Skills</span>
                    <div className="snapshot-tags">
                      {aiData.roleSnapshot.coreSkills.map((s, idx) => (
                        <span key={idx} className="snapshot-tag">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {aiData.roleSnapshot.tools?.length > 0 && (
                  <div className="snapshot-col">
                    <span className="snapshot-col-title">Tools & Tech</span>
                    <div className="snapshot-tags">
                      {aiData.roleSnapshot.tools.map((t, idx) => (
                        <span key={idx} className="snapshot-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiInsightsSection;
