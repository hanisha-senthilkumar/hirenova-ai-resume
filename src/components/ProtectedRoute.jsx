import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-loader-container">
        <Loader2 className="protected-spinner" size={32} />
        <span className="protected-loader-text">Checking your session...</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
