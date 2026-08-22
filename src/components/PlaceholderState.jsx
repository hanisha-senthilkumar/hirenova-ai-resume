import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowLeft, Clock } from 'lucide-react';
import './PlaceholderState.css';

const PlaceholderState = ({
  icon: Icon = Layers,
  title,
  subtitle = "Coming in a later phase.",
  badge = "Phase 2 Preview",
  actionText = "Back to Dashboard",
  actionPath = "/dashboard"
}) => {
  const navigate = useNavigate();

  return (
    <div className="hn-card placeholder-state-card animate-fade-in">
      <div className="placeholder-status-badge">
        <Clock size={14} />
        <span>{badge}</span>
      </div>

      <div className="placeholder-icon-wrapper">
        <Icon size={36} className="placeholder-icon" />
      </div>

      <h2 className="placeholder-title">{title}</h2>
      <p className="placeholder-subtitle">{subtitle}</p>

      {actionText && (
        <button
          className="btn btn-secondary placeholder-action-btn"
          onClick={() => navigate(actionPath)}
        >
          <ArrowLeft size={16} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default PlaceholderState;
