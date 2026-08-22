import React from 'react';
import { Sparkles } from 'lucide-react';
import './PageHeader.css';

const PageHeader = ({ badgeText = "AI CAREER INTELLIGENCE PLATFORM", title, description }) => {
  return (
    <div className="page-header animate-fade-in">
      {badgeText && (
        <div className="badge-pill">
          <Sparkles size={14} />
          <span>{badgeText}</span>
        </div>
      )}
      <h1 className="page-header-title">{title}</h1>
      {description && <p className="page-header-desc">{description}</p>}
    </div>
  );
};

export default PageHeader;
