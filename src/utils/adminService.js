/**
 * Admin service for handling admin operations
 */
import { api, toast } from './api';

class AdminService {
  /**
   * Login admin user
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<boolean>} - Success status
   */
  async login(email, password) {
    try {
      const response = await api.auth.adminLogin({ email, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid admin credentials';
      toast.error(errorMessage);
      return false;
    }
  }

  /**
   * Logout admin user
   */
  async logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get admin dashboard statistics
   * @returns {Promise<Object>} - Dashboard statistics
   */
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
      return {
        ordersCount: 0,
        productsCount: 0,
        customersCount: 0,
        revenue: 0,
        recentOrders: [],
        topProducts: []
      };
    }
  }

  /**
   * Get products with pagination and search
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query
   * @returns {Promise<Object>} - Products data
   */
  async getProducts(page = 1, limit = 10, search = '') {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      
      const response = await api.get('/admin/products', { params });
      return {
        products: response.products || [],
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
        totalProducts: response.total || 0
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      return { products: [], totalPages: 1, currentPage: 1, totalProducts: 0 };
    }
  }

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} - Product data
   */
  async getProductById(id) {
    try {
      const response = await api.get(`/admin/products/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      toast.error('Failed to load product');
      return null;
    }
  }

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} - Created product
   */
  async createProduct(productData) {
    try {
      // If images is already a string, we assume it's already properly formatted
      // Otherwise, we need to stringify it
      if (productData.images && typeof productData.images !== 'string') {
        productData.images = JSON.stringify(productData.images);
      }
      
      const response = await api.products.create(productData);
      toast.success('Product created successfully');
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Update product
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} - Updated product
   */
  async updateProduct(id, productData) {
    try {
      const response = await api.products.update(id, productData);
      toast.success('Product updated successfully');
      return response;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteProduct(id) {
    try {
      await api.products.delete(id);
      toast.success('Product deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get categories with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} - Categories data
   */
  async getCategories(page = 1, limit = 10) {
    try {
      const response = await api.get('/categories', { params: { page, limit } });
      
      // Handle both array format and object with categories property
      const categories = Array.isArray(response) ? response : (response.categories || []);
      
      return {
        categories: categories,
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
        totalCategories: response.total || categories.length || 0
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return { categories: [], totalPages: 1, currentPage: 1, totalCategories: 0 };
    }
  }

  /**
   * Create new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} - Created category
   */
  async createCategory(categoryData) {
    try {
      const response = await api.categories.create(categoryData);
      toast.success('Category created successfully');
      return response;
    } catch (error) {
      console.error('Error creating category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create category';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Update category
   * @param {string} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} - Updated category
   */
  async updateCategory(id, categoryData) {
    try {
      const response = await api.categories.update(id, categoryData);
      toast.success('Category updated successfully');
      return response;
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || 'Failed to update category';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete category
   * @param {string} id - Category ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteCategory(id) {
    try {
      await api.categories.delete(id);
      toast.success('Category deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get orders with pagination and filtering
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Order filters
   * @returns {Promise<Object>} - Orders data
   */
  async getOrders(page = 1, limit = 10, filters = {}) {
    try {
      const params = { page, limit, ...filters };
      const response = await api.orders.getAll(params);
      return {
        orders: response.orders || [],
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
        totalOrders: response.total || 0
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      return { orders: [], totalPages: 1, currentPage: 1, totalOrders: 0 };
    }
  }

  /**
   * Update order status
   * @param {string} id - Order ID
   * @param {string} status - New order status
   * @returns {Promise<Object>} - Updated order
   */
  async updateOrderStatus(id, status) {
    try {
      const response = await api.orders.updateStatus(id, status);
      toast.success('Order status updated successfully');
      return response;
    } catch (error) {
      console.error(`Error updating order status for ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get users with pagination and search
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query
   * @returns {Promise<Object>} - Users data
   */
  async getUsers(page = 1, limit = 10, search = '') {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      
      const response = await api.users.getAll(params);
      return {
        users: response.users || [],
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
        totalUsers: response.total || 0
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      return { users: [], totalPages: 1, currentPage: 1, totalUsers: 0 };
    }
  }

  /**
   * Get customers with pagination and search
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query
   * @returns {Promise<Object>} - Customers data
   */
  async getCustomers(page = 1, limit = 10, search = '') {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      
      const response = await api.get('/admin/customers', { params });
      return {
        customers: response.customers || [],
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
        totalCustomers: response.total || 0
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
      return { customers: [], totalPages: 1, currentPage: 1, totalCustomers: 0 };
    }
  }

  /**
   * Get category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object|null>} - Category data or null if not found
   */
  async getCategoryById(id) {
    try {
      const response = await api.get(`/admin/categories/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      toast.error('Failed to load category');
      return null;
    }
  }
}

const adminService = new AdminService();
export default adminService;
