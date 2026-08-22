import React from 'react';
import { AlertTriangle, ArrowUpRight, Lightbulb } from 'lucide-react';
import './TopSkillsToImprove.css';

const TopSkillsToImprove = ({ matchResult, aiData }) => {
  if (!matchResult) return null;

  const { missingSkills = [], requiredSkills = [], preferredSkills = [], missingKeywords = [] } = matchResult;

  // Prioritize gaps: 1. Required Missing, 2. Preferred Missing, 3. Keywords Missing
  const missingRequired = missingSkills.filter((s) => requiredSkills.includes(s));
  const missingPreferred = missingSkills.filter((s) => preferredSkills.includes(s) || !requiredSkills.includes(s));

  // Build prioritized list
  const gapList = [];

  missingRequired.forEach((skill) => {
    const aiGap = aiData?.priorityGaps?.find((g) => g.skill?.toLowerCase() === skill.toLowerCase());
    gapList.push({
      skill,
      type: 'Required Skill',
      priority: 'High',
      reason: aiGap?.reason || `Core skill explicitly required by the job posting.`,
      action: aiGap?.suggestedAction || `If you genuinely have experience with ${skill}, highlight it in your Skills or Experience section.`
    });
  });

  missingPreferred.forEach((skill) => {
    const aiGap = aiData?.priorityGaps?.find((g) => g.skill?.toLowerCase() === skill.toLowerCase());
    gapList.push({
      skill,
      type: 'Preferred Skill',
      priority: 'Medium',
      reason: aiGap?.reason || `Nice-to-have skill listed in the job description.`,
      action: aiGap?.suggestedAction || `If you have worked with ${skill}, mention relevant projects or tools.`
    });
  });

  missingKeywords.slice(0, 3).forEach((kw) => {
    if (!gapList.some((g) => g.skill.toLowerCase() === kw.toLowerCase())) {
      const aiKw = aiData?.keywordSuggestions?.find((k) => k.keyword?.toLowerCase() === kw.toLowerCase());
      gapList.push({
        skill: kw,
        type: 'Key Terminology',
        priority: 'Low',
        reason: aiKw?.importance || `Appears frequently in job description requirements.`,
        action: aiKw?.tip || `If you genuinely used ${kw}, consider adding it to your resume.`
      });
    }
  });

  if (gapList.length === 0) {
    return (
      <div className="hn-card glass-card top-gaps-card animate-fade-in">
        <div className="section-card-header">
          <AlertTriangle size={20} className="header-icon-green" />
          <h3 className="section-card-title">Top Skills to Improve</h3>
        </div>
        <p className="no-gaps-text">✓ Great job! No major skill gaps were detected for this job description.</p>
      </div>
    );
  }

  return (
    <div className="hn-card glass-card top-gaps-card animate-fade-in">
      <div className="section-card-header">
        <AlertTriangle size={20} className="header-icon-amber" />
        <div>
          <h3 className="section-card-title">Top Skills to Improve</h3>
          <p className="section-card-sub">Prioritized list of skill and keyword gaps to address first.</p>
        </div>
      </div>

      <div className="gaps-items-list">
        {gapList.slice(0, 5).map((gap, i) => (
          <div key={i} className="gap-item-row">
            <div className="gap-item-header">
              <div className="gap-name-group">
                <span className="gap-num-circle">{i + 1}</span>
                <h4 className="gap-item-title">{gap.skill}</h4>
                <span className="gap-type-tag">{gap.type}</span>
              </div>
              <span className={`priority-pill ${gap.priority.toLowerCase()}`}>
                {gap.priority} Priority
              </span>
            </div>

            <p className="gap-item-reason">{gap.reason}</p>

            <div className="gap-item-action">
              <Lightbulb size={14} className="action-lightbulb" />
              <span>{gap.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSkillsToImprove;
