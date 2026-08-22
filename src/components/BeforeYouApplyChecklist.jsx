import React from 'react';
import { CheckCircle2, AlertCircle, ListChecks } from 'lucide-react';
import './BeforeYouApplyChecklist.css';

const BeforeYouApplyChecklist = ({ matchResult, fileName }) => {
  if (!matchResult) return null;

  const {
    matchedSkills = [],
    missingSkills = [],
    requiredSkills = [],
    missingKeywords = []
  } = matchResult;

  const missingRequired = missingSkills.filter((s) => requiredSkills.includes(s));
  const hasMissingReq = missingRequired.length > 0;
  const hasMissingKw = missingKeywords.length > 0;

  return (
    <div className="hn-card glass-card checklist-card animate-fade-in">
      <div className="section-card-header">
        <ListChecks size={20} className="header-icon-primary" />
        <div>
          <h3 className="section-card-title">Before You Apply</h3>
          <p className="section-card-sub">Pre-application checklist based on your resume analysis.</p>
        </div>
      </div>

      <div className="checklist-items-grid">
        {/* Item 1 */}
        <div className="checklist-item pass">
          <CheckCircle2 size={18} className="item-icon-green" />
          <div className="item-text-group">
            <span className="item-title">Resume uploaded successfully</span>
            <span className="item-desc">{fileName || 'Resume file processed'}</span>
          </div>
        </div>

        {/* Item 2 */}
        <div className="checklist-item pass">
          <CheckCircle2 size={18} className="item-icon-green" />
          <div className="item-text-group">
            <span className="item-title">Job description analyzed</span>
            <span className="item-desc">Extracted core skills, qualifications and terminology</span>
          </div>
        </div>

        {/* Item 3 */}
        <div className={`checklist-item ${matchedSkills.length > 0 ? 'pass' : 'warn'}`}>
          {matchedSkills.length > 0 ? (
            <CheckCircle2 size={18} className="item-icon-green" />
          ) : (
            <AlertCircle size={18} className="item-icon-amber" />
          )}
          <div className="item-text-group">
            <span className="item-title">
              {matchedSkills.length > 0
                ? `${matchedSkills.length} core skills matched`
                : 'Limited skill overlap detected'}
            </span>
            <span className="item-desc">
              {matchedSkills.length > 0
                ? `Demonstrated alignment in: ${matchedSkills.slice(0, 3).join(', ')}`
                : 'Consider reviewing the job description requirements.'}
            </span>
          </div>
        </div>

        {/* Item 4 */}
        <div className={`checklist-item ${hasMissingReq ? 'warn' : 'pass'}`}>
          {hasMissingReq ? (
            <AlertCircle size={18} className="item-icon-red" />
          ) : (
            <CheckCircle2 size={18} className="item-icon-green" />
          )}
          <div className="item-text-group">
            <span className="item-title">
              {hasMissingReq
                ? `${missingRequired.length} required skill gap${missingRequired.length > 1 ? 's' : ''} need attention`
                : 'No major required skill gaps detected'}
            </span>
            <span className="item-desc">
              {hasMissingReq
                ? `Missing: ${missingRequired.slice(0, 3).join(', ')}. If you genuinely have experience, add them.`
                : 'Your resume covers the primary skills listed in the posting.'}
            </span>
          </div>
        </div>

        {/* Item 5 */}
        <div className={`checklist-item ${hasMissingKw ? 'warn' : 'pass'}`}>
          {hasMissingKw ? (
            <AlertCircle size={18} className="item-icon-amber" />
          ) : (
            <CheckCircle2 size={18} className="item-icon-green" />
          )}
          <div className="item-text-group">
            <span className="item-title">
              {hasMissingKw ? 'Consider improving job-specific terminology' : 'Key terminology matches well'}
            </span>
            <span className="item-desc">
              {hasMissingKw
                ? `If you genuinely used terms like "${missingKeywords.slice(0, 2).join(', ')}", incorporate them.`
                : 'Strong keyword alignment across project and experience sections.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeYouApplyChecklist;
