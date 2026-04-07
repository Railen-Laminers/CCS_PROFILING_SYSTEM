import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Protected route - only authenticated users can access
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Role-based protected route
export const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    const redirectPath = user?.role === 'student' 
      ? '/student/dashboard' 
      : user?.role === 'faculty' 
        ? '/faculty/dashboard' 
        : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Public route - authenticated users should not access (like login page)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    const redirectPath = '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};