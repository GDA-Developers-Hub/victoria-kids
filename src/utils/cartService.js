/**
 * Cart service for handling shopping cart operations
 * Supports both authenticated API and local storage carts
 */
import { authService } from './authService';
import { api, toast } from './api';

class CartService {
  constructor() {
    this.storageAvailable = typeof window !== 'undefined' && window.localStorage;
    this.CART_KEY = 'victoria_kids_cart';
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return authService.isAuthenticated();
  }

  /**
   * Get current cart items
   * @returns {Promise<Array>} - Cart items
   */
  async getCart() {
    try {
      // If authenticated, get cart from API
      if (this.isAuthenticated()) {
        const response = await api.cart.get();
        return response || [];
      }
      
      // Otherwise, get from local storage
      if (!this.storageAvailable) return [];
      
      try {
        const cart = localStorage.getItem(this.CART_KEY);
        return cart ? JSON.parse(cart) : [];
      } catch (error) {
        console.error('Error getting cart from local storage:', error);
        return [];
      }
    } catch (error) {
      console.error('Error getting cart:', error);
      
      // If API fails, fall back to local storage
      if (this.storageAvailable) {
        try {
          const cart = localStorage.getItem(this.CART_KEY);
          return cart ? JSON.parse(cart) : [];
        } catch (error) {
          console.error('Error getting cart from local storage:', error);
          return [];
        }
      }
      
      return [];
    }
  }

  /**
   * Get cart item count
   * @returns {Promise<number>} - Number of items in cart
   */
  async getCartCount() {
    const cart = await this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Add product to cart
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @param {Object} [options] - Additional options (size, color, etc.)
   * @returns {Promise<Array>} - Updated cart
   */
  async addToCart(productId, quantity = 1, options = {}) {
    if (!productId) throw new Error('Product ID is required');
    
    try {
      // Ensure productId is a string
      const productIdStr = String(productId);
      
      // If authenticated, use API
      if (this.isAuthenticated()) {
        const response = await api.cart.addItem(productIdStr, quantity, options);
        toast.success('Product added to cart');
        return response || [];
      }
      
      // Otherwise, use local storage
      const cart = await this.getCart();
      const existingItemIndex = cart.findIndex(item => {
        // Match both product ID and options (if specified)
        if (Object.keys(options).length === 0) {
          return item.productId === productIdStr;
        }
        
        return item.productId === productIdStr && 
          JSON.stringify(item.options || {}) === JSON.stringify(options);
      });
      
      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.push({
          productId: productIdStr,
          quantity,
          options,
          dateAdded: new Date().toISOString()
        });
      }
      
      if (this.storageAvailable) {
        localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      }
      
      toast.success('Product added to cart');
      return cart;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Update item quantity in cart
   * @param {string} productId - Product ID or item ID (for API)
   * @param {number} quantity - New quantity
   * @param {Object} [options] - Additional options for local storage cart
   * @returns {Promise<Array>} - Updated cart
   */
  async updateCartItem(productId, quantity, options = {}) {
    if (!productId) throw new Error('Product ID is required');
    if (quantity < 1) return this.removeFromCart(productId, options);
    
    try {
      // If authenticated, use API
      if (this.isAuthenticated()) {
        const response = await api.cart.updateItem(productId, quantity);
        toast.success('Cart updated');
        return response || [];
      }
      
      // Otherwise, use local storage
      const cart = await this.getCart();
      const existingItemIndex = cart.findIndex(item => {
        // Match both product ID and options (if specified)
        if (Object.keys(options).length === 0) {
          return item.productId === productId;
        }
        
        return item.productId === productId && 
          JSON.stringify(item.options || {}) === JSON.stringify(options);
      });
      
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity = quantity;
        
        if (this.storageAvailable) {
          localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
        }
      }
      
      return cart;
    } catch (error) {
      console.error('Error updating cart item:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update cart';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Remove item from cart
   * @param {string} productId - Product ID or item ID (for API)
   * @param {Object} [options] - Additional options for local storage cart
   * @returns {Promise<Array>} - Updated cart
   */
  async removeFromCart(productId, options = {}) {
    if (!productId) throw new Error('Product ID is required');
    
    try {
      // If authenticated, use API
      if (this.isAuthenticated()) {
        const response = await api.cart.removeItem(productId);
        toast.success('Item removed from cart');
        return response || [];
      }
      
      // Otherwise, use local storage
      let cart = await this.getCart();
      
      if (Object.keys(options).length === 0) {
        // Remove item by product ID only
        cart = cart.filter(item => item.productId !== productId);
      } else {
        // Remove item by product ID and options
        cart = cart.filter(item => {
          return item.productId !== productId || 
            JSON.stringify(item.options || {}) !== JSON.stringify(options);
        });
      }
      
      if (this.storageAvailable) {
        localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      }
      
      toast.success('Item removed from cart');
      return cart;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Clear entire cart
   * @returns {Promise<Array>} - Empty cart
   */
  async clearCart() {
    try {
      // If authenticated, use API
      if (this.isAuthenticated()) {
        await api.cart.clear();
        toast.success('Cart cleared');
        return [];
      }
      
      // Otherwise, use local storage
      if (this.storageAvailable) {
        localStorage.setItem(this.CART_KEY, JSON.stringify([]));
      }
      
      return [];
    } catch (error) {
      console.error('Error clearing cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Sync local cart with user's account after login
   * @returns {Promise<Array>} - Updated cart
   */
  async syncCartAfterLogin() {
    if (!this.isAuthenticated()) return [];
    
    try {
      // Get local cart
      const localCart = this.storageAvailable ? JSON.parse(localStorage.getItem(this.CART_KEY) || '[]') : [];
      
      // If local cart is empty, just return the server cart
      if (localCart.length === 0) {
        const response = await api.cart.get();
        return response || [];
      }
      
      // Otherwise, add each local item to the server cart
      for (const item of localCart) {
        await api.cart.addItem(item.productId, item.quantity, item.options || {});
      }
      
      // Clear local cart
      if (this.storageAvailable) {
        localStorage.setItem(this.CART_KEY, JSON.stringify([]));
      }
      
      // Return updated server cart
      const response = await api.cart.get();
      return response || [];
    } catch (error) {
      console.error('Error syncing cart after login:', error);
      return this.getCart(); // Fall back to whatever cart we can retrieve
    }
  }
}

export const cartService = new CartService();
