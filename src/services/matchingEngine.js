/**
 * HireNova Comprehensive Multi-Factor Matching & Career Intelligence Engine
 * Evaluates Skills, Keywords, Experience, Education, and Project Relevance.
 */

import { SKILL_TAXONOMY } from './mockData';

// Flatten skill database from taxonomy
export const ALL_SKILLS = Array.from(
  new Set(Object.values(SKILL_TAXONOMY).flat())
);

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while',
  'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll',
  'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'will', 'job', 'work', 'candidate', 'role', 'team',
  'experience', 'years', 'ability', 'strong', 'good', 'must', 'should', 'required', 'preferred', 'looking', 'opportunity',
  'responsibilities', 'qualifications', 'requirements', 'apply', 'join', 'company', 'position', 'working'
]);

/**
 * Tokenize text into words
 */
export const tokenize = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
};

/**
 * Compute Term Frequency (TF)
 */
export const computeTF = (tokens) => {
  const tf = {};
  const total = tokens.length || 1;
  tokens.forEach((token) => {
    tf[token] = (tf[token] || 0) + 1;
  });
  Object.keys(tf).forEach((key) => {
    tf[key] = tf[key] / total;
  });
  return tf;
};

/**
 * TF-IDF Cosine Similarity
 */
export const calculateCosineSimilarity = (textA, textB) => {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  const tfA = computeTF(tokensA);
  const tfB = computeTF(tokensB);

  const vocab = new Set([...Object.keys(tfA), ...Object.keys(tfB)]);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  vocab.forEach((term) => {
    const valA = tfA[term] || 0;
    const valB = tfB[term] || 0;
    dot += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  });

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Contextual reason generator for missing skills
 */
const getSkillRationale = (skill, jdText) => {
  const sLower = skill.toLowerCase();
  const cloudSkills = ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'linux', 'bash'];
  const frontendSkills = ['react', 'vue', 'angular', 'next.js', 'typescript', 'tailwind', 'html5', 'css3', 'figma'];
  const backendSkills = ['node.js', 'express', 'python', 'java', 'postgresql', 'mongodb', 'redis', 'graphql', 'rest api', 'sql'];
  const dataSkills = ['machine learning', 'pytorch', 'tensorflow', 'pandas', 'numpy', 'scikit-learn', 'tableau', 'power bi'];

  if (cloudSkills.includes(sLower)) {
    return `${skill} is essential for automating deployments, managing container orchestration, and cloud infrastructure scalability.`;
  }
  if (frontendSkills.includes(sLower)) {
    return `${skill} is required to construct performant, interactive, and responsive user interfaces.`;
  }
  if (backendSkills.includes(sLower)) {
    return `${skill} is necessary for data modeling, secure API routing, and high-throughput server architecture.`;
  }
  if (dataSkills.includes(sLower)) {
    return `${skill} is critical for statistical modeling, large dataset transformations, and predictive accuracy.`;
  }
  return `${skill} is explicitly emphasized in the job description requirements for this role.`;
};

/**
 * Generate actionable, prioritized resume improvements
 */
