import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (user && ['/login', '/forgot-password', '/reset-password', '/'].includes(location.pathname)) {
    return <Navigate to="/onboarding/system-admin/dashboard" replace />;
  }

  return <>{children}</>;
}; 