import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  LogIn,
  UserPlus,
  ShieldCheck,
  User,
  ShieldAlert,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import './LoginPage.css';

const LoginPage = () => {
  const { signIn, signUp, signInWithPuter, loginAsAdmin, loginAsUser, isSignedIn, user, isAdmin, loading, authError, setAuthError } = useAuth();
  const { loadDemoProfile } = useProfile();
  const navigate = useNavigate();

  // Portal tab: 'user' | 'admin'
  const [portalType, setPortalType] = useState('user');
  const [mode, setMode] = useState('login'); // login | signup

  // User form states
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Alex Morgan');

  // Admin form states
  const [adminEmail, setAdminEmail] = useState('admin@hirenova.ai');
  const [adminPassword, setAdminPassword] = useState('admin123');

  useEffect(() => {
    // If already signed in, navigate based on role
    if (isSignedIn) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isSignedIn, isAdmin, navigate]);

  // Handle Candidate / User Form Submit
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'signup') {
      const res = await signUp(email, password, fullName, 'user');
      if (res?.success) navigate('/dashboard', { replace: true });
    } else {
      const res = await signIn(email, password, fullName, 'user');
      if (res?.success) navigate('/dashboard', { replace: true });
    }
  };

  // Handle Admin Form Submit
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn(adminEmail, adminPassword, 'System Administrator', 'admin');
    if (res?.success) {
      navigate('/admin', { replace: true });
    }
  };

  // 1-Click Candidate Demo Login
  const handleDemoCandidateSignIn = async (type = 'cloudEngineer') => {
    loadDemoProfile(type);
    const demoName = type === 'cloudEngineer' ? 'Alex Morgan' : 'Sarah Chen';
    const demoEmail = type === 'cloudEngineer' ? 'alex.morgan@example.com' : 'sarah.chen@example.com';
    const res = await loginAsUser(demoName, demoEmail);
    if (res?.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  // 1-Click Admin Demo Login
  const handle1ClickAdminSignIn = async () => {
    const res = await loginAsAdmin();
    if (res?.success) {
      navigate('/admin', { replace: true });
    }
  };

  const handlePuterSignIn = async () => {
    const res = await signInWithPuter();
    if (res?.success) {
      if (res.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
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
          <p className="login-brand-sub">AI CAREER & ATS PLATFORM</p>
        </div>

        {/* PRIMARY ROLE PORTAL SWITCHER: USER vs ADMIN */}
        <div className="portal-switcher-tabs">
          <button
            type="button"
            className={`portal-tab-btn ${portalType === 'user' ? 'active' : ''}`}
            onClick={() => {
              setPortalType('user');
              setAuthError(null);
            }}
          >
            <User size={16} />
            <span>Job Seeker Login</span>
          </button>

          <button
            type="button"
            className={`portal-tab-btn ${portalType === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setPortalType('admin');
              setAuthError(null);
            }}
          >
            <ShieldCheck size={16} />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Error banner */}
        {authError && (
          <div className="login-error-banner animate-fade-in">
            <AlertCircle size={16} />
            <span>{authError}</span>
          </div>
        )}

        {/* =========================================================================
            VIEW 1: USER / JOB SEEKER LOGIN
           ========================================================================= */}
        {portalType === 'user' && (
          <div className="user-portal-section animate-fade-in">
            {/* Quick 1-Click Candidate Demos */}
            <div className="quick-demo-box">
              <span className="demo-box-label">⚡ 1-Click Candidate Demo:</span>
              <div className="demo-btns-row">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDemoCandidateSignIn('cloudEngineer')}
                >
                  ☁️ Cloud / DevOps Alex
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDemoCandidateSignIn('fullStackDev')}
                >
                  💻 Full Stack Sarah
                </button>
              </div>
            </div>

            {/* Auth Mode (Sign in vs Create Account) */}
            <div className="auth-mode-tabs">
              <button
                type="button"
                className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => setMode('signup')}
              >
                <UserPlus size={15} />
                <span>Create Account</span>
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="login-form">
              {mode === 'signup' && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="hn-input"
                    placeholder="e.g. Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="hn-input"
                  placeholder="candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="hn-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="btn-spinner" size={18} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Account & Enter Dashboard' : 'Sign In as Job Seeker'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="divider-or">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={handlePuterSignIn}
            >
              <span>Sign In with Puter Cloud</span>
            </button>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: ADMIN LOGIN
           ========================================================================= */}
        {portalType === 'admin' && (
          <div className="admin-portal-section animate-fade-in">
            <div className="admin-badge-box">
              <ShieldAlert size={18} className="text-primary" />
              <div>
                <strong>Administrator Access Portal</strong>
                <p>Manage job descriptions, projects catalog, taxonomy, and platform databases.</p>
              </div>
            </div>

            {/* 1-Click Instant Admin Button */}
            <div className="quick-demo-box" style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}>
              <span className="demo-box-label">⚡ 1-Click Instant Admin Login:</span>
              <button
                type="button"
                className="btn btn-primary btn-sm w-full"
                onClick={handle1ClickAdminSignIn}
                style={{ marginTop: '0.25rem' }}
              >
                <KeyRound size={15} />
                <span>Sign In as System Administrator</span>
              </button>
            </div>

            <form onSubmit={handleAdminSubmit} className="login-form">
              <div className="form-group">
                <label>Admin Email</label>
                <input
                  type="email"
                  className="hn-input"
                  placeholder="admin@hirenova.ai"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Admin Password</label>
                <input
                  type="password"
                  className="hn-input"
                  placeholder="admin123"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="btn-spinner" size={18} />
                    <span>Verifying admin credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin Panel</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
