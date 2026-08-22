import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Key, Layers, Search } from 'lucide-react';
import './SkillsKeywordsResults.css';

const SkillsKeywordsResults = ({ matchResult }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!matchResult) return null;

  const {
    matchedSkills = [],
    missingSkills = [],
    requiredSkills = [],
    preferredSkills = [],
    matchedKeywords = [],
    missingKeywords = []
  } = matchResult;

  // Filter missing skills into required vs preferred
  const missingRequired = missingSkills.filter((s) => requiredSkills.includes(s));
  const missingPreferred = missingSkills.filter((s) => preferredSkills.includes(s) || !requiredSkills.includes(s));

  // Keyword filtering logic
  const filteredMatchedKw = matchedKeywords.filter((kw) =>
    kw.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredMissingKw = missingKeywords.filter((kw) =>
    kw.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="skills-keywords-container animate-fade-in">
      <div className="grid-responsive-2">
        {/* MATCHED SKILLS CARD */}
        <div className="hn-card glass-card skills-result-card">
          <div className="section-card-header">
            <CheckCircle2 size={20} className="header-icon-green" />
            <h3 className="section-card-title">Skills You Already Match ({matchedSkills.length})</h3>
          </div>

          <div className="pills-container">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill, i) => (
                <span key={i} className="skill-pill matched-pill">
                  <CheckCircle2 size={13} />
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <p className="empty-pills-text">No matching skills were detected.</p>
            )}
          </div>
        </div>

        {/* MISSING SKILLS CARD */}
        <div className="hn-card glass-card skills-result-card">
          <div className="section-card-header">
            <AlertTriangle size={20} className="header-icon-amber" />
            <h3 className="section-card-title">Skills Missing From Your Resume ({missingSkills.length})</h3>
          </div>

          {missingRequired.length > 0 && (
            <div className="skill-subgroup">
              <span className="subgroup-label required">Required Skills (High Priority):</span>
              <div className="pills-container">
                {missingRequired.map((skill, i) => (
                  <span key={i} className="skill-pill missing-required-pill">
                    <span>{skill}</span>
                    <span className="status-tag">Missing</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingPreferred.length > 0 && (
            <div className="skill-subgroup">
              <span className="subgroup-label preferred">Preferred Skills (Medium Priority):</span>
              <div className="pills-container">
                {missingPreferred.map((skill, i) => (
                  <span key={i} className="skill-pill missing-preferred-pill">
                    <span>{skill}</span>
                    <span className="status-tag">Missing</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingSkills.length === 0 && (
            <p className="empty-pills-text green-text">✓ All required job skills detected in your resume!</p>
          )}
        </div>
      </div>

      {/* KEYWORD COMPARISON SECTION WITH SEARCH FILTER */}
      <div className="hn-card glass-card keyword-section-wrapper">
        <div className="keyword-section-header">
          <div className="section-card-header">
            <Key size={20} className="header-icon-purple" />
            <div>
              <h3 className="section-card-title">Keyword Comparison</h3>
              <p className="section-card-sub">Job-specific technical terms and n-grams comparison.</p>
            </div>
          </div>

          <div className="keyword-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="keyword-search-input"
            />
          </div>
        </div>

        <div className="grid-responsive-2 keywords-grid">
          {/* MATCHED KEYWORDS CARD */}
          <div className="keywords-result-card">
            <div className="sub-card-header">
              <span className="sub-title">Matched Keywords ({filteredMatchedKw.length})</span>
            </div>
            <div className="pills-container">
              {filteredMatchedKw.length > 0 ? (
                filteredMatchedKw.map((kw, i) => (
                  <span key={i} className="keyword-pill matched-kw-pill">
                    <span>{kw}</span>
                  </span>
                ))
              ) : (
                <p className="empty-pills-text">
                  {searchTerm ? 'No matching search terms.' : 'No key terms matched.'}
                </p>
              )}
            </div>
          </div>

          {/* MISSING KEYWORDS CARD */}
          <div className="keywords-result-card">
            <div className="sub-card-header">
              <span className="sub-title">Missing Keywords ({filteredMissingKw.length})</span>
            </div>
            <div className="pills-container">
              {filteredMissingKw.length > 0 ? (
                filteredMissingKw.map((kw, i) => (
                  <span key={i} className="keyword-pill missing-kw-pill">
                    <span>{kw}</span>
                  </span>
                ))
              ) : (
                <p className="empty-pills-text green-text">
                  {searchTerm ? 'No matching search terms.' : '✓ All top JD keywords present!'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsKeywordsResults;
