/**
 * Authentication service for handling user authentication
 */
import { api, toast } from './api';

class AuthService {
  constructor() {
    // Check if localStorage is available
    this.storageAvailable = typeof window !== 'undefined' && window.localStorage;
    // Use 'token' as key to match what's used in API interceptor
    this.TOKEN_KEY = 'token';
    this.USER_KEY = 'user';
    this.REFRESH_TOKEN_KEY = 'refreshToken';
  }

  /**
   * Log in a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} [isAdmin=false] - Whether this is an admin login
   * @returns {Promise<object>} - User data
   */
  async login(email, password, isAdmin = false) {
    try {
      // Call the appropriate API endpoint based on user type
      const response = isAdmin 
        ? await api.auth.adminLogin({ email, password })
        : await api.auth.login({ email, password });
      
      console.log('Login response:', response); // Debug log
      
      // Ensure we have user and token data
      if (this.storageAvailable && response.user && response.token) {
        // Store access token
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        
        // Store refresh token if available
        if (response.refreshToken) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
          console.log('Refresh token stored');
        }
        
        toast.success(`Welcome back, ${response.user.name}!`);
        return response.user;
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback mock login for development
      if (process.env.NODE_ENV === 'development' && email === 'admin@example.com' && password === 'password') {
        console.warn('Using mock authentication as fallback');
        
        const userData = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        };
        
        const token = 'mock_token_' + Math.random().toString(36).substring(2);
        
        if (this.storageAvailable) {
          localStorage.setItem(this.TOKEN_KEY, token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        }
        
        toast.success(`Welcome back, ${userData.name}! (Development Mode)`);
        return userData;
      }
      
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      toast.error(`Authentication failed: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} - User data
   */
  async register(userData) {
    try {
      const response = await api.auth.register(userData);
      
      console.log('Registration response:', response); // Debug log
      
      // Ensure we have user and token data
      if (this.storageAvailable && response.user && response.token) {
        // Store access token
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        
        // Store refresh token if available
        if (response.refreshToken) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
          console.log('Refresh token stored');
        }
        
        toast.success('Registration successful! Welcome to Victoria Kids Shop.');
        return response.user;
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(`Registration failed: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<boolean>} - Success status
   */
  async forgotPassword(email) {
    try {
      await api.auth.forgotPassword(email);
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Password reset request failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} - Success status
   */
  async resetPassword(token, newPassword) {
    try {
      await api.auth.resetPassword(token, newPassword);
      toast.success('Password has been reset successfully. You can now log in.');
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get user profile
   * @returns {Promise<object>} - User profile data
   */
  async getProfile() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Not authenticated');
      }
      
      const profile = await api.auth.getProfile();
      
      // Update stored user data
      if (this.storageAvailable && profile) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(profile));
      }
      
      return profile;
    } catch (error) {
      console.error('Get profile error:', error);
      // If unauthorized, log the user out
      if (error.response?.status === 401) {
        this.logout();
      }
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {object} profileData - Profile data to update
   * @returns {Promise<object>} - Updated user profile
   */
  async updateProfile(profileData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Not authenticated');
      }
      
      const updatedProfile = await api.auth.updateProfile(profileData);
      
      // Update stored user data
      if (this.storageAvailable && updatedProfile) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(updatedProfile));
      }
      
      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Log out the current user
   */
  logout() {
    if (this.storageAvailable) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
    toast.info('You have been logged out');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    if (!this.storageAvailable) return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get current user data
   * @returns {object|null} - User data or null if not logged in
   */
  getCurrentUser() {
    if (!this.storageAvailable || !this.isAuthenticated()) return null;
    
    try {
      return JSON.parse(localStorage.getItem(this.USER_KEY));
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Check if current user is admin
   * @returns {boolean} - Whether user is admin
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  /**
   * Get authentication token
   * @returns {string|null} - Auth token or null
   */
  getToken() {
    if (!this.storageAvailable) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   * @returns {string|null} - Refresh token or null
   */
  getRefreshToken() {
    if (!this.storageAvailable) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
}

export const authService = new AuthService();
