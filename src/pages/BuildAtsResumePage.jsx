import React, { useState, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import PageHeader from '../components/PageHeader';
import AtsResumeDocument from '../components/AtsResumeDocument';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  FileCheck,
  Download,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  Eye,
  CheckCircle2,
  Layers,
  Palette
} from 'lucide-react';
import './BuildAtsResumePage.css';

const DEFAULT_SECTIONS_ORDER = [
  'summary',
  'skills',
  'experience',
  'projects',
  'education',
  'certifications',
  'achievements',
  'languages'
];

const BuildAtsResumePage = () => {
  const { profile, structuredResume, updateStructuredResume } = useProfile();
  const [resumeData, setResumeData] = useState(structuredResume);
  const [sectionsOrder, setSectionsOrder] = useState(DEFAULT_SECTIONS_ORDER);
  const [template, setTemplate] = useState('modern'); // modern | classic | minimal | sidebar
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef(null);

  // Sync back to context
  const handleUpdate = (updated) => {
    setResumeData(updated);
    updateStructuredResume(updated);
  };

  // Reorder Sections
  const moveSection = (index, direction) => {
    const newOrder = [...sectionsOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setSectionsOrder(newOrder);
  };

  // Export PDF using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      const element = previewRef.current;
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

      let candidateName = resumeData?.name && resumeData.name !== 'Candidate Name'
        ? resumeData.name
        : (profile?.fullName || 'Resume');
      candidateName = candidateName.replace(/['’]s\b|['’]/gi, '').trim();

      pdf.save(`${candidateName.replace(/\s+/g, '_')}_Professional_ATS.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Handlers for adding/removing items
  const handleAddExperience = () => {
    handleUpdate({
      ...resumeData,
      experience: [
        ...(resumeData.experience || []),
        {
          title: 'Software & Cloud Engineer',
          company: 'Enterprise Solutions Inc.',
          location: 'San Francisco, CA',
          startDate: '2023',
          endDate: 'Present',
          description: 'Architected high-throughput microservices and improved system throughput by 40%.'
        }
      ]
    });
  };

  const handleAddProject = () => {
    handleUpdate({
      ...resumeData,
      projects: [
        ...(resumeData.projects || []),
        {
          name: 'Distributed Cloud Automation Platform',
          technologies: 'AWS, Docker, Kubernetes, Terraform',
          description: 'Designed and deployed multi-region infrastructure with automated CI/CD pipelines.'
        }
      ]
    });
  };

  const handleAddEducation = () => {
    handleUpdate({
      ...resumeData,
      education: [
        ...(resumeData.education || []),
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'State University',
          location: 'City, State',
          year: '2022',
          gpa: '3.8/4.0'
        }
      ]
    });
  };

  return (
    <div className="build-ats-page animate-fade-in">
      <PageHeader
        badgeText="PROFESSIONAL ATS RESUME BUILDER"
        title="Executive ATS-Friendly Resume Builder"
        description="Craft an executive-grade, ATS-compliant resume with customizable sections, 4 professional layouts, and 1-click high-resolution PDF export."
      />

      {/* Toolbar: Template Picker & Export */}
      <div className="hn-card builder-toolbar">
        <div className="template-picker">
          <span className="picker-label">Executive Layouts:</span>
          <button
            className={`t-btn ${template === 'modern' ? 'active' : ''}`}
            onClick={() => setTemplate('modern')}
          >
            💼 Modern Tech
          </button>
          <button
            className={`t-btn ${template === 'classic' ? 'active' : ''}`}
            onClick={() => setTemplate('classic')}
          >
            🏛️ Harvard Classic
          </button>
          <button
            className={`t-btn ${template === 'minimal' ? 'active' : ''}`}
            onClick={() => setTemplate('minimal')}
          >
            ⚡ Silicon Valley
          </button>
          <button
            className={`t-btn ${template === 'sidebar' ? 'active' : ''}`}
            onClick={() => setTemplate('sidebar')}
          >
            📑 Dual-Column Sidebar
          </button>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleDownloadPdf}
          disabled={isExporting}
        >
          <Download size={16} />
          <span>{isExporting ? 'Generating PDF...' : 'Download Executive PDF'}</span>
        </button>
      </div>

      {/* 2-Column Split: Left Editor, Right Live ATS Document */}
      <div className="builder-split-view">
        {/* LEFT: SECTION CONTROLS & EDITORS */}
        <div className="builder-editor-col">
          {/* Reorder Sections Card */}
          <div className="hn-card editor-section-card">
            <div className="sec-title-bar">
              <h4>Section Layout & Order</h4>
              <Layers size={16} className="text-primary" />
            </div>
            <p className="card-subtext">Drag or use arrows to reorder how sections appear.</p>
            <div className="reorder-list">
              {sectionsOrder.map((key, idx) => (
                <div key={key} className="reorder-item">
                  <span className="reorder-name">{key.toUpperCase()}</span>
                  <div className="reorder-btns">
                    <button
                      className="btn-order"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, -1)}
                    >
                      <MoveUp size={14} />
                    </button>
                    <button
                      className="btn-order"
                      disabled={idx === sectionsOrder.length - 1}
                      onClick={() => moveSection(idx, 1)}
                    >
                      <MoveDown size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Info Editor */}
          <div className="hn-card editor-section-card">
            <div className="sec-title-bar">
              <h4>Contact & Header Info</h4>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="hn-label">Full Name</label>
                <input
                  type="text"
                  className="hn-input"
                  value={resumeData.name || ''}
                  onChange={(e) => handleUpdate({ ...resumeData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="hn-label">Target Professional Title</label>
                <input
                  type="text"
                  className="hn-input"
                  value={resumeData.title || ''}
                  onChange={(e) => handleUpdate({ ...resumeData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="hn-label">Email</label>
                <input
                  type="email"
                  className="hn-input"
                  value={resumeData.email || ''}
                  onChange={(e) => handleUpdate({ ...resumeData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="hn-label">Phone Number</label>
                <input
                  type="text"
                  className="hn-input"
                  value={resumeData.phone || ''}
                  onChange={(e) => handleUpdate({ ...resumeData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="hn-label">Location (City, State / Country)</label>
                <input
                  type="text"
                  className="hn-input"
                  value={resumeData.location || ''}
                  onChange={(e) => handleUpdate({ ...resumeData, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="hn-card editor-section-card">
            <div className="sec-title-bar">
              <h4>Professional Summary</h4>
            </div>
            <textarea
              className="hn-input hn-textarea"
              rows={4}
              value={resumeData.summary || ''}
              onChange={(e) => handleUpdate({ ...resumeData, summary: e.target.value })}
              placeholder="Highlight your key expertise, years of experience, and core domains..."
            />
          </div>

          {/* Technical Skills */}
          <div className="hn-card editor-section-card">
            <div className="sec-title-bar">
              <h4>Core & Technical Skills</h4>
            </div>
            <p className="card-subtext">Comma-separated skills list:</p>
            <input
              type="text"
              className="hn-input"
              value={resumeData.skills?.join(', ') || ''}
              onChange={(e) =>
                handleUpdate({
                  ...resumeData,
                  skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                })
              }
            />
          </div>

          {/* Work Experience */}
          <div className="hn-card editor-section-card">
            <div className="sec-title-bar">
              <h4>Work Experience</h4>
              <button className="btn btn-secondary btn-sm" onClick={handleAddExperience}>
                <Plus size={14} /> Add Role
              </button>
            </div>
            {resumeData.experience?.map((exp, idx) => (
              <div key={idx} className="nested-editor-box">
                <div className="nested-top-bar">
                  <strong>Role #{idx + 1}</strong>
                  <button
                    className="btn-trash"
                    onClick={() => {
                      const list = [...resumeData.experience];
                      list.splice(idx, 1);
                      handleUpdate({ ...resumeData, experience: list });
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="form-grid-2">
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="Job Title"
                    value={exp.title || ''}
                    onChange={(e) => {
                      const list = [...resumeData.experience];
                      list[idx].title = e.target.value;
                      handleUpdate({ ...resumeData, experience: list });
                    }}
                  />
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="Company Name"
                    value={exp.company || ''}
                    onChange={(e) => {
                      const list = [...resumeData.experience];
                      list[idx].company = e.target.value;
                      handleUpdate({ ...resumeData, experience: list });
                    }}
                  />
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="Dates (e.g. 2022 - Present)"
                    value={exp.startDate ? `${exp.startDate} - ${exp.endDate || 'Present'}` : ''}
                    onChange={(e) => {
                      const list = [...resumeData.experience];
                      list[idx].startDate = e.target.value;
                      handleUpdate({ ...resumeData, experience: list });
                    }}
                  />
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="Location (e.g. San Francisco, CA)"
                    value={exp.location || ''}
                    onChange={(e) => {
                      const list = [...resumeData.experience];
                      list[idx].location = e.target.value;
                      handleUpdate({ ...resumeData, experience: list });
                    }}
                  />
                </div>
                <textarea
                  className="hn-input hn-textarea"
                  rows={3}
                  style={{ marginTop: '0.5rem' }}
                  placeholder="Bullet points / achievements (e.g. Spearheaded microservice migration reducing latency by 35%)..."
                  value={exp.description || ''}
                  onChange={(e) => {
                    const list = [...resumeData.experience];
                    list[idx].description = e.target.value;
                    handleUpdate({ ...resumeData, experience: list });
                  }}
                />
              </div>
            ))}
          </div>

          {/* Key Projects */}
          <div className="hn-card editor-section-card">
            <div className="sec-title-bar">
              <h4>Engineering Projects</h4>
              <button className="btn btn-secondary btn-sm" onClick={handleAddProject}>
                <Plus size={14} /> Add Project
              </button>
            </div>
            {resumeData.projects?.map((proj, idx) => (
              <div key={idx} className="nested-editor-box">
                <div className="nested-top-bar">
                  <strong>Project #{idx + 1}</strong>
                  <button
                    className="btn-trash"
                    onClick={() => {
                      const list = [...resumeData.projects];
                      list.splice(idx, 1);
                      handleUpdate({ ...resumeData, projects: list });
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="form-grid-2">
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="Project Name"
                    value={proj.name || ''}
                    onChange={(e) => {
                      const list = [...resumeData.projects];
                      list[idx].name = e.target.value;
                      handleUpdate({ ...resumeData, projects: list });
                    }}
                  />
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="Technologies (e.g. React, AWS, Docker)"
                    value={proj.technologies || ''}
                    onChange={(e) => {
                      const list = [...resumeData.projects];
                      list[idx].technologies = e.target.value;
                      handleUpdate({ ...resumeData, projects: list });
                    }}
                  />
                </div>
                <textarea
                  className="hn-input hn-textarea"
                  rows={2}
                  style={{ marginTop: '0.5rem' }}
                  placeholder="Project description and key results..."
                  value={proj.description || ''}
                  onChange={(e) => {
                    const list = [...resumeData.projects];
                    list[idx].description = e.target.value;
                    handleUpdate({ ...resumeData, projects: list });
                  }}
                />
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="hn-card editor-section-card">
            <div className="sec-title-bar">
              <h4>Education</h4>
              <button className="btn btn-secondary btn-sm" onClick={handleAddEducation}>
                <Plus size={14} /> Add Degree
              </button>
            </div>
            {resumeData.education?.map((edu, idx) => (
              <div key={idx} className="nested-editor-box">
                <div className="nested-top-bar">
                  <strong>Education #{idx + 1}</strong>
                  <button
                    className="btn-trash"
                    onClick={() => {
                      const list = [...resumeData.education];
                      list.splice(idx, 1);
                      handleUpdate({ ...resumeData, education: list });
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="form-grid-2">
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="Degree (e.g. B.S. in Computer Science)"
                    value={edu.degree || ''}
                    onChange={(e) => {
                      const list = [...resumeData.education];
                      list[idx].degree = e.target.value;
                      handleUpdate({ ...resumeData, education: list });
                    }}
                  />
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="Institution / College"
                    value={edu.institution || ''}
                    onChange={(e) => {
                      const list = [...resumeData.education];
                      list[idx].institution = e.target.value;
                      handleUpdate({ ...resumeData, education: list });
                    }}
                  />
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="Graduation Year"
                    value={edu.year || ''}
                    onChange={(e) => {
                      const list = [...resumeData.education];
                      list[idx].year = e.target.value;
                      handleUpdate({ ...resumeData, education: list });
                    }}
                  />
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="GPA / Honors"
                    value={edu.gpa || ''}
                    onChange={(e) => {
                      const list = [...resumeData.education];
                      list[idx].gpa = e.target.value;
                      handleUpdate({ ...resumeData, education: list });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: LIVE ATS PREVIEW CONTAINER */}
        <div className="builder-preview-col">
          <div className="preview-sticky-wrapper">
            <div className="preview-label-bar">
              <span className="live-pill">
                <Eye size={14} />
                <span>EXECUTIVE ATS PREVIEW</span>
              </span>
              <span className="template-tag">Layout: {template}</span>
            </div>

            {/* Reusable High-Fidelity Printable Document */}
            <AtsResumeDocument
              ref={previewRef}
              resumeData={resumeData}
              profile={profile}
              template={template}
              sectionsOrder={sectionsOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildAtsResumePage;
