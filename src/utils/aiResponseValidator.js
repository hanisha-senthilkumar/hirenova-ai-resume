/**
 * Validates and parses structured JSON output from Puter AI.
 * Provides safe fallback values if Puter AI returns malformed or incomplete data.
 */

export const validateAndParseAiResponse = (rawResponse, matchResult) => {
  if (!rawResponse) {
    throw new Error('Empty AI response received');
  }

  let parsed = null;

  try {
    if (typeof rawResponse === 'object') {
      parsed = rawResponse;
    } else if (typeof rawResponse === 'string') {
      // Clean up markdown codeblocks ```json ... ``` if present
      const cleaned = rawResponse
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      parsed = JSON.parse(cleaned);
    }
  } catch (err) {
    console.warn('AI Response JSON parsing failed, attempting extract:', err);
    // Fallback: try finding first '{' and last '}'
    try {
      const match = rawResponse.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    } catch (e) {
      console.error('Secondary JSON extraction failed:', e);
    }
  }

  // Safe fallback defaults based on actual deterministic match results
  const missingRequired = matchResult?.missingSkills || [];
  const matchedList = matchResult?.matchedSkills || [];

  const defaultSummary = parsed?.summary || 
    `Your resume received a ${matchResult?.overallScore}% (${matchResult?.scoreLabel}) alignment score. ` +
    `Strengths include ${matchedList.slice(0, 3).join(', ') || 'general qualifications'}, ` +
    `while gaps in ${missingRequired.slice(0, 3).join(', ') || 'specific requirements'} reduce overall fit.`;

  const defaultStrengths = Array.isArray(parsed?.strengths) && parsed.strengths.length > 0
    ? parsed.strengths
    : matchedList.map(skill => ({
        skill,
        explanation: `Demonstrated alignment in ${skill} based on resume content.`
      }));

  const defaultPriorityGaps = Array.isArray(parsed?.priorityGaps) && parsed.priorityGaps.length > 0
    ? parsed.priorityGaps
    : missingRequired.map((skill, i) => ({
        skill,
        priority: i < 2 ? 'High' : 'Medium',
        reason: `${skill} is listed as a target requirement in the job description.`,
        suggestedAction: `If you have genuine experience with ${skill}, highlight it in your Skills or Experience section.`
      }));

  const defaultKeywordSuggestions = Array.isArray(parsed?.keywordSuggestions) && parsed.keywordSuggestions.length > 0
    ? parsed.keywordSuggestions
    : (matchResult?.missingKeywords || []).map(kw => ({
        keyword: kw,
        importance: `Appears in key job description requirements.`,
        sectionSuggestion: `Projects / Skills section`,
        tip: `If you genuinely used ${kw}, consider adding it to your resume to increase keyword coverage.`
      }));

  const defaultImprovements = Array.isArray(parsed?.improvements) && parsed.improvements.length > 0
    ? parsed.improvements
    : [
        `Highlight core skills (${matchedList.slice(0, 2).join(', ')}) closer to the top of your resume.`,
        `If you have genuine experience with missing skills (${missingRequired.slice(0, 2).join(', ')}), incorporate them into relevant project descriptions.`,
        `Ensure technical terminology matches the target job description exact phrasing.`,
        `Include measurable outcomes and metrics in your project descriptions where available.`,
        `Tailor project section headings to emphasize key role requirements.`
      ];

  const defaultRoleSnapshot = parsed?.roleSnapshot || {
    coreSkills: matchResult?.requiredSkills?.slice(0, 4) || [],
    supportingSkills: matchResult?.preferredSkills?.slice(0, 4) || [],
    tools: matchedList.slice(0, 4),
    responsibilities: ['Execute key technical requirements outlined in the job description.']
  };

  const defaultReadiness = parsed?.readinessLabel || 
    (matchResult?.overallScore >= 80 ? 'Strongly Aligned' :
     matchResult?.overallScore >= 60 ? 'Mostly Aligned' :
     matchResult?.overallScore >= 40 ? 'Needs Improvement' : 'Significant Skill Gaps');

  return {
    summary: defaultSummary,
    strengths: defaultStrengths,
    priorityGaps: defaultPriorityGaps,
    keywordSuggestions: defaultKeywordSuggestions,
    improvements: defaultImprovements,
    roleSnapshot: defaultRoleSnapshot,
    readinessLabel: defaultReadiness
  };
};
