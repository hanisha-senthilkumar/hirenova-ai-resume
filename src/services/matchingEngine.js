/**
 * HireNova Phase 3 & 4 Deterministic Matching Engine
 * Calculates TF-IDF Cosine Similarity, Skill Match Coverage, and Keyword Alignment.
 */

// Common English Stopwords to filter out
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
  'experience', 'years', 'ability', 'strong', 'good', 'must', 'should', 'required', 'preferred', 'looking', 'opportunity'
]);

// Comprehensive Tech & Career Skill Knowledge Base
const SKILL_DATABASE = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', '.NET', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
  'HTML', 'HTML5', 'CSS', 'CSS3', 'Sass', 'Tailwind', 'TailwindCSS', 'Bootstrap', 'React', 'React.js', 'Next.js',
  'Vue', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Express.js', 'Spring Boot', 'Spring', 'Django', 'Flask',
  'FastAPI', 'ASP.NET', 'GraphQL', 'REST API', 'RESTful API', 'SQL', 'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB',
  'Redis', 'Elasticsearch', 'DynamoDB', 'Firebase', 'Supabase', 'AWS', 'Amazon Web Services', 'Azure', 'GCP',
  'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub', 'GitLab', 'Linux', 'Bash', 'Shell', 'DevOps',
  'Agile', 'Scrum', 'Jira', 'Figma', 'UI/UX', 'Microservices', 'Unit Testing', 'Jest', 'Cypress', 'PyTest',
  'Machine Learning', 'Deep Learning', 'AI', 'Artificial Intelligence', 'TensorFlow', 'PyTorch', 'Scikit-learn',
  'Pandas', 'NumPy', 'Data Analysis', 'Data Science', 'Big Data', 'Hadoop', 'Spark', 'Tableau', 'Power BI',
  'Communication', 'Problem Solving', 'Teamwork', 'Leadership', 'Project Management', 'System Design'
];

/**
 * Tokenize text into lowercase words/terms
 */
const tokenize = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
};

/**
 * Compute Term Frequency (TF) dictionary for tokens
 */
const computeTF = (tokens) => {
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
 * Calculate Cosine Similarity between Resume and Job Description using TF-IDF vectors
 */
export const calculateCosineSimilarity = (resumeText, jdText) => {
  const resumeTokens = tokenize(resumeText);
  const jdTokens = tokenize(jdText);

  const resumeTF = computeTF(resumeTokens);
  const jdTF = computeTF(jdTokens);

  // Combine unique vocabulary
  const vocab = new Set([...Object.keys(resumeTF), ...Object.keys(jdTF)]);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  vocab.forEach((term) => {
    const valA = resumeTF[term] || 0;
    const valB = jdTF[term] || 0;

    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  });

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return parseFloat(Math.min(1, Math.max(0, similarity)).toFixed(3));
};

/**
 * Main Deterministic Matching Function
 */
export const calculateMatchResults = (resumeText, jobDescription) => {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // 1. Skill Extraction & Categorization
  const detectedJdSkills = [];
  const requiredSkills = [];
  const preferredSkills = [];

  // Identify required vs preferred section sentences in JD
  const jdLines = jobDescription.split(/\n+|\./);

  SKILL_DATABASE.forEach((skill) => {
    const skillLower = skill.toLowerCase();
    const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

    if (regex.test(jdLower)) {
      detectedJdSkills.push(skill);

      // Check if sentence indicates required vs preferred
      const matchingLine = jdLines.find((line) => line.toLowerCase().includes(skillLower)) || '';
      const lineLower = matchingLine.toLowerCase();

      if (
        lineLower.includes('required') ||
        lineLower.includes('must have') ||
        lineLower.includes('essential') ||
        lineLower.includes('qualification') ||
        lineLower.includes('minimum')
      ) {
        requiredSkills.push(skill);
      } else if (
        lineLower.includes('preferred') ||
        lineLower.includes('nice to have') ||
        lineLower.includes('plus') ||
        lineLower.includes('desired')
      ) {
        preferredSkills.push(skill);
      } else {
        // Default to required if uncategorized
        requiredSkills.push(skill);
      }
    }
  });

  // Filter skills against Resume text
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

  const skillCoverage =
    detectedJdSkills.length > 0
      ? Math.round((matchedSkills.length / detectedJdSkills.length) * 100)
      : 100;

  // 2. Keyword Extraction & Matching
  const jdTokens = tokenize(jobDescription);
  const resumeTokens = new Set(tokenize(resumeText));

  // Extract top recurring terms from JD
  const termCounts = {};
  jdTokens.forEach((t) => {
    termCounts[t] = (termCounts[t] || 0) + 1;
  });

  const topJdKeywords = Object.keys(termCounts)
    .sort((a, b) => termCounts[b] - termCounts[a])
    .slice(0, 15);

  const matchedKeywords = [];
  const missingKeywords = [];

  topJdKeywords.forEach((kw) => {
    if (resumeTokens.has(kw) || resumeLower.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordCoverage =
    topJdKeywords.length > 0
      ? Math.round((matchedKeywords.length / topJdKeywords.length) * 100)
      : 100;

  // 3. Cosine Similarity via TF-IDF
  const cosineSim = calculateCosineSimilarity(resumeText, jobDescription);
  const textSimilarityScore = Math.round(cosineSim * 100);

  // 4. Final Weighted Match Score (45% Skill + 25% Keyword + 30% Cosine Similarity)
  const overallScore = Math.min(
    100,
    Math.max(0, Math.round(0.45 * skillCoverage + 0.25 * keywordCoverage + 0.30 * textSimilarityScore))
  );

  // Score alignment label
  let scoreLabel = 'Weak Match';
  if (overallScore >= 80) scoreLabel = 'Strong Match';
  else if (overallScore >= 60) scoreLabel = 'Moderate Match';
  else if (overallScore >= 40) scoreLabel = 'Partial Match';

  return {
    overallScore,
    scoreLabel,
    skillCoverage,
    keywordCoverage,
    textSimilarity: textSimilarityScore,
    matchedSkills,
    missingSkills,
    requiredSkills,
    preferredSkills,
    matchedKeywords,
    missingKeywords
  };
};
