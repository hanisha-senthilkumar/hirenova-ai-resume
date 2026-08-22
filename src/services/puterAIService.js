import { validateAndParseAiResponse } from '../utils/aiResponseValidator';

/**
 * Service for generating Puter AI powered explanations and career guidance.
 * Does NOT calculate or alter official match scores.
 */
export const generateAiCareerInsights = async (resumeText, jobDescription, matchResult) => {
  if (!window.puter || !window.puter.ai || typeof window.puter.ai.chat !== 'function') {
    throw new Error('Puter AI service is unavailable in this environment.');
  }

  // Construct context payload from deterministic matching results
  const context = {
    resumeTextSnippet: resumeText.substring(0, 1500),
    jobDescriptionSnippet: jobDescription.substring(0, 1500),
    overallScore: matchResult.overallScore,
    scoreLabel: matchResult.scoreLabel,
    skillCoverage: matchResult.skillCoverage,
    keywordCoverage: matchResult.keywordCoverage,
    textSimilarity: matchResult.textSimilarity,
    matchedSkills: matchResult.matchedSkills,
    missingSkills: matchResult.missingSkills,
    matchedKeywords: matchResult.matchedKeywords,
    missingKeywords: matchResult.missingKeywords,
    requiredSkills: matchResult.requiredSkills,
    preferredSkills: matchResult.preferredSkills
  };

  const systemPrompt = `
You are HireNova's career intelligence assistant.
Analyze the supplied resume snippet and job description snippet using ONLY the provided deterministic match data.
The official match score of ${context.overallScore}% (${context.scoreLabel}) has ALREADY been calculated by a deterministic matching engine.
DO NOT recalculate, invent, or modify the overall score.

Your task is to explain the score, prioritize skill gaps, and suggest genuine resume improvements.

RULES:
1. Never invent candidate experience or candidate skills.
2. Never invent job requirements.
3. Never change or recalculate the algorithmic score (${context.overallScore}%).
4. Never claim hiring probability or guaranteed ATS success.
5. Never recommend falsely adding skills. Always use phrasing like "If you genuinely have experience with..." or "If you used...".
6. Return ONLY a valid JSON object matching the exact schema below.

JSON SCHEMA:
{
  "summary": "Clear explanation of why the resume received ${context.overallScore}%, highlighting key positive alignment and main reduction gaps.",
  "strengths": [
    { "skill": "SkillName", "explanation": "Why this skill contributes positively" }
  ],
  "priorityGaps": [
    {
      "skill": "MissingSkillName",
      "priority": "High" | "Medium" | "Low",
      "reason": "Why this gap matters based on job requirements",
      "suggestedAction": "If you genuinely have experience with MissingSkillName, mention it in your Experience or Projects section."
    }
  ],
  "keywordSuggestions": [
    {
      "keyword": "MissingKeyword",
      "importance": "Relevance to this job description",
      "sectionSuggestion": "Projects / Skills section",
      "tip": "If you genuinely used MissingKeyword, consider adding it to your resume."
    }
  ],
  "improvements": [
    "Actionable recommendation 1",
    "Actionable recommendation 2",
    "Actionable recommendation 3",
    "Actionable recommendation 4",
    "Actionable recommendation 5"
  ],
  "roleSnapshot": {
    "coreSkills": ["Skill1", "Skill2"],
    "supportingSkills": ["Skill3"],
    "tools": ["Tool1"],
    "responsibilities": ["Key responsibility from JD"]
  },
  "readinessLabel": "Strongly Aligned" | "Mostly Aligned" | "Needs Improvement" | "Significant Skill Gaps"
}

INPUT DATA:
${JSON.stringify(context, null, 2)}
`;

  try {
    const aiResponse = await window.puter.ai.chat(systemPrompt);
    const resultText = typeof aiResponse === 'string' ? aiResponse : aiResponse?.message?.content || JSON.stringify(aiResponse);

    return validateAndParseAiResponse(resultText, matchResult);
  } catch (err) {
    console.error('Puter AI API call error:', err);
    throw new Error('Puter AI service encountered an error. Calculated match results remain available.');
  }
};
