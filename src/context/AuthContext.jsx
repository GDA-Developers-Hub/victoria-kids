import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../utils/authService';
import { cartService } from '../utils/cartService';
import { favoriteService } from '../utils/favoriteService';
import { toast } from '../utils/api';

// Create auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state from local storage
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password, isAdmin = false) => {
    setLoading(true);
    try {
      const userData = await authService.login(email, password, isAdmin);
      setUser(userData);

      // Sync cart and favorites after login
      await Promise.all([
        cartService.syncCartAfterLogin(),
        favoriteService.syncFavoritesAfterLogin()
      ]);

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);

      // Sync cart and favorites after registration
      await Promise.all([
        cartService.syncCartAfterLogin(),
        favoriteService.syncFavoritesAfterLogin()
      ]);

      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setLoading(true);
    try {
      authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    try {
      return await authService.resetPassword(token, newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Context value
  const value = {
    user,
    loading,
    initialized,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
