import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';

// HireNova Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import JobMatcherPage from './pages/JobMatcherPage';
import BuildAtsResumePage from './pages/BuildAtsResumePage';
import RecommendedJobsPage from './pages/RecommendedJobsPage';
import ProjectsPage from './pages/ProjectsPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <div className="app-container">
          {/* Background Soft Atmosphere Layer */}
          <div className="bg-atmosphere" />

          {/* One-Time Onboarding Profile Setup Modal */}
          <ProfileSetupModal />

          {/* Persistent Navbar */}
          <Navbar />

          {/* Main App Routes */}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Core AI Platform Pages */}
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
              <Route
                path="/build-resume"
                element={
                  <ProtectedRoute>
                    <BuildAtsResumePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommended-jobs"
                element={
                  <ProtectedRoute>
                    <RecommendedJobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <ProtectedRoute>
                    <CareerRoadmapPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Legacy route redirects */}
              <Route path="/build-ats-resume" element={<Navigate to="/build-resume" replace />} />
              <Route path="/compare-resumes" element={<Navigate to="/job-matcher" replace />} />
              <Route path="/ai-mock-interview" element={<Navigate to="/dashboard" replace />} />

              {/* Fallback Catch-all Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>

          {/* Persistent Footer */}
          <Footer />
        </div>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
