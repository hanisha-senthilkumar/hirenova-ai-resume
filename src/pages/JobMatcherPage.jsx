import React, { useState, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { extractResumeText, formatFileSize } from '../utils/pdfExtractor';
import { calculateComprehensiveMatch } from '../services/matchingEngine';
import { INITIAL_JOBS, SAMPLE_RESUMES } from '../services/mockData';
import PageHeader from '../components/PageHeader';
import ResumeEditModal from '../components/ResumeEditModal';
import AtsResumeDocument from '../components/AtsResumeDocument';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Edit3,
  Bookmark,
  Layers,
  HelpCircle,
  TrendingUp,
  Award,
  BookOpen,
  Download,
  Check,
  FileCheck,
  File,
  Eye
} from 'lucide-react';
import './JobMatcherPage.css';

const JobMatcherPage = () => {
  const { profile, structuredResume, updateStructuredResume } = useProfile();

  // Uploaded file metadata & active file state
  const [uploadedFileObj, setUploadedFileObj] = useState(null);
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const pdfPrintRef = useRef(null);

  // Resume text state
  const [resumeText, setResumeText] = useState(() => {
    return structuredResume?.summary
      ? `${structuredResume.name}\n${structuredResume.title}\n${structuredResume.summary}\nSkills: ${structuredResume.skills?.join(', ')}`
      : '';
  });

  const [jobDescription, setJobDescription] = useState(INITIAL_JOBS[0].description);
  const [targetJobTitle, setTargetJobTitle] = useState(INITIAL_JOBS[0].title);
  const [selectedJobId, setSelectedJobId] = useState(INITIAL_JOBS[0].id);

  // Status & modal states
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parseStatus, setParseStatus] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const [matchResult, setMatchResult] = useState(() => {
    const defaultResume = `${structuredResume.name}\n${structuredResume.title}\n${structuredResume.summary}\nSkills: ${structuredResume.skills?.join(', ')}`;
    return calculateComprehensiveMatch(defaultResume, INITIAL_JOBS[0].description, structuredResume);
  });

  // Handle Process File (works for file input & drag and drop)
  const processUploadedFile = async (file) => {
    if (!file) return;

    setIsParsingFile(true);
    setParseStatus('Reading file and extracting structured text...');

    try {
      const extracted = await extractResumeText(file, (msg) => setParseStatus(msg), profile);
      setUploadedFileObj(file);
      setUploadedFileInfo({
        name: extracted.fileName,
        size: extracted.fileSize,
        type: extracted.fileType,
        numPages: extracted.numPages,
        charCount: extracted.charCount
      });

      setResumeText(extracted.text);

      if (extracted.structured) {
        updateStructuredResume(extracted.structured);
      }

      // Re-run matching automatically
      const match = calculateComprehensiveMatch(extracted.text, jobDescription, extracted.structured);
      setMatchResult(match);
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.message || 'Failed to process resume file. Please verify format.');
    } finally {
      setIsParsingFile(false);
      setParseStatus('');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Download the original uploaded file
  const handleDownloadUploadedFile = () => {
    if (uploadedFileObj) {
      const url = URL.createObjectURL(uploadedFileObj);
      const a = document.createElement('a');
      a.href = url;
      a.download = uploadedFileInfo?.name || 'resume_uploaded.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      let candidateName = structuredResume?.name && structuredResume.name !== 'Candidate Name'
        ? structuredResume.name
        : (profile?.fullName || 'Resume');
      candidateName = candidateName.replace(/['’]s\b|['’]/gi, '').trim();
      a.href = url;
      a.download = `${candidateName.replace(/\s+/g, '_')}_Extracted_Resume.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Download High-Impact Executive ATS-Formatted PDF
  const handleDownloadAtsPdf = async () => {
    if (!pdfPrintRef.current) return;
    setIsExportingPdf(true);

    try {
      const element = pdfPrintRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      let candidateName = structuredResume?.name && structuredResume.name !== 'Candidate Name'
        ? structuredResume.name
        : (profile?.fullName || 'Resume');
      candidateName = candidateName.replace(/['’]s\b|['’]/gi, '').trim();

      pdf.save(`${candidateName.replace(/\s+/g, '_')}_Executive_ATS.pdf`);
    } catch (e) {
      console.error('PDF generation error:', e);
      alert('Could not export PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Load Preset Sample Resumes
  const handleLoadSampleResume = (type) => {
    const sample = SAMPLE_RESUMES[type];
    if (!sample) return;
    updateStructuredResume(sample);
    setUploadedFileObj(null);
    setUploadedFileInfo({
      name: `${sample.name.replace(/\s+/g, '_')}_Resume.pdf`,
      size: 142000,
      type: 'SAMPLE_PDF',
      numPages: 1,
      charCount: sample.summary.length + 500
    });

    const text = `${sample.name}\n${sample.title}\n${sample.summary}\nSkills: ${sample.skills.join(', ')}\nExperience:\n${sample.experience.map((e) => `${e.title} at ${e.company}: ${e.description}`).join('\n')}\nEducation: ${sample.education.map((e) => e.degree).join(', ')}`;
    setResumeText(text);

    const match = calculateComprehensiveMatch(text, jobDescription, sample);
    setMatchResult(match);
  };

  // Load Preset Sample JDs
  const handleSelectPrebuiltJob = (job) => {
    setSelectedJobId(job.id);
    setTargetJobTitle(job.title);
    setJobDescription(job.description);

    const match = calculateComprehensiveMatch(resumeText, job.description, structuredResume);
    setMatchResult(match);
  };

  // Run or Update Match
  const handleRunMatch = () => {
    if (!resumeText.trim()) {
      alert('Please upload or paste your resume text first.');
      return;
    }
    if (!jobDescription.trim()) {
      alert('Please provide a job description to match against.');
      return;
    }
    const match = calculateComprehensiveMatch(resumeText, jobDescription, structuredResume);
    setMatchResult(match);
  };

  // Save edited structured data
  const handleSaveStructuredData = (updatedData) => {
    updateStructuredResume(updatedData);
    const newText = `${updatedData.name}\n${updatedData.title}\n${updatedData.summary}\nSkills: ${updatedData.skills?.join(', ')}\nExperience:\n${updatedData.experience?.map((e) => `${e.title} at ${e.company}: ${e.description}`).join('\n')}`;
    setResumeText(newText);
    const match = calculateComprehensiveMatch(newText, jobDescription, updatedData);
    setMatchResult(match);
  };

  return (
    <div className="job-matcher-page animate-fade-in">
      <PageHeader
        badgeText="ATS MATCH & GAP ENGINE"
        title="Resume vs Job Description Analyzer"
        description="Upload your resume (PDF, DOCX, TXT), compare against target job descriptions, download executive ATS resumes, and get an explainable match score."
      />

      {/* Hidden printable document for high-res PDF generation */}
      <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: '800px' }}>
        <AtsResumeDocument
          ref={pdfPrintRef}
          resumeData={structuredResume}
          profile={profile}
          template={selectedTemplate}
        />
      </div>

      {/* Input Section (2 Columns) */}
      <div className="matcher-inputs-grid">
        {/* Left: Resume Input Card */}
        <div className="hn-card input-card">
          <div className="input-card-header">
            <div className="header-left">
              <FileText size={18} className="text-primary" />
              <h3>1. Your Resume</h3>
            </div>
            {structuredResume?.name && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit3 size={14} />
                <span>Edit Parsed Fields</span>
              </button>
            )}
          </div>

          {/* Quick Presets */}
          <div className="quick-presets-row">
            <span className="preset-label">Sample Resumes:</span>
            <button
              className="preset-btn"
              onClick={() => handleLoadSampleResume('cloudEngineer')}
            >
              ☁️ Cloud / DevOps Alex
            </button>
            <button
              className="preset-btn"
              onClick={() => handleLoadSampleResume('fullStackDev')}
            >
              💻 Full Stack Sarah
            </button>
          </div>

          {/* Drag & Drop File Upload Zone */}
          <div
            className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="resume-upload-input"
              accept=".pdf,.docx,.doc,.txt,.rtf"
              onChange={handleFileInputChange}
              className="file-input-hidden"
            />
            <label htmlFor="resume-upload-input" className="dropzone-label">
              <div className="upload-icon-circle">
                <Upload size={24} className="upload-icon" />
              </div>
              <div className="upload-instructions">
                <strong>Click to browse or drag & drop resume</strong>
                <span>Supports PDF, DOCX, DOC, and TXT (Max 25MB)</span>
              </div>
            </label>
          </div>

          {isParsingFile && <div className="parsing-pill animate-fade-in">{parseStatus}</div>}

          {/* Uploaded File Status & Download Actions Card */}
          {uploadedFileInfo && (
            <div className="uploaded-file-card animate-fade-in">
              <div className="uploaded-file-info">
                <div className="file-icon-box">
                  <File size={20} className="text-primary" />
                </div>
                <div className="file-details">
                  <strong className="file-name">{uploadedFileInfo.name}</strong>
                  <span className="file-meta">
                    {formatFileSize(uploadedFileInfo.size)} • {uploadedFileInfo.type} • {uploadedFileInfo.numPages} {uploadedFileInfo.numPages === 1 ? 'Page' : 'Pages'}
                  </span>
                </div>
              </div>

              {/* Template Picker for Instant Download */}
              <div className="matcher-template-row">
                <span className="tpl-label">Style:</span>
                <button
                  className={`tpl-btn ${selectedTemplate === 'modern' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('modern')}
                >
                  💼 Modern
                </button>
                <button
                  className={`tpl-btn ${selectedTemplate === 'classic' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('classic')}
                >
                  🏛️ Classic
                </button>
                <button
                  className={`tpl-btn ${selectedTemplate === 'minimal' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('minimal')}
                >
                  ⚡ Minimal
                </button>
                <button
                  className={`tpl-btn ${selectedTemplate === 'sidebar' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('sidebar')}
                >
                  📑 Sidebar
                </button>
              </div>

              <div className="file-download-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleDownloadUploadedFile}
                  title="Download the exact uploaded file"
                >
                  <Download size={14} />
                  <span>Download File</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleDownloadAtsPdf}
                  disabled={isExportingPdf}
                  title="Download formatted Executive ATS Resume PDF"
                >
                  <FileCheck size={14} />
                  <span>{isExportingPdf ? 'Exporting PDF...' : 'Download ATS PDF'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Resume Raw Text View / Paste */}
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <div className="textarea-label-row">
              <label className="sub-label">Extracted Resume Content</label>
              <span className="char-count-tag">{resumeText.length} characters</span>
            </div>
            <textarea
              className="hn-input hn-textarea matcher-textarea"
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste or review your resume text here..."
            />
          </div>
        </div>

        {/* Right: Job Description Input Card */}
        <div className="hn-card input-card">
          <div className="input-card-header">
            <div className="header-left">
              <Sparkles size={18} className="text-primary" />
              <h3>2. Target Job Description</h3>
            </div>
            <span className="pill-sub">{targetJobTitle}</span>
          </div>

          {/* Preset JDs Selector */}
          <div className="quick-presets-row">
            <span className="preset-label">Curated JDs:</span>
            {INITIAL_JOBS.slice(0, 3).map((job) => (
              <button
                key={job.id}
                className={`preset-btn ${selectedJobId === job.id ? 'active' : ''}`}
                onClick={() => handleSelectPrebuiltJob(job)}
              >
                {job.title.split(' ')[0]} {job.title.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* JD Text Area */}
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="sub-label">Job Description Text</label>
            <textarea
              className="hn-input hn-textarea matcher-textarea"
              rows={12}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste any target job description here..."
            />
          </div>

          <div className="matcher-run-bar">
            <button className="btn btn-primary w-full" onClick={handleRunMatch}>
              <RefreshCw size={16} />
              <span>Calculate Multi-Factor ATS Match</span>
            </button>
          </div>
        </div>
      </div>

      {/* MATCH RESULTS DASHBOARD */}
      {matchResult && (
        <div className="match-results-section animate-fade-in">
          {/* Main Score Hero */}
          <div className="hn-card match-score-hero-card">
            <div className="score-hero-left">
              <div className="gauge-score-large">
                <span className="score-val">{matchResult.overallScore}%</span>
                <span className="score-tag">ATS MATCH</span>
              </div>
              <div className="score-hero-info">
                <span className="match-grade-badge">{matchResult.matchGrade}</span>
                <h3 className="score-title">Overall ATS Compatibility Score</h3>
                <p className="score-explainer">
                  Calculated from 35% Skill Alignment + 25% Keyword Density + 15% Experience Depth + 15% Education Fit + 10% Project Relevance.
                </p>
              </div>
            </div>

            <div className="score-summary-pills">
              <div className="stat-box">
                <span className="stat-label">Matched Skills</span>
                <span className="stat-number text-emerald">{matchResult.matchedSkills?.length || 0}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Missing Skills</span>
                <span className="stat-number text-amber">{matchResult.missingSkills?.length || 0}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Keyword Fit</span>
                <span className="stat-number text-primary">{matchResult.keywordMatch}%</span>
              </div>
            </div>
          </div>

          {/* 5-Factor Score Breakdown */}
          <div className="hn-card breakdown-card">
            <h3 className="breakdown-title">Multi-Factor ATS Score Breakdown</h3>
            <div className="breakdown-bars-grid">
              <div className="factor-bar-item">
                <div className="factor-header">
                  <span>Skills Coverage (35% weight)</span>
                  <strong>{matchResult.skillMatch}%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${matchResult.skillMatch}%` }} />
                </div>
              </div>

              <div className="factor-bar-item">
                <div className="factor-header">
                  <span>Keyword Alignment (25% weight)</span>
                  <strong>{matchResult.keywordMatch}%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${matchResult.keywordMatch}%` }} />
                </div>
              </div>

              <div className="factor-bar-item">
                <div className="factor-header">
                  <span>Experience Level Match (15% weight)</span>
                  <strong>{matchResult.experienceMatch}%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${matchResult.experienceMatch}%` }} />
                </div>
              </div>

              <div className="factor-bar-item">
                <div className="factor-header">
                  <span>Education Requirements (15% weight)</span>
                  <strong>{matchResult.educationMatch}%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${matchResult.educationMatch}%` }} />
                </div>
              </div>

              <div className="factor-bar-item">
                <div className="factor-header">
                  <span>Project & TF-IDF Relevance (10% weight)</span>
                  <strong>{matchResult.projectRelevance}%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${matchResult.projectRelevance}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Skills & Keywords */}
          <div className="skills-gap-grid">
            {/* Matching Skills */}
            <div className="hn-card">
              <div className="sec-head">
                <CheckCircle2 size={18} className="text-emerald" />
                <h4>Matched Skills ({matchResult.matchedSkills?.length || 0})</h4>
              </div>
              <p className="card-subtext">These required skills were found directly in your resume.</p>
              <div className="tags-container">
                {matchResult.matchedSkills?.map((skill, idx) => (
                  <span key={idx} className="badge-match">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills Intelligence */}
            <div className="hn-card">
              <div className="sec-head">
                <AlertTriangle size={18} className="text-amber" />
                <h4>Missing Skills & Why They Matter ({matchResult.detailedMissingSkills?.length || 0})</h4>
              </div>
              <p className="card-subtext">
                Required for this role. Do <em>not</em> falsify skills—use the constructive suggestions below:
              </p>

              <div className="missing-list-detailed">
                {matchResult.detailedMissingSkills?.map((item, idx) => (
                  <div key={idx} className="missing-detail-box">
                    <div className="detail-top">
                      <strong className="skill-title">{item.name}</strong>
                      <span className={`priority-pill ${item.priority.toLowerCase()}`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="why-reason">{item.whyRelevant}</p>
                    <ul className="suggestions-list">
                      {item.suggestions.map((sug, sIdx) => (
                        <li key={sIdx}>→ {sug}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Keywords Section */}
          <div className="hn-card">
            <div className="sec-head">
              <Layers size={18} className="text-primary" />
              <h4>High-Frequency Target Keywords</h4>
            </div>
            <p className="card-subtext">
              Contextually incorporate these industry keywords into your work experience or projects if truthful:
            </p>
            <div className="keywords-grid">
              {matchResult.detailedMissingKeywords?.map((kw, idx) => (
                <div key={idx} className="keyword-chip">
                  <strong>{kw.keyword}</strong>
                  <span className="kw-tip">{kw.tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* HOW TO IMPROVE YOUR RESUME (Feature 6) */}
          <div className="hn-card improvement-section">
            <div className="sec-head">
              <TrendingUp size={20} className="text-primary" />
              <h3>How to Improve Your Resume (Prioritized Recommendations)</h3>
            </div>
            <p className="card-subtext">
              Follow these prioritized action steps to increase ATS parser rankings and pass recruiter screenings.
            </p>

            <div className="suggestions-list-cards">
              {matchResult.suggestions?.map((item) => (
                <div key={item.id} className="suggestion-card">
                  <div className="sug-header">
                    <span className={`priority-badge ${item.priority.toLowerCase()}`}>
                      {item.priority} Priority
                    </span>
                    <span className="sug-category">{item.category}</span>
                  </div>
                  <h4 className="sug-title">{item.title}</h4>
                  <p className="sug-desc">{item.description}</p>
                  <div className="sug-action-bar">
                    <span className="action-tag">Suggested Action:</span>
                    <span className="action-text">{item.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Structured Resume Edit Modal */}
      <ResumeEditModal
        structuredData={structuredResume}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveStructuredData}
      />
    </div>
  );
};

export default JobMatcherPage;
