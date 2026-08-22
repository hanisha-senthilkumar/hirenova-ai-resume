import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { signIn, isSignedIn, loading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isSignedIn, navigate]);

  const handlePuterSignIn = async () => {
    const success = await signIn();
    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="hn-card login-card">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-icon">
            <Sparkles size={24} />
          </div>
          <h1 className="login-brand-title">HireNova</h1>
          <p className="login-brand-sub">AI CAREER INTELLIGENCE</p>
        </div>

        {/* Card Content */}
        <div className="login-form-area">
          <h2 className="login-form-title">Welcome to HireNova</h2>
          <p className="login-form-desc">
            AI-powered resume and job matching.
          </p>

          {/* Error Banner */}
          {authError && (
            <div className="login-error-banner animate-fade-in">
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="button"
            className="btn btn-primary w-full login-btn"
            onClick={handlePuterSignIn}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="btn-spinner" size={18} />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Continue with Puter</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="login-subtext-note">
            Sign in securely with your Puter account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
