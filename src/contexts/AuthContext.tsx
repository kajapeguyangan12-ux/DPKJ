"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { AuthUser, LoginCredentials } from '../lib/authenticationService';
import { clearAllAuthData } from '../lib/developmentUtils';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: (userType?: 'admin' | 'masyarakat') => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Check for existing session in localStorage
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('sigede_auth_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log('🔍 AUTH CONTEXT: Found existing session:', userData);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading saved session:', error);
        localStorage.removeItem('sigede_auth_user');
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('🔐 AUTH CONTEXT: Login attempt');
      setLoading(true);
      
      // Clear any existing session first to prevent conflicts
      clearAllAuthData();
      setUser(null);
      
      const authUser = await authService.login(credentials);
      
      // Save to state and localStorage
      setUser(authUser);
      localStorage.setItem('sigede_auth_user', JSON.stringify(authUser));
      
      // Also save userId for backward compatibility
      localStorage.setItem('userId', authUser.uid);
      
      console.log('✅ AUTH CONTEXT: Login successful, userId:', authUser.uid);
    } catch (error) {
      console.error('❌ AUTH CONTEXT: Login failed:', error);
      // Clear everything on login failure
      clearAllAuthData();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (userType: 'admin' | 'masyarakat' = 'admin') => {
    // Prevent multiple logout calls
    if (isLoggingOut) {
      console.log('🚫 AUTH CONTEXT: Logout already in progress');
      return;
    }

    try {
      console.log('🚪 AUTH CONTEXT: Logout attempt for userType:', userType);
      setIsLoggingOut(true);
      
      // Clear auth service first
      await authService.logout();
      
      // Clear state
      setUser(null);
      
      // Use utility to clear all auth data thoroughly
      clearAllAuthData();
      
      console.log('✅ AUTH CONTEXT: Logout successful, redirecting to login');
      
      // Determine redirect path based on user type
      const redirectPath = userType === 'admin' ? '/admin/login' : '/masyarakat/login';
      
      // Force reload to completely reset state
      window.location.href = redirectPath;
      
    } catch (error) {
      console.error('❌ AUTH CONTEXT: Logout failed:', error);
      // Even if logout fails, clear local state and redirect
      setUser(null);
      clearAllAuthData();
      
      const redirectPath = userType === 'admin' ? '/admin/login' : '/masyarakat/login';
      window.location.href = redirectPath;
    } finally {
      setIsLoggingOut(false);
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user ? authService.isAdmin(user.role) : false;

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;