import React, { forwardRef } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import './AtsResumeDocument.css';

/**
 * High-Impact Executive ATS Resume Printable Component
 * Supports 4 professional templates:
 * 1. 'modern'   - Modern Executive Tech (Indigo accents, badge tags, clean sections)
 * 2. 'classic'  - Harvard / Ivy League Serif (Traditional centered, double rules, elegant)
 * 3. 'minimal'  - Silicon Valley Minimalist (High contrast, crisp tags, right dates)
 * 4. 'sidebar'  - Executive Dual-Column (Left meta/skills column + Right experience body)
 */
const AtsResumeDocument = forwardRef(({ resumeData, profile, template = 'modern', sectionsOrder = null }, ref) => {
  const r = resumeData || {};

  // Clean candidate name
  let name = (r.name && r.name !== 'Candidate Name') ? r.name : (profile?.fullName || 'Harsithaa');
  name = name.replace(/['’]s\b|['’]/gi, '').trim();

  const title = r.title || profile?.targetRole || 'Cloud Infrastructure Engineer';
  const email = r.email || profile?.email || 'user@example.com';
  const phone = r.phone || profile?.phone || '+1 (555) 019-2834';
  const location = r.location || profile?.location || 'San Francisco, CA';
  const summary = r.summary || profile?.bio || '';
  const skills = r.skills || profile?.skills || [];
  const experience = r.experience || [];
  const projects = r.projects || [];
  const education = r.education || [];
  const certifications = r.certifications || [];
  const achievements = r.achievements || [];
  const languages = r.languages || ['English (Fluent)'];

  const defaultOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements', 'languages'];
  const order = sectionsOrder || defaultOrder;

  // Split multi-line experience descriptions into bullet points
  const formatBullets = (desc) => {
    if (!desc) return [];
    if (Array.isArray(desc)) return desc;
    return desc
      .split(/\n|•|;|(?<=\.)\s+(?=[A-Z])/)
      .map((b) => b.trim())
      .filter((b) => b.length > 5);
  };

  // Render for Sidebar Layout
  if (template === 'sidebar') {
    return (
      <div className="ats-resume-sheet template-sidebar" ref={ref}>
        {/* Left Sidebar */}
        <aside className="sidebar-col">
          <div className="sidebar-header">
            <h1 className="sidebar-name">{name}</h1>
            <p className="sidebar-title">{title}</p>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-heading">CONTACT</h3>
            <div className="sidebar-contact-list">
              <div className="contact-item">
                <span className="contact-val">{email}</span>
              </div>
              <div className="contact-item">
                <span className="contact-val">{phone}</span>
              </div>
              <div className="contact-item">
                <span className="contact-val">{location}</span>
              </div>
            </div>
          </div>

          {skills.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-heading">CORE SKILLS</h3>
              <div className="sidebar-skill-pills">
                {skills.map((skill, i) => (
                  <span key={i} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-heading">EDUCATION</h3>
              {education.map((edu, i) => (
                <div key={i} className="sidebar-edu-item">
                  <strong>{edu.degree}</strong>
                  <span>{edu.institution}</span>
                  <span className="text-muted-xs">{edu.year}</span>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-heading">CERTIFICATIONS</h3>
              <ul className="sidebar-list">
                {certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {languages.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-heading">LANGUAGES</h3>
              <span className="sidebar-lang">{languages.join(', ')}</span>
            </div>
          )}
        </aside>

        {/* Right Main Body */}
        <main className="sidebar-main">
          {summary && (
            <section className="resume-section">
              <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
              <p className="summary-text">{summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">PROFESSIONAL EXPERIENCE</h2>
              {experience.map((exp, i) => {
                const bullets = formatBullets(exp.description);
                return (
                  <div key={i} className="exp-block">
                    <div className="exp-heading-row">
                      <div className="role-and-company">
                        <strong className="exp-role">{exp.title}</strong>
                        <span className="exp-company"> | {exp.company}</span>
                      </div>
                      <span className="date-badge">
                        {exp.startDate || '2022'} – {exp.endDate || 'Present'}
                      </span>
                    </div>
                    <span className="exp-loc">{exp.location || 'Remote'}</span>
                    <ul className="exp-bullet-list">
                      {bullets.length > 0 ? (
                        bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))
                      ) : (
                        <li>{exp.description}</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </section>
          )}

          {projects.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">KEY ENGINEERING PROJECTS</h2>
              {projects.map((proj, i) => {
                const bullets = formatBullets(proj.description);
                return (
                  <div key={i} className="proj-block">
                    <div className="proj-heading-row">
                      <strong className="proj-name">{proj.name}</strong>
                      {proj.technologies && (
                        <span className="proj-tech-tag">{proj.technologies}</span>
                      )}
                    </div>
                    <ul className="proj-bullet-list">
                      {bullets.length > 0 ? (
                        bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)
                      ) : (
                        <li>{proj.description}</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </section>
          )}

          {achievements.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">KEY ACHIEVEMENTS</h2>
              <ul className="achievement-list">
                {achievements.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    );
  }

  // Render for Modern, Classic, and Minimal Layouts
  return (
    <div className={`ats-resume-sheet template-${template}`} ref={ref}>
      {/* Top Header */}
      <header className="ats-main-header">
        <h1 className="ats-candidate-name">{name}</h1>
        <p className="ats-target-title">{title}</p>
        <div className="ats-contact-bar">
          <span>{email}</span>
          <span className="sep">•</span>
          <span>{phone}</span>
          <span className="sep">•</span>
          <span>{location}</span>
        </div>
      </header>

      {/* Dynamic Ordered Sections */}
      {order.map((sectionKey) => {
        // 1. Summary
        if (sectionKey === 'summary' && summary) {
          return (
            <section key="summary" className="ats-doc-section">
              <h2 className="ats-section-heading">PROFESSIONAL SUMMARY</h2>
              <p className="ats-summary-body">{summary}</p>
            </section>
          );
        }

        // 2. Skills
        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="ats-doc-section">
              <h2 className="ats-section-heading">TECHNICAL & CORE COMPETENCIES</h2>
              <div className="ats-skills-wrap">
                {template === 'classic' ? (
                  <p className="classic-skills-text">{skills.join('  •  ')}</p>
                ) : (
                  <div className="modern-skill-pills">
                    {skills.map((s, idx) => (
                      <span key={idx} className="modern-skill-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        }

        // 3. Experience
        if (sectionKey === 'experience' && experience.length > 0) {
          return (
            <section key="experience" className="ats-doc-section">
              <h2 className="ats-section-heading">PROFESSIONAL EXPERIENCE</h2>
              {experience.map((exp, i) => {
                const bullets = formatBullets(exp.description);
                return (
                  <div key={i} className="ats-exp-item">
                    <div className="ats-row-between">
                      <div>
                        <strong className="ats-item-role">{exp.title}</strong>
                        <span className="ats-item-company"> — {exp.company}</span>
                      </div>
                      <span className="ats-item-date">
                        {exp.startDate || '2022'} – {exp.endDate || 'Present'}
                      </span>
                    </div>
                    <div className="ats-item-sub">{exp.location || 'Remote'}</div>
                    <ul className="ats-bullet-items">
                      {bullets.length > 0 ? (
                        bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)
                      ) : (
                        <li>{exp.description}</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </section>
          );
        }

        // 4. Projects
        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="ats-doc-section">
              <h2 className="ats-section-heading">KEY ENGINEERING PROJECTS</h2>
              {projects.map((proj, i) => {
                const bullets = formatBullets(proj.description);
                return (
                  <div key={i} className="ats-proj-item">
                    <div className="ats-row-between">
                      <strong className="ats-item-role">{proj.name}</strong>
                      {proj.technologies && (
                        <span className="ats-tech-badge">[{proj.technologies}]</span>
                      )}
                    </div>
                    <ul className="ats-bullet-items">
                      {bullets.length > 0 ? (
                        bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)
                      ) : (
                        <li>{proj.description}</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </section>
          );
        }

        // 5. Education
        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="ats-doc-section">
              <h2 className="ats-section-heading">EDUCATION</h2>
              {education.map((edu, i) => (
                <div key={i} className="ats-edu-item">
                  <div className="ats-row-between">
                    <strong className="ats-item-role">{edu.degree}</strong>
                    <span className="ats-item-date">{edu.year || '2022'}</span>
                  </div>
                  <div className="ats-item-sub">
                    {edu.institution} {edu.gpa && <span>(GPA: {edu.gpa})</span>}
                  </div>
                </div>
              ))}
            </section>
          );
        }

        // 6. Certifications
        if (sectionKey === 'certifications' && certifications.length > 0) {
          return (
            <section key="certifications" className="ats-doc-section">
              <h2 className="ats-section-heading">CERTIFICATIONS & LICENSES</h2>
              <ul className="ats-bullet-items">
                {certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
          );
        }

        // 7. Achievements
        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="ats-doc-section">
              <h2 className="ats-section-heading">KEY ACHIEVEMENTS</h2>
              <ul className="ats-bullet-items">
                {achievements.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            </section>
          );
        }

        // 8. Languages
        if (sectionKey === 'languages' && languages.length > 0) {
          return (
            <section key="languages" className="ats-doc-section">
              <h2 className="ats-section-heading">LANGUAGES</h2>
              <p className="ats-summary-body">{languages.join('  •  ')}</p>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
});

AtsResumeDocument.displayName = 'AtsResumeDocument';

export default AtsResumeDocument;
