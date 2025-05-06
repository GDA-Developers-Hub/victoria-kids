// API utility functions
import axios from 'axios';

// API base URL - change this to your actual backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// List of authentication endpoints that shouldn't have auth token headers
const authEndpoints = [
  '/auth/login',
  '/auth/admin/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email'
];

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Don't add authorization headers to auth endpoints
    const isAuthEndpoint = authEndpoints.some(endpoint => 
      config.url && config.url.includes(endpoint)
    );
    
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    
    // Handle token expiration
    if (response && response.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      // Only redirect if we're not already on a login page
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath.includes('/login') || currentPath.includes('/admin/login');
      
      if (!isLoginPage) {
        // Redirect to login
        if (currentPath.includes('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
        
        toast.error('Your session has expired. Please log in again.');
      }
    }
    
    // Handle server errors
    if (response && response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// API utility methods
export const api = {
  // Generic HTTP methods
  get: (url, params) => apiClient.get(url, { params }),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  patch: (url, data) => apiClient.patch(url, data),
  delete: (url) => apiClient.delete(url),
  
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    adminLogin: (credentials) => apiClient.post('/auth/admin/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => 
      apiClient.post('/auth/reset-password', { token, newPassword }),
    verifyEmail: (token) => apiClient.get(`/auth/verify-email/${token}`),
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (data) => apiClient.put('/auth/profile', data),
  },
  
  // Product endpoints
  products: {
    getAll: (params) => apiClient.get('/admin/products', { params }),
    getById: (id) => apiClient.get(`/products/${String(id)}`),
    getByCategory: (categoryName, params) => 
      apiClient.get(`/products/category/${categoryName}`, { params }),
    getRelated: (id) => apiClient.get(`/products/${String(id)}/related`),
    getFeatured: () => apiClient.get('/products/featured'),
    search: (query) => apiClient.get(`/products/search?q=${query}`),
    
    // Admin product operations
    create: (productData) => apiClient.post('/products', productData),
    update: (id, productData) => apiClient.put(`/products/${String(id)}`, productData),
    delete: (id) => apiClient.delete(`/products/${String(id)}`),
    uploadImage: (productId, formData) => {
      return apiClient.post(`/admin/products/${String(productId)}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
  },
  
  // Category endpoints
  categories: {
    getAll: () => apiClient.get('/categories'),
    getById: (id) => apiClient.get(`/categories/${id}`),
    getBySlug: (slug) => apiClient.get(`/categories/slug/${slug}`),
    getFeatured: () => apiClient.get('/categories/featured'),
    getProducts: (slug) => apiClient.get(`/categories/${slug}/products`),
    
    // Admin category operations
    create: (categoryData) => apiClient.post('/categories', categoryData),
    update: (id, categoryData) => apiClient.put(`/categories/${id}`, categoryData),
    delete: (id) => apiClient.delete(`/categories/${id}`),
  },
  
  // Cart endpoints
  cart: {
    get: () => apiClient.get('/cart'),
    addItem: (productId, quantity, options) => 
      apiClient.post('/cart', { product_id: String(productId), quantity, options }),
    updateItem: (itemId, quantity) => 
      apiClient.put(`/cart/${itemId}`, { quantity }),
    removeItem: (itemId) => apiClient.delete(`/cart/${itemId}`),
    clear: () => apiClient.delete('/cart'),
  },
  
  // Order endpoints
  orders: {
    create: (orderData) => apiClient.post('/orders', orderData),
    getById: (id) => apiClient.get(`/orders/${id}`),
    getUserOrders: () => apiClient.get('/orders/user'),
    
    // Admin order operations
    getAll: (params) => apiClient.get('/admin/orders', { params }),
    updateStatus: (id, status) => 
      apiClient.patch(`/admin/orders/${id}/status`, { status }),
  },
  
  // User endpoints (admin)
  users: {
    getAll: (params) => apiClient.get('/admin/users', { params }),
    getById: (id) => apiClient.get(`/admin/users/${id}`),
    create: (userData) => apiClient.post('/admin/users', userData),
    update: (id, userData) => apiClient.put(`/admin/users/${id}`, userData),
    delete: (id) => apiClient.delete(`/admin/users/${id}`),
  },
  
  // Newsletter endpoints
  newsletter: {
    subscribe: (email) => apiClient.post('/newsletter/subscribe', { email }),
    unsubscribe: (token) => apiClient.get(`/newsletter/unsubscribe/${token}`),
    
    // Admin newsletter operations
    getSubscribers: (params) => apiClient.get('/admin/newsletter/subscribers', { params }),
    createCampaign: (campaignData) => apiClient.post('/admin/newsletter/campaigns', campaignData),
    getCampaigns: () => apiClient.get('/admin/newsletter/campaigns'),
    deleteCampaign: (id) => apiClient.delete(`/admin/newsletter/campaigns/${id}`),
  },
  
  // Analytics endpoints (admin)
  analytics: {
    getSummary: (period) => apiClient.get(`/admin/analytics/summary?period=${period}`),
    getSalesByCategory: (period) => apiClient.get(`/admin/analytics/sales-by-category?period=${period}`),
    getTopProducts: (period) => apiClient.get(`/admin/analytics/top-products?period=${period}`),
    getRevenueTimeline: (period) => apiClient.get(`/admin/analytics/revenue?period=${period}`),
  },
  
  // Favorites/Wishlist endpoints
  favorites: {
    getAll: () => apiClient.get('/favorites'),
    add: (productId) => apiClient.post('/favorites', { product_id: String(productId) }),
    remove: (productId) => apiClient.delete(`/favorites/${String(productId)}`),
    check: (productId) => apiClient.get(`/favorites/check/${String(productId)}`),
  },
};

// Simple toast notification system
export const toast = {
  success: (message) => {
    console.log('SUCCESS:', message);
    // In a real implementation, you would show a toast notification
    alert('SUCCESS: ' + message);
  },
  
  error: (message) => {
    console.error('ERROR:', message);
    // In a real implementation, you would show a toast notification
    alert('ERROR: ' + message);
  },
  
  info: (message) => {
    console.info('INFO:', message);
    // In a real implementation, you would show a toast notification
    alert('INFO: ' + message);
  },
  
  warning: (message) => {
    console.warn('WARNING:', message);
    // In a real implementation, you would show a toast notification
    alert('WARNING: ' + message);
  }
};

export default {
  api,
  toast
};