export const generateResumeSuggestions = (resumeText, jdText, matchStats) => {
  const suggestions = [];
  const rLower = (resumeText || '').toLowerCase();
  const jdLower = (jdText || '').toLowerCase();

  // 1. Missing Critical Skills Check
  if (matchStats.missingSkills && matchStats.missingSkills.length > 0) {
    const topMissing = matchStats.missingSkills.slice(0, 3).join(', ');
    suggestions.push({
      id: 'imp-skills',
      priority: 'High',
      category: 'Skill Alignment',
      title: `Bridge Critical Skill Gaps: ${topMissing}`,
      description: `The job description heavily relies on ${topMissing}. If you have practical project experience with these tools, add them explicitly under your Skills and Projects sections. If not, follow the recommended learning path below.`,
      action: 'Add to Skills or complete a bridging project'
    });
  }

  // 2. Metrics & Quantifiable Achievements Check
  const metricRegex = /\b(\d+%|\$\d+|\d+\+?\s*(users|clients|requests|ms|seconds|hours|x|times))\b/i;
  if (!metricRegex.test(resumeText)) {
    suggestions.push({
      id: 'imp-metrics',
      priority: 'High',
      category: 'Impact & Quantification',
      title: 'Incorporate Quantifiable Achievements (X-Y-Z Formula)',
      description: 'Your resume descriptions are mostly task-oriented. ATS systems and hiring managers favor resumes with measurable outcomes (e.g. "Reduced API latency by 35% through Redis caching").',
      action: 'Add percentages, time saved, or user numbers to bullet points'
    });
  }

  // 3. Professional Summary Polish
  if (!rLower.includes('summary') && !rLower.includes('profile') && !rLower.includes('objective')) {
    suggestions.push({
      id: 'imp-summary',
      priority: 'Medium',
      category: 'ATS Structure',
      title: 'Add a Targeted 3-Line Professional Summary',
      description: 'Resumes with a crisp header summary matching the target job title ("Cloud Engineer with 3+ years...") parse with higher keyword density in recruiter searches.',
      action: 'Place summary directly beneath your contact details'
    });
  }

  // 4. Missing Keywords Check
  if (matchStats.missingKeywords && matchStats.missingKeywords.length > 0) {
    const topKeywords = matchStats.missingKeywords.slice(0, 4).join(', ');
    suggestions.push({
      id: 'imp-keywords',
      priority: 'Medium',
      category: 'Keyword Density',
      title: `Integrate High-Frequency Industry Keywords`,
      description: `Target keywords like "${topKeywords}" appear frequently in the job description. Contextually integrate them into your work experience or project writeups where accurate.`,
      action: 'Sprinkle relevant keywords into bullet descriptions'
    });
  }

  // 5. Action Verb Variety
  const actionVerbs = ['architected', 'spearheaded', 'engineered', 'optimized', 'deployed', 'orchestrated', 'automated'];
  const hasActionVerbs = actionVerbs.some((v) => rLower.includes(v));
  if (!hasActionVerbs) {
    suggestions.push({
      id: 'imp-verbs',
      priority: 'Low',
      category: 'Action Verbs',
      title: 'Upgrade Passive Phrases to High-Impact Action Verbs',
      description: 'Replace phrases like "Responsible for" or "Worked on" with strong action verbs like "Architected", "Automated", "Engineered", and "Deployed".',
      action: 'Revise starting verbs in experience bullet points'
    });
  }

  return suggestions;
};

/**
 * Main Deterministic Matching Algorithm
 * Calculates multi-factor ATS Match Score:
 * Overall Score = 35% Skills + 25% Keywords + 15% Experience + 15% Education + 10% Project Relevance
 */
