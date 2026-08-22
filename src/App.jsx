import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Core AI-5 Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import JobMatcherPage from './pages/JobMatcherPage';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        {/* Background Soft Lavender/Blue Atmosphere Layer */}
        <div className="bg-atmosphere" />

        {/* Persistent Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes (Require Puter Authentication) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job-matcher"
              element={
                <ProtectedRoute>
                  <JobMatcherPage />
                </ProtectedRoute>
              }
            />

            {/* Redirect Legacy / Unrelated Routes to Dashboard */}
            <Route path="/compare-resumes" element={<Navigate to="/dashboard" replace />} />
            <Route path="/build-ats-resume" element={<Navigate to="/dashboard" replace />} />
            <Route path="/ai-mock-interview" element={<Navigate to="/dashboard" replace />} />
            <Route path="/profile" element={<Navigate to="/dashboard" replace />} />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Persistent Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
