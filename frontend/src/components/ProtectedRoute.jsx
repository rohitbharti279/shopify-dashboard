import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

/**
 * ProtectedRoute Component
 * 
 * Checks if user is authenticated before allowing access to protected routes
 * If user is not authenticated, redirects to login page
 * 
 * Usage:
 * <ProtectedRoute>
 *   <Profile />
 * </ProtectedRoute>
 */
function ProtectedRoute({ children }) {
const { isAuthenticated, isGuest, isLoading } = useAuth();


  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
if (!isAuthenticated && !isGuest) {
  return <Navigate to="/login" replace />;
}


  // User is authenticated, render the protected component
  return children;
}

export default ProtectedRoute;
