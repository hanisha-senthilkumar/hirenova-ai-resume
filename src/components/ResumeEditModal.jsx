import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, User, BookOpen, Briefcase, Award, Code } from 'lucide-react';
import './ResumeEditModal.css';

const ResumeEditModal = ({ structuredData, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(structuredData || {});
  const [activeTab, setActiveTab] = useState('personal');

  if (!isOpen || !structuredData) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleAddExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...(formData.experience || []),
        {
          title: 'Software Engineer',
          company: 'Company Name',
          location: 'Location',
          startDate: '2023',
          endDate: 'Present',
          description: 'Key accomplishments and responsibilities...'
        }
      ]
    });
  };

  const handleRemoveExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index)
    });
  };

  const handleAddProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...(formData.projects || []),
        {
          name: 'New Project Title',
          technologies: 'React, Node.js',
          description: 'Project summary and technical outcomes...'
        }
      ]
    });
  };

  const handleRemoveProject = (index) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="resume-edit-overlay animate-fade-in">
      <div className="resume-edit-modal glass-card">
        <div className="resume-edit-header">
          <div className="header-title-box">
            <h3 className="modal-title">Extracted Resume Information</h3>
            <p className="modal-subtitle">Review and fine-tune your structured resume data before matching.</p>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="resume-edit-tabs">
          <button
            className={`edit-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <User size={15} />
            <span>Personal & Summary</span>
          </button>

          <button
            className={`edit-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <Code size={15} />
            <span>Skills ({formData.skills?.length || 0})</span>
          </button>

          <button
            className={`edit-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <Briefcase size={15} />
            <span>Experience ({formData.experience?.length || 0})</span>
          </button>

          <button
            className={`edit-tab-btn ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            <BookOpen size={15} />
            <span>Education & Projects</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="resume-edit-body">
          {activeTab === 'personal' && (
            <div className="tab-pane animate-fade-in">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="hn-input"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Professional Title</label>
                  <input
                    type="text"
                    className="hn-input"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="hn-input"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="hn-input"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Professional Summary</label>
                <textarea
                  className="hn-input hn-textarea"
                  rows={4}
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="tab-pane animate-fade-in">
              <div className="form-group">
                <label>Extracted Technical & Soft Skills (comma separated)</label>
                <textarea
                  className="hn-input hn-textarea"
                  rows={4}
                  value={formData.skills?.join(', ') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  placeholder="e.g. JavaScript, React, Docker, AWS, SQL"
                />
              </div>

              <div className="skills-badge-preview">
                <label className="preview-label">Parsed Skill Badges:</label>
                <div className="badges-wrap">
                  {formData.skills?.map((skill, idx) => (
                    <span key={idx} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="tab-pane animate-fade-in">
              <div className="section-head-bar">
                <h4>Work History Entries</h4>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddExperience}>
                  <Plus size={14} />
                  <span>Add Role</span>
                </button>
              </div>

              {formData.experience?.map((exp, idx) => (
                <div key={idx} className="nested-item-card">
                  <div className="nested-item-header">
                    <span className="item-number">Role #{idx + 1}</span>
                    <button
                      type="button"
                      className="btn-delete-item"
                      onClick={() => handleRemoveExperience(idx)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="form-grid-2">
                    <input
                      type="text"
                      className="hn-input"
                      placeholder="Job Title"
                      value={exp.title || ''}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                    />
                    <input
                      type="text"
                      className="hn-input"
                      placeholder="Company"
                      value={exp.company || ''}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].company = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                    />
                  </div>
                  <textarea
                    className="hn-input hn-textarea"
                    rows={2}
                    placeholder="Responsibilities and achievements..."
                    style={{ marginTop: '0.5rem' }}
                    value={exp.description || ''}
                    onChange={(e) => {
                      const updated = [...formData.experience];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, experience: updated });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="tab-pane animate-fade-in">
              <div className="section-head-bar">
                <h4>Projects & Portfolios</h4>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddProject}>
                  <Plus size={14} />
                  <span>Add Project</span>
                </button>
              </div>

              {formData.projects?.map((proj, idx) => (
                <div key={idx} className="nested-item-card">
                  <div className="nested-item-header">
                    <span className="item-number">Project #{idx + 1}</span>
                    <button
                      type="button"
                      className="btn-delete-item"
                      onClick={() => handleRemoveProject(idx)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="form-grid-2">
                    <input
                      type="text"
                      className="hn-input"
                      placeholder="Project Name"
                      value={proj.name || ''}
                      onChange={(e) => {
                        const updated = [...formData.projects];
                        updated[idx].name = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                    />
                    <input
                      type="text"
                      className="hn-input"
                      placeholder="Technologies (e.g. React, Docker)"
                      value={proj.technologies || ''}
                      onChange={(e) => {
                        const updated = [...formData.projects];
                        updated[idx].technologies = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="resume-edit-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <CheckCircle2 size={16} />
            <span>Confirm & Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditModal;
