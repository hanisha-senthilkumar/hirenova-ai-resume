import React from 'react';
import { ArrowRight } from 'lucide-react';
import './DashboardCard.css';

const DashboardCard = ({ icon: Icon, title, description, buttonText, onClick, badgeText }) => {
  return (
    <div className="hn-card dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-icon-box">
          <Icon size={22} />
        </div>
        {badgeText && <span className="dash-badge">{badgeText}</span>}
      </div>

      <div className="dashboard-card-body">
        <h3 className="dash-card-title">{title}</h3>
        <p className="dash-card-desc">{description}</p>
      </div>

      <div className="dashboard-card-footer">
        <button className="btn btn-outline dash-btn" onClick={onClick}>
          <span>{buttonText}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DashboardCard;
