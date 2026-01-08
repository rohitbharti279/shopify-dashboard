import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Manages frontend authentication state
 * Stores: token, user info, isAuthenticated status
 * Provides: login, logout, continueAsGuest functions
 * Persists data in localStorage for session management
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps the entire app to provide auth context
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state from localStorage on app load
   * This ensures user stays logged in after page refresh
   */
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    const savedIsGuest = localStorage.getItem('guestMode');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setIsGuest(false);
    } else if (savedIsGuest === 'true') {
      setIsGuest(true);
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  /**
   * Login function - Authenticates user with email and password
   * For now: generates mock JWT token
   * Later: will exchange credentials for real JWT from backend
   */
  const login = (email, userName = null) => {
    // Mock JWT token (in production, this comes from backend)
    const mockToken = `fake-jwt-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const userData = {
      email,
      name: userName || email.split('@')[0],
      loginTime: new Date().toISOString(),
    };

    setToken(mockToken);
    setUser(userData);
    setIsAuthenticated(true);
    setIsGuest(false);

    // Persist to localStorage
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    localStorage.removeItem('guestMode');
  };

  /**
   * Logout function - Clears all auth state
   * Removes token and user data from state and localStorage
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('guestMode');
  };

  /**
   * Continue as Guest - Allows limited access without authentication
   * Guest users have no token and limited functionality
   */
  const continueAsGuest = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(true);

    // Clear auth data but mark as guest
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.setItem('guestMode', 'true');
  };

  /**
   * Check if user is authenticated
   */
  const isLoggedIn = () => isAuthenticated && token !== null;

  /**
   * Context value object
   */
  const value = {
    // State
    token,
    user,
    isAuthenticated,
    isGuest,
    isLoading,

    // Methods
    login,
    logout,
    continueAsGuest,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook - Easy access to auth context
 * Usage: const auth = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
