/**
 * Favorites service for handling user favorites/wishlist
 * Supports both authenticated API and local storage
 */
import { authService } from './authService';
import { api, toast } from './api';

class FavoriteService {
  constructor() {
    this.storageAvailable = typeof window !== 'undefined' && window.localStorage;
    this.FAVORITES_KEY = 'victoria_kids_favorites';
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    return authService.isAuthenticated();
  }

  /**
   * Get all favorites
   * @returns {Promise<Array>} - Favorite product IDs
   */
  async getFavorites() {
    try {
      // If authenticated, get favorites from API
      if (this.isAuthenticated()) {
        const response = await api.favorites.getAll();
        return response.items || [];
      }
      
      // Otherwise, get from local storage
      if (!this.storageAvailable) return [];
      
      try {
        const favorites = localStorage.getItem(this.FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
      } catch (error) {
        console.error('Error getting favorites from local storage:', error);
        return [];
      }
    } catch (error) {
      console.error('Error getting favorites:', error);
      
      // If API fails, fall back to local storage
      if (this.storageAvailable) {
        try {
          const favorites = localStorage.getItem(this.FAVORITES_KEY);
          return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
          console.error('Error getting favorites from local storage:', error);
          return [];
        }
      }
      
      return [];
    }
  }

  /**
   * Check if product is in favorites
   * @param {string} productId - Product ID
   * @returns {Promise<boolean>} - Whether product is in favorites
   */
  async checkIsFavorite(productId) {
    if (!productId) return false;
    
    try {
      // If authenticated, check via API
      if (this.isAuthenticated()) {
        const response = await api.favorites.check(productId);
        return response.isFavorite || false;
      }
      
      // Otherwise, check in local storage
      const favorites = await this.getFavorites();
      return favorites.some(item => (
        typeof item === 'object' ? item.productId === productId : item === productId
      ));
    } catch (error) {
      console.error(`Error checking if product ${productId} is in favorites:`, error);
      
      // Fall back to local storage check
      const favorites = await this.getFavorites();
      return favorites.some(item => (
        typeof item === 'object' ? item.productId === productId : item === productId
      ));
    }
  }

  /**
   * Add product to favorites
   * @param {string} productId - Product ID
   * @returns {Promise<Array>} - Updated favorites
   */
  async addToFavorites(productId) {
    if (!productId) throw new Error('Product ID is required');
    
    try {
      // If authenticated, use API
      if (this.isAuthenticated()) {
        const response = await api.favorites.add(productId);
        toast.success('Added to favorites');
        return response.items || [];
      }
      
      // Otherwise, use local storage (requires authentication for favorites)
      toast.warning('Please log in to save favorites');
      throw new Error('Authentication required');
    } catch (error) {
      // Special case for development mode
      if (process.env.NODE_ENV === 'development' && !this.isAuthenticated()) {
        console.warn('Using local storage for favorites in development mode');
        
        const favorites = await this.getFavorites();
        
        if (!favorites.includes(productId)) {
          favorites.push(productId);
          
          if (this.storageAvailable) {
            localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
          }
          
          toast.success('Added to favorites (Development Mode)');
          return favorites;
        }
        
        return favorites;
      }
      
      console.error('Error adding to favorites:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add to favorites';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Remove product from favorites
   * @param {string} productId - Product ID
   * @returns {Promise<Array>} - Updated favorites
   */
  async removeFromFavorites(productId) {
    if (!productId) throw new Error('Product ID is required');
    
    try {
      // If authenticated, use API
      if (this.isAuthenticated()) {
        const response = await api.favorites.remove(productId);
        toast.success('Removed from favorites');
        return response.items || [];
      }
      
      // Otherwise, use local storage (requires authentication for favorites)
      toast.warning('Please log in to manage favorites');
      throw new Error('Authentication required');
    } catch (error) {
      // Special case for development mode
      if (process.env.NODE_ENV === 'development' && !this.isAuthenticated()) {
        console.warn('Using local storage for favorites in development mode');
        
        let favorites = await this.getFavorites();
        favorites = favorites.filter(item => (
          typeof item === 'object' ? item.productId !== productId : item !== productId
        ));
        
        if (this.storageAvailable) {
          localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
        }
        
        toast.success('Removed from favorites (Development Mode)');
        return favorites;
      }
      
      console.error('Error removing from favorites:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove from favorites';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Toggle product in favorites
   * @param {string} productId - Product ID
   * @returns {Promise<{favorites: Array, isFavorite: boolean}>} - Updated favorites and status
   */
  async toggleFavorite(productId) {
    if (!productId) throw new Error('Product ID is required');
    
    try {
      const isFavorite = await this.checkIsFavorite(productId);
      
      let favorites;
      if (isFavorite) {
        favorites = await this.removeFromFavorites(productId);
        return { favorites, isFavorite: false };
      } else {
        favorites = await this.addToFavorites(productId);
        return { favorites, isFavorite: true };
      }
    } catch (error) {
      // If not authenticated, prompt to log in
      if (error.message.includes('Authentication required')) {
        throw error; // Re-throw to handle at component level
      }
      
      console.error('Error toggling favorite:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update favorites';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get favorites count
   * @returns {Promise<number>} - Number of favorites
   */
  async getFavoritesCount() {
    const favorites = await this.getFavorites();
    return favorites.length;
  }
  
  /**
   * Sync local favorites with user's account after login
   * @returns {Promise<Array>} - Updated favorites list
   */
  async syncFavoritesAfterLogin() {
    if (!this.isAuthenticated()) return [];
    
    try {
      // Get local favorites
      const localFavorites = this.storageAvailable ? 
        JSON.parse(localStorage.getItem(this.FAVORITES_KEY) || '[]') : [];
      
      // If local favorites is empty, just return the server favorites
      if (localFavorites.length === 0) {
        return (await api.favorites.getAll()).items || [];
      }
      
      // Otherwise, add each local favorite to the server
      for (const item of localFavorites) {
        const productId = typeof item === 'object' ? item.productId : item;
        // Check if item is already in favorites to avoid duplicates
        const isAlreadyFavorite = await this.checkIsFavorite(productId);
        if (!isAlreadyFavorite) {
          await api.favorites.add(productId);
        }
      }
      
      // Clear local favorites
      if (this.storageAvailable) {
        localStorage.setItem(this.FAVORITES_KEY, JSON.stringify([]));
      }
      
      // Return updated server favorites
      return (await api.favorites.getAll()).items || [];
    } catch (error) {
      console.error('Error syncing favorites after login:', error);
      return this.getFavorites(); // Fall back to whatever favorites we can retrieve
    }
  }
}

export const favoriteService = new FavoriteService();
