import React from 'react';
import './FeatureCard.css';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="hn-card feature-card">
      <div className="feature-icon-box">
        <Icon size={24} className="feature-icon" />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

export default FeatureCard;
