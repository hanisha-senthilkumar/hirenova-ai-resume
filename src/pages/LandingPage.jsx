import React from 'react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      icon: Target,
      title: 'Resume vs Job Matching',
      description: 'Compare your resume directly with real job descriptions to evaluate alignment.'
    },
    {
      icon: TrendingUp,
      title: 'Skill Gap Intelligence',
      description: 'Discover critical skills and keywords missing from your job application.'
    },
    {
      icon: CheckCircle2,
      title: 'Instant Fit Scoring',
      description: 'Get clear match score insights to optimize your resume before submitting.'
    }
  ];

  return (
    <div className="landing-page">
      <Hero />

      <section className="features-section">
        <div className="features-header">
          <h2 className="features-title">Intelligent Career Matching</h2>
          <p className="features-subtitle">
            Designed for job seekers looking to optimize resume performance and align with job descriptions.
          </p>
        </div>

        <div className="grid-responsive-3 features-grid">
          {features.map((feat, index) => (
            <FeatureCard
              key={index}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
