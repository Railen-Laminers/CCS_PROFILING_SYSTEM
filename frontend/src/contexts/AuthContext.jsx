import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const controller = new AbortController();
    const checkAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          const currentUser = await authAPI.getMe(controller.signal);
          setUser(currentUser);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
          console.error('Auth check failed:', err);
          setError('Session expired or invalid');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    return () => controller.abort();
  }, []);

  const login = async (identifier, password) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      setError(null);
      const userData = await authAPI.login(identifier, password);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMsg = err.data?.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const logout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await authAPI.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isProcessing,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
