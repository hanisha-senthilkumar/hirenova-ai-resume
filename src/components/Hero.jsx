import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section animate-fade-in">
      <div className="badge-pill">
        <Sparkles size={14} />
        <span>AI CAREER INTELLIGENCE PLATFORM</span>
      </div>

      <h1 className="hero-heading">
        Match Smarter. Improve Faster. <span className="hero-gradient-text">Get Hired.</span>
      </h1>

      <p className="hero-subtext">
        Compare your resume with real job descriptions, discover skill gaps, and build stronger job applications with AI-powered career intelligence.
      </p>

      <div className="hero-ctas">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/dashboard')}
        >
          <span>Get Started</span>
          <ArrowRight size={18} />
        </button>

        <button
          className="btn btn-secondary btn-lg"
          onClick={() => navigate('/dashboard')}
        >
          <Compass size={18} />
          <span>Explore Platform</span>
        </button>
      </div>
    </section>
  );
};

export default Hero;