export const calculateComprehensiveMatch = (resumeText = '', jobDescription = '', structuredResume = null) => {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // 1. Skill Extraction from JD and Resume
  const detectedJdSkills = [];
  const requiredSkills = [];
  const preferredSkills = [];
  const jdSentences = jobDescription.split(/[.\n]+/);

  ALL_SKILLS.forEach((skill) => {
    const skillLower = skill.toLowerCase();
    const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

    if (regex.test(jdLower)) {
      detectedJdSkills.push(skill);

      const matchSentence = jdSentences.find((s) => s.toLowerCase().includes(skillLower)) || '';
      const sLower = matchSentence.toLowerCase();

      if (
        sLower.includes('required') ||
        sLower.includes('must have') ||
        sLower.includes('essential') ||
        sLower.includes('qualification') ||
        sLower.includes('minimum')
      ) {
        requiredSkills.push(skill);
      } else if (
        sLower.includes('preferred') ||
        sLower.includes('nice to have') ||
        sLower.includes('plus') ||
        sLower.includes('bonus')
      ) {
        preferredSkills.push(skill);
      } else {
        requiredSkills.push(skill);
      }
    }
  });

  const matchedSkills = [];
  const missingSkills = [];

  detectedJdSkills.forEach((skill) => {
    const skillLower = skill.toLowerCase();
    const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

    if (regex.test(resumeLower)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const skillMatchPercentage =
    detectedJdSkills.length > 0
      ? Math.round((matchedSkills.length / detectedJdSkills.length) * 100)
      : 85;

  // 2. Keyword Extraction & Coverage
  const jdTokens = tokenize(jobDescription);
  const resumeTokens = new Set(tokenize(resumeText));

  const termCounts = {};
  jdTokens.forEach((t) => {
    termCounts[t] = (termCounts[t] || 0) + 1;
  });

  const topJdKeywords = Object.keys(termCounts)
    .sort((a, b) => termCounts[b] - termCounts[a])
    .slice(0, 12);

  const matchedKeywords = [];
  const missingKeywords = [];

  topJdKeywords.forEach((kw) => {
    if (resumeTokens.has(kw) || resumeLower.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordMatchPercentage =
    topJdKeywords.length > 0
      ? Math.round((matchedKeywords.length / topJdKeywords.length) * 100)
      : 80;

  // 3. Experience Match Heuristics
  let experienceMatchPercentage = 75;
  const yearsMatch = jdLower.match(/(\d+)\+?\s*years?/i);
  const requiredYears = yearsMatch ? parseInt(yearsMatch[1], 10) : 2;

  const resumeYearsMatch = resumeLower.match(/(\d+)\+?\s*years?/i);
  const resumeYears = resumeYearsMatch ? parseInt(resumeYearsMatch[1], 10) : 3;

  if (resumeYears >= requiredYears) {
    experienceMatchPercentage = 95;
  } else if (resumeYears >= requiredYears - 1) {
    experienceMatchPercentage = 80;
  } else {
    experienceMatchPercentage = 60;
  }

  // 4. Education Match Heuristics
  let educationMatchPercentage = 85;
  const degrees = ['bachelor', 'master', 'phd', 'b.s.', 'm.s.', 'b.tech', 'computer science', 'engineering', 'degree'];
  const jdHasDegree = degrees.some((d) => jdLower.includes(d));
  const resumeHasDegree = degrees.some((d) => resumeLower.includes(d));

  if (!jdHasDegree || (jdHasDegree && resumeHasDegree)) {
    educationMatchPercentage = 95;
  } else {
    educationMatchPercentage = 70;
  }

  // 5. Project Relevance & TF-IDF Cosine Similarity
  const cosine = calculateCosineSimilarity(resumeText, jobDescription);
  const projectRelevancePercentage = Math.min(100, Math.max(30, Math.round(cosine * 100 * 1.35)));

  // 6. Final Normalized Weighted ATS Match Score
  // Weighted: 35% Skills + 25% Keywords + 15% Experience + 15% Education + 10% Project Relevance
  const rawScore =
    0.35 * skillMatchPercentage +
    0.25 * keywordMatchPercentage +
    0.15 * experienceMatchPercentage +
    0.15 * educationMatchPercentage +
    0.10 * projectRelevancePercentage;

  const overallScore = Math.min(100, Math.max(25, Math.round(rawScore)));

  let matchGrade = 'Strong Match';
  let badgeColor = 'emerald';
  if (overallScore < 50) {
    matchGrade = 'Skill Gap Detected';
    badgeColor = 'rose';
  } else if (overallScore < 70) {
    matchGrade = 'Moderate Alignment';
    badgeColor = 'amber';
  } else if (overallScore < 85) {
    matchGrade = 'Good ATS Fit';
    badgeColor = 'indigo';
  }

  // Format missing skills with rationale and actionable guidance
  const detailedMissingSkills = missingSkills.map((skill) => ({
    name: skill,
    priority: requiredSkills.includes(skill) ? 'Critical' : 'Recommended',
    whyRelevant: getSkillRationale(skill, jobDescription),
    suggestions: [
      `Complete a practical project utilizing ${skill}`,
      `Follow standard online certification or sandbox tutorials`,
      `Add truthful experience bullet points once proficiency is acquired`
    ]
  }));

  const detailedMissingKeywords = missingKeywords.map((kw) => ({
    keyword: kw,
    relevance: `Frequently occurs in job responsibilities for this opening`,
    tip: `Incorporate "${kw}" naturally in your experience descriptions or summary if applicable.`
  }));

  const stats = {
    overallScore,
    matchGrade,
    badgeColor,
    skillMatch: skillMatchPercentage,
    keywordMatch: keywordMatchPercentage,
    experienceMatch: experienceMatchPercentage,
    educationMatch: educationMatchPercentage,
    projectRelevance: projectRelevancePercentage,
    matchedSkills,
    missingSkills,
    detailedMissingSkills,
    requiredSkills,
    preferredSkills,
    matchedKeywords,
    missingKeywords,
    detailedMissingKeywords
  };

  const suggestions = generateResumeSuggestions(resumeText, jobDescription, stats);

  return {
    ...stats,
    suggestions
  };
};
