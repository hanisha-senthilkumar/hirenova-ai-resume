import React, { useState, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import StepIndicator from '../components/StepIndicator';
import ReadinessCard from '../components/ReadinessCard';
import TextPreviewModal from '../components/TextPreviewModal';
import AnimatedScoreGauge from '../components/AnimatedScoreGauge';
import SkillsKeywordsResults from '../components/SkillsKeywordsResults';
import RequirementCoverage from '../components/RequirementCoverage';
import TopSkillsToImprove from '../components/TopSkillsToImprove';
import BeforeYouApplyChecklist from '../components/BeforeYouApplyChecklist';
import MatchSnapshot from '../components/MatchSnapshot';
import AiInsightsSection from '../components/AiInsightsSection';
import { extractResumeText, formatFileSize } from '../utils/pdfExtractor';
import { calculateMatchResults } from '../services/matchingEngine';
import { generateAiCareerInsights } from '../services/puterAIService';
import { downloadPdfReport, printReport } from '../utils/reportGenerator';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Trash2,
  Eye,
  RotateCcw,
  Loader2,
  Lock,
  Download,
  Printer,
  PlusCircle,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import './JobMatcherPage.css';

const JobMatcherPage = () => {
  // Input State
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [jdText, setJdText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Analysis Results, Timestamp & Stale State
  const [matchResult, setMatchResult] = useState(null);
  const [analysisTimestamp, setAnalysisTimestamp] = useState(null);
  const [isStale, setIsStale] = useState(false);

  // AI Insights State
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiHasRun, setAiHasRun] = useState(false);

  // Export Loading State
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportError, setExportError] = useState(null);

  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  // Handle File Upload & Parsing
  const handleFileProcess = async (selectedFile) => {
    if (!selectedFile) return;

    setUploadError(null);
    setIsExtracting(true);
    setExtractionProgress('Reading file...');

    // If an analysis exists, mark it as stale
    if (matchResult) {
      setIsStale(true);
    }

    try {
      const data = await extractResumeText(selectedFile, (progressMsg) => {
        setExtractionProgress(progressMsg);
      });

      setFile(selectedFile);
      setExtractedData(data);
    } catch (err) {
      console.error('Extraction failure:', err);
      setUploadError(err.message || 'Unable to process file.');
      setFile(null);
      setExtractedData(null);
    } finally {
      setIsExtracting(false);
    }
  };

  // Drag and Drop Event Handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemoveResume = () => {
    setFile(null);
    setExtractedData(null);
    setUploadError(null);
    if (matchResult) {
      setIsStale(true);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleJdChange = (e) => {
    setJdText(e.target.value);
    if (matchResult) {
      setIsStale(true);
    }
  };

  const handleClearJd = () => {
    setJdText('');
    if (matchResult) {
      setIsStale(true);
    }
  };

  // Run Phase 3 & Phase 5 Matching Engine Calculation
  const handleAnalyzeMatch = () => {
    if (!extractedData?.text || jdText.trim().length < 30) return;

    const results = calculateMatchResults(extractedData.text, jdText);
    setMatchResult(results);

    // Record Analysis Completion Timestamp
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    setAnalysisTimestamp(`${formattedDate} at ${formattedTime}`);
    setIsStale(false);

    // Reset AI state for new match
    setAiData(null);
    setAiHasRun(false);
    setAiError(null);

    // Smooth scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Run Phase 4 Puter AI Insights
  const handleGenerateAiInsights = async () => {
    if (!extractedData?.text || !jdText || !matchResult) return;

    setAiLoading(true);
    setAiError(null);

    try {
      const insights = await generateAiCareerInsights(extractedData.text, jdText, matchResult);
      setAiData(insights);
      setAiHasRun(true);
    } catch (err) {
      console.error('AI Insights Error:', err);
      setAiError(err.message || 'AI service unavailable');
    } finally {
      setAiLoading(false);
    }
  };

  // Download PDF Report
  const handleDownloadPdf = async () => {
    if (!matchResult || isStale) return;
    setIsExportingPdf(true);
    setExportError(null);

    try {
      const pdfFileName = `HireNova_Match_Report_${extractedData?.fileName?.replace(/\.[^/.]+$/, '') || 'Resume'}.pdf`;
      await downloadPdfReport('match-report-container', pdfFileName);
    } catch (err) {
      setExportError(err.message || 'Unable to generate the report. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Print Report
  const handlePrint = () => {
    if (!matchResult || isStale) return;
    printReport();
  };

  // Reset to New Analysis Workflow
  const handleNewAnalysis = () => {
    setFile(null);
    setExtractedData(null);
    setJdText('');
    setMatchResult(null);
    setAiData(null);
    setAiHasRun(false);
    setAnalysisTimestamp(null);
    setIsStale(false);
    setUploadError(null);
    setExportError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Readiness Calculations
  const isResumeReady = Boolean(extractedData && extractedData.text);
  const isJdReady = jdText.trim().length >= 30;
  const isAnalyzeReady = isResumeReady && isJdReady;

  return (
    <div className="job-matcher-page animate-fade-in">
      <PageHeader
        badgeText="AI-POWERED RESUME MATCHING"
        title="Resume & Job Match Intelligence"
        description="Upload your resume and compare it with a job description to understand your career alignment before you apply."
      />

      {/* Step Indicator */}
      <StepIndicator isResumeReady={isResumeReady} isJdReady={isJdReady} />

      {/* INPUT WORKFLOW CARD GRID */}
      <div className="matcher-grid input-section-print-hide">
        {/* SECTION 1: RESUME UPLOAD / EXTRACTED CARD */}
        <div className="hn-card glass-card matcher-card">
          <div className="card-title-group">
            <div className="card-icon-box">
              <UploadCloud size={22} />
            </div>
            <div>
              <h2 className="card-heading">Upload Your Resume</h2>
              <p className="card-subheading">Upload a PDF or text resume. No manual retyping required.</p>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf,.txt"
            style={{ display: 'none' }}
          />

          {uploadError && (
            <div className="error-banner animate-fade-in">
              <AlertCircle size={18} />
              <div className="error-text-group">
                <span>{uploadError}</span>
                <button className="error-retry-btn" onClick={() => fileInputRef.current?.click()}>
                  Try another file
                </button>
              </div>
            </div>
          )}

          {isExtracting && (
            <div className="extraction-loader-box animate-fade-in">
              <Loader2 size={32} className="extraction-spinner" />
              <p className="extraction-progress-text">{extractionProgress}</p>
            </div>
          )}

          {!isExtracting && extractedData ? (
            <div className="extracted-summary-card animate-fade-in">
              <div className="summary-status-bar">
                <span className="uploaded-badge">
                  <CheckCircle2 size={14} />
                  <span>Resume uploaded</span>
                </span>
                <span className="extraction-success-tag">Text extracted successfully</span>
              </div>

              <div className="file-info-row">
                <div className="file-icon-box">
                  <FileText size={24} />
                </div>
                <div className="file-meta">
                  <h4 className="file-name">{extractedData.fileName}</h4>
                  <div className="file-specs">
                    <span>{extractedData.fileType}</span>
                    <span className="dot">•</span>
                    <span>{formatFileSize(extractedData.fileSize)}</span>
                    {extractedData.fileType === 'PDF' && (
                      <>
                        <span className="dot">•</span>
                        <span>{extractedData.numPages} {extractedData.numPages === 1 ? 'page' : 'pages'}</span>
                      </>
                    )}
                    <span className="dot">•</span>
                    <span className="char-highlight">{extractedData.charCount.toLocaleString()} chars</span>
                  </div>
                </div>
              </div>

              <div className="summary-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => setIsPreviewOpen(true)}>
                  <Eye size={15} />
                  <span>Preview Text</span>
                </button>

                <button className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()}>
                  <RefreshCw size={15} />
                  <span>Replace Resume</span>
                </button>

                <button className="btn btn-secondary btn-sm btn-remove" onClick={handleRemoveResume}>
                  <Trash2 size={15} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            !isExtracting && (
              <div
                className={`dropzone-box ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="dropzone-icon-circle">
                  <UploadCloud size={28} />
                </div>
                <p className="dropzone-title">
                  {isDragging ? 'Drop your resume here' : 'Drop your resume here or browse from your device'}
                </p>
                <p className="dropzone-formats">Supported formats: PDF, TXT (Max 10MB)</p>
                <button className="btn btn-secondary btn-sm dropzone-browse-btn" type="button">
                  Browse File
                </button>
              </div>
            )
          )}
        </div>

        {/* SECTION 2: JOB DESCRIPTION CARD */}
        <div className="hn-card glass-card matcher-card">
          <div className="card-title-group">
            <div className="card-icon-box">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="card-heading">Job Description</h2>
              <p className="card-subheading">Paste the job description you want to match against your resume.</p>
            </div>
          </div>

          <div className="jd-textarea-wrapper">
            <textarea
              className="jd-textarea"
              placeholder="Paste the complete job description here (responsibilities, requirements, qualifications)..."
              value={jdText}
              onChange={handleJdChange}
              rows={8}
            />

            <div className="jd-footer-info">
              <div className="jd-char-count">
                <span>Characters: {jdText.length.toLocaleString()}</span>
              </div>

              <div className="jd-status-indicator">
                {jdText.trim().length >= 30 ? (
                  <span className="jd-status-ready">
                    <CheckCircle2 size={14} />
                    <span>Job description ready</span>
                  </span>
                ) : jdText.trim().length > 0 ? (
                  <span className="jd-status-warning">
                    <span>Please enter a complete job description.</span>
                  </span>
                ) : null}
              </div>

              {jdText.length > 0 && (
                <button className="btn btn-secondary btn-sm btn-clear-jd" onClick={handleClearJd}>
                  <RotateCcw size={14} />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Readiness Status Card */}
      <div className="input-section-print-hide">
        <ReadinessCard isResumeReady={isResumeReady} isJdReady={isJdReady} />
      </div>

      {/* STALE INPUT WARNING BANNER */}
      {isStale && matchResult && (
        <div className="stale-warning-banner animate-fade-in input-section-print-hide">
          <AlertTriangle size={20} />
          <div className="stale-text">
            <strong>Your inputs have changed.</strong>
            <span>Analyze again to update the calculated results and enable report download.</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAnalyzeMatch}>
            Re-Analyze Match
          </button>
        </div>
      )}

      {/* Analyze Action Box */}
      <div className="hn-card glass-card analyze-action-card input-section-print-hide">
        <div className="analyze-card-content">
          {isAnalyzeReady ? (
            <div className="inputs-ready-summary animate-fade-in">
              <div className="ready-mini-card">
                <span className="mini-card-label">RESUME</span>
                <p className="mini-card-val">{extractedData.fileName}</p>
                <span className="mini-card-sub">{extractedData.charCount.toLocaleString()} characters</span>
                <span className="mini-card-tag ready">✓ Ready</span>
              </div>

              <div className="ready-mini-card">
                <span className="mini-card-label">JOB DESCRIPTION</span>
                <p className="mini-card-val">Job Posting Text</p>
                <span className="mini-card-sub">{jdText.length.toLocaleString()} characters</span>
                <span className="mini-card-tag ready">✓ Ready</span>
              </div>
            </div>
          ) : (
            <div className="inputs-waiting-summary">
              <Sparkles size={24} className="waiting-sparkle" />
              <div>
                <h4 className="waiting-title">Your Match Analysis</h4>
                <p className="waiting-sub">
                  Upload your resume and enter a job description to prepare your analysis.
                </p>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary btn-lg analyze-main-btn"
            disabled={!isAnalyzeReady}
            onClick={handleAnalyzeMatch}
          >
            {isAnalyzeReady ? (
              <>
                <span>Analyze Match</span>
                <ArrowRight size={20} />
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>Waiting for resume & job description</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* NO ANALYSIS STATE */}
      {!matchResult && (
        <div className="hn-card glass-card no-analysis-card animate-fade-in">
          <Sparkles size={36} className="no-analysis-icon" />
          <h3 className="no-analysis-title">No analysis available yet</h3>
          <p className="no-analysis-sub">
            Upload your resume and paste a job description above to generate your Career Match Report.
          </p>
        </div>
      )}

      {/* EXPLAINABLE CAREER MATCH REPORT & RESULTS DASHBOARD */}
      {matchResult && (
        <div className="results-dashboard-container animate-fade-in" ref={resultsRef}>
          {/* Action Toolbar (Download Report, Print Report, New Analysis) */}
          <div className="results-toolbar-card glass-card input-section-print-hide">
            <div className="toolbar-meta">
              <div className="timestamp-group">
                <Clock size={15} />
                <span>Analysis generated: {analysisTimestamp}</span>
              </div>
              <span className="meta-filename">File: {extractedData?.fileName}</span>
            </div>

            <div className="toolbar-actions">
              <button
                className="btn btn-primary"
                onClick={handleDownloadPdf}
                disabled={isStale || isExportingPdf}
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 size={16} className="btn-spinner" />
                    <span>Generating Report...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download Match Report</span>
                  </>
                )}
              </button>

              <button
                className="btn btn-secondary"
                onClick={handlePrint}
                disabled={isStale}
              >
                <Printer size={16} />
                <span>Print Report</span>
              </button>

              <button className="btn btn-secondary btn-new-analysis" onClick={handleNewAnalysis}>
                <PlusCircle size={16} />
                <span>New Analysis</span>
              </button>
            </div>
          </div>

          {exportError && (
            <div className="error-banner animate-fade-in input-section-print-hide">
              <AlertCircle size={18} />
              <span>{exportError}</span>
            </div>
          )}

          {/* REPORT CONTAINER FOR PDF EXPORT & PRINT */}
          <div id="match-report-container" className="printable-report-wrapper">
            {/* Printable Report Header */}
            <div className="printable-report-header">
              <div className="print-header-brand">
                <div className="brand-logo-pill">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h1 className="print-brand-name">HireNova</h1>
                  <p className="print-brand-tag">Resume & Job Match Report</p>
                </div>
              </div>

              <div className="print-header-meta">
                <span>Date: {analysisTimestamp}</span>
                <span>Resume: {extractedData?.fileName}</span>
              </div>
            </div>

            {/* SECTION 2: HERO SCORE CARD & ANIMATED GAUGE */}
            <AnimatedScoreGauge matchResult={matchResult} />

            {/* SECTION 20: MATCH SNAPSHOT (SHARE-FRIENDLY HACKATHON DEMO CARD) */}
            <MatchSnapshot matchResult={matchResult} fileName={extractedData?.fileName} />

            {/* SECTION 10: JOB REQUIREMENT COVERAGE */}
            <RequirementCoverage matchResult={matchResult} />

            {/* SECTION 6 & 7 & 9: SKILLS & KEYWORDS RESULTS WITH SEARCH */}
            <SkillsKeywordsResults matchResult={matchResult} />

            {/* SECTION 8: PRIORITY SKILL GAPS */}
            <TopSkillsToImprove matchResult={matchResult} aiData={aiData} />

            {/* SECTION 14: BEFORE YOU APPLY CHECKLIST */}
            <BeforeYouApplyChecklist matchResult={matchResult} fileName={extractedData?.fileName} />

            {/* SECTION 11: PUTER AI INSIGHTS */}
            <AiInsightsSection
              aiData={aiData}
              loading={aiLoading}
              error={aiError}
              onGenerate={handleGenerateAiInsights}
              onRegenerate={handleGenerateAiInsights}
              hasRun={aiHasRun}
            />

            {/* REPORT DISCLAIMER FOOTER */}
            <div className="report-disclaimer-footer">
              <ShieldCheck size={16} />
              <p>
                <strong>Disclaimer:</strong> This report provides a resume-to-job alignment estimate only based on calculated skill coverage, keyword frequency and text similarity. This assessment does not guarantee hiring or ATS selection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Text Preview Modal */}
      <TextPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        text={extractedData?.text || ''}
        fileName={extractedData?.fileName || ''}
      />
    </div>
  );
};

export default JobMatcherPage;
