import React, { createContext, useState, useEffect } from 'react';
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
          if (err.response?.status === 401) {
            sessionStorage.removeItem('authToken');
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
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
      const response = await authAPI.login(identifier, password);
      
      if (response.require2FA) {
        return response; // Return the 2FA required info
      }

      setUser(response.user);
      return response.user;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const verify2FA = async (userId, otp) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      setError(null);
      const response = await authAPI.verify2FA(userId, otp);
      setUser(response.user);
      return response.user;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Verification failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const toggle2FA = async (enabled) => {
    try {
      setError(null);
      const updatedUser = await authAPI.toggle2FA(enabled);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update 2FA status';
      setError(errorMsg);
      throw err;
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
      setError('Logout failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // --- NEW: refreshUser method ---
  const refreshUser = async () => {
    if (!authAPI.isAuthenticated()) return;
    try {
      const currentUser = await authAPI.getMe();
      setUser(currentUser);
    } catch (err) {
      console.error('Failed to refresh user:', err);
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
        verify2FA,
        toggle2FA,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};