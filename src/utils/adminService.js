// Admin service for dashboard and admin functionalities
const API_URL = 'http://localhost:5000/api';

// Mock data for development (until backend integration)
const mockDashboardStats = {
  totalSales: 1250000,
  totalOrders: 154,
  totalProducts: 87,
  totalCustomers: 312,
  recentOrders: [
    { id: '6532', user_name: 'Jane Smith', created_at: '2025-05-01T08:30:00Z', status: 'delivered', total: 12500 },
    { id: '6531', user_name: 'John Doe', created_at: '2025-04-30T14:20:00Z', status: 'processing', total: 8700 },
    { id: '6530', user_name: 'Alice Johnson', created_at: '2025-04-30T10:15:00Z', status: 'pending', total: 5300 },
    { id: '6529', user_name: 'Bob Williams', created_at: '2025-04-29T16:45:00Z', status: 'delivered', total: 9200 },
    { id: '6528', user_name: 'Mary Davis', created_at: '2025-04-29T09:10:00Z', status: 'cancelled', total: 7600 }
  ],
  topSellingProducts: [
    { id: '1', name: 'Unicorn Dress', category: 'Dresses', sold: 42, revenue: 126000 },
    { id: '2', name: 'Dinosaur T-shirt', category: 'T-shirts', sold: 38, revenue: 95000 },
    { id: '3', name: 'Fairy Princess Shoes', category: 'Shoes', sold: 29, revenue: 87000 },
    { id: '4', name: 'Superhero Cape', category: 'Accessories', sold: 25, revenue: 62500 },
    { id: '5', name: 'Rainbow Leggings', category: 'Bottoms', sold: 21, revenue: 42000 }
  ]
};

// Mock product data
const mockProducts = [
  { id: '1', name: 'Unicorn Dress', category: 'Dresses', price: 2999, stock: 15, imageUrl: '/images/products/unicorn-dress.jpg', status: 'active' },
  { id: '2', name: 'Dinosaur T-shirt', category: 'T-shirts', price: 1499, stock: 23, imageUrl: '/images/products/dino-tshirt.jpg', status: 'active' },
  { id: '3', name: 'Fairy Princess Shoes', category: 'Shoes', price: 3499, stock: 8, imageUrl: '/images/products/fairy-shoes.jpg', status: 'active' },
  { id: '4', name: 'Superhero Cape', category: 'Accessories', price: 1999, stock: 12, imageUrl: '/images/products/hero-cape.jpg', status: 'active' },
  { id: '5', name: 'Rainbow Leggings', category: 'Bottoms', price: 1799, stock: 19, imageUrl: '/images/products/rainbow-leggings.jpg', status: 'active' },
  { id: '6', name: 'Astronaut Helmet', category: 'Accessories', price: 2499, stock: 5, imageUrl: '/images/products/astronaut-helmet.jpg', status: 'active' },
  { id: '7', name: 'Ballet Tutu', category: 'Dresses', price: 2299, stock: 11, imageUrl: '/images/products/ballet-tutu.jpg', status: 'active' },
  { id: '8', name: 'Safari Shorts', category: 'Bottoms', price: 1599, stock: 0, imageUrl: '/images/products/safari-shorts.jpg', status: 'inactive' },
  { id: '9', name: 'Pirate Hat', category: 'Accessories', price: 1299, stock: 7, imageUrl: '/images/products/pirate-hat.jpg', status: 'active' },
  { id: '10', name: 'Princess Tiara', category: 'Accessories', price: 999, stock: 14, imageUrl: '/images/products/princess-tiara.jpg', status: 'active' }
];

// Mock categories data
const mockCategories = [
  { id: '1', name: 'Dresses', slug: 'dresses', description: 'Beautiful dresses for all occasions', image_url: '/images/categories/dresses.jpg', product_count: 24, status: 'active' },
  { id: '2', name: 'T-shirts', slug: 't-shirts', description: 'Comfortable t-shirts with fun designs', image_url: '/images/categories/t-shirts.jpg', product_count: 18, status: 'active' },
  { id: '3', name: 'Shoes', slug: 'shoes', description: 'Stylish and comfortable shoes', image_url: '/images/categories/shoes.jpg', product_count: 12, status: 'active' },
  { id: '4', name: 'Accessories', slug: 'accessories', description: 'Fun accessories to complete any outfit', image_url: '/images/categories/accessories.jpg', product_count: 30, status: 'active' },
  { id: '5', name: 'Bottoms', slug: 'bottoms', description: 'Pants, shorts, and skirts', image_url: '/images/categories/bottoms.jpg', product_count: 15, status: 'active' },
  { id: '6', name: 'Outerwear', slug: 'outerwear', description: 'Jackets, coats, and sweaters', image_url: '/images/categories/outerwear.jpg', product_count: 8, status: 'active' },
  { id: '7', name: 'Pajamas', slug: 'pajamas', description: 'Comfortable sleepwear', image_url: '/images/categories/pajamas.jpg', product_count: 10, status: 'active' },
  { id: '8', name: 'Swimwear', slug: 'swimwear', description: 'Fun swimwear for the beach or pool', image_url: '/images/categories/swimwear.jpg', product_count: 6, status: 'inactive' }
];

// Mock orders data
const mockOrders = [
  { id: '6532', user_name: 'Jane Smith', created_at: '2025-05-01T08:30:00Z', status: 'delivered', total: 12500, items: 3 },
  { id: '6531', user_name: 'John Doe', created_at: '2025-04-30T14:20:00Z', status: 'processing', total: 8700, items: 2 },
  { id: '6530', user_name: 'Alice Johnson', created_at: '2025-04-30T10:15:00Z', status: 'pending', total: 5300, items: 1 },
  { id: '6529', user_name: 'Bob Williams', created_at: '2025-04-29T16:45:00Z', status: 'delivered', total: 9200, items: 2 },
  { id: '6528', user_name: 'Mary Davis', created_at: '2025-04-29T09:10:00Z', status: 'cancelled', total: 7600, items: 3 }
];

// Mock customers data
const mockCustomers = [
  { id: '101', name: 'Jane Smith', email: 'jane.smith@example.com', orders: 8, total_spent: 42500 },
  { id: '102', name: 'John Doe', email: 'john.doe@example.com', orders: 5, total_spent: 27800 },
  { id: '103', name: 'Alice Johnson', email: 'alice.johnson@example.com', orders: 3, total_spent: 15300 },
  { id: '104', name: 'Bob Williams', email: 'bob.williams@example.com', orders: 7, total_spent: 38900 },
  { id: '105', name: 'Mary Davis', email: 'mary.davis@example.com', orders: 4, total_spent: 22400 }
];

// Mock auth data
const mockAuthUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@victoriakids.com',
  role: 'admin',
  isAuthenticated: true
};

// Auth status
let authStatus = {
  isAuthenticated: true,
  user: mockAuthUser
};

const adminService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      // For development, use mock data
      // In production, uncomment the fetch call below
      // const response = await fetch(`${API_URL}/admin/dashboard`);
      // const data = await response.json();
      // return data;
      
      return mockDashboardStats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get products list with pagination and search
  getProducts: async (page = 1, limit = 10, search = '') => {
    try {
      // For development, use mock data
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/products?page=${page}&limit=${limit}&search=${search}`);
      // const data = await response.json();
      // return data;
      
      // Mock pagination and search functionality
      let filteredProducts = mockProducts;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = mockProducts.filter(
          product => 
            product.name.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower)
        );
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      return {
        products: paginatedProducts,
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalProducts: filteredProducts.length,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get a single product by ID
  getProduct: async (productId) => {
    try {
      // For development, use mock data
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/products/${productId}`);
      // const data = await response.json();
      // return data;
      
      const product = mockProducts.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  // Create a new product
  createProduct: async (productData) => {
    try {
      // For development, mock create behavior
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/products`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(productData)
      // });
      // const data = await response.json();
      // return data;
      
      // Mock create behavior
      const newProduct = {
        id: `${mockProducts.length + 1}`,
        ...productData,
        status: 'active'
      };
      
      mockProducts.push(newProduct);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update an existing product
  updateProduct: async (productId, productData) => {
    try {
      // For development, mock update behavior
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(productData)
      // });
      // const data = await response.json();
      // return data;
      
      // Mock update behavior
      const productIndex = mockProducts.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        throw new Error('Product not found');
      }
      
      mockProducts[productIndex] = {
        ...mockProducts[productIndex],
        ...productData
      };
      
      return mockProducts[productIndex];
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      throw error;
    }
  },

  // Delete a product
  deleteProduct: async (productId) => {
    try {
      // For development, mock delete behavior
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      //   method: 'DELETE'
      // });
      // const data = await response.json();
      // return data;
      
      // Mock delete behavior
      const productIndex = mockProducts.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        throw new Error('Product not found');
      }
      
      mockProducts.splice(productIndex, 1);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      throw error;
    }
  },

  // Get orders list
  getOrders: async (page = 1, limit = 10, status = '') => {
    try {
      // For development, use mock data
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/orders?page=${page}&limit=${limit}&status=${status}`);
      // const data = await response.json();
      // return data;
      
      // Mock pagination and filter functionality
      let filteredOrders = mockOrders;
      if (status) {
        filteredOrders = mockOrders.filter(order => order.status === status);
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
      
      return {
        orders: paginatedOrders,
        totalPages: Math.ceil(filteredOrders.length / limit),
        totalOrders: filteredOrders.length,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get customers list
  getCustomers: async (page = 1, limit = 10, search = '') => {
    try {
      // For development, use mock data
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/customers?page=${page}&limit=${limit}&search=${search}`);
      // const data = await response.json();
      // return data;
      
      // Mock pagination and search functionality
      let filteredCustomers = mockCustomers;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredCustomers = mockCustomers.filter(
          customer => 
            customer.name.toLowerCase().includes(searchLower) ||
            customer.email.toLowerCase().includes(searchLower)
        );
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
      
      return {
        customers: paginatedCustomers,
        totalPages: Math.ceil(filteredCustomers.length / limit),
        totalCustomers: filteredCustomers.length,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },
  
  // Categories management
  getCategories: async (page = 1, limit = 10, search = '') => {
    try {
      // For development, use mock data
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/categories?page=${page}&limit=${limit}&search=${search}`);
      // const data = await response.json();
      // return data;
      
      // Mock pagination and search functionality
      let filteredCategories = mockCategories;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredCategories = mockCategories.filter(
          category => 
            category.name.toLowerCase().includes(searchLower) ||
            category.description.toLowerCase().includes(searchLower)
        );
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
      
      return {
        categories: paginatedCategories,
        totalPages: Math.ceil(filteredCategories.length / limit),
        totalCategories: filteredCategories.length,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  // Get a single category by ID
  getCategory: async (categoryId) => {
    try {
      // For development, use mock data
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/categories/${categoryId}`);
      // const data = await response.json();
      // return data;
      
      const category = mockCategories.find(c => c.id === categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      throw error;
    }
  },
  
  // Create a new category
  createCategory: async (categoryData) => {
    try {
      // For development, mock create behavior
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/categories`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(categoryData)
      // });
      // const data = await response.json();
      // return data;
      
      // Mock create behavior
      const newCategory = {
        id: `${mockCategories.length + 1}`,
        ...categoryData,
        product_count: 0,
        status: 'active'
      };
      
      mockCategories.push(newCategory);
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  // Update an existing category
  updateCategory: async (categoryId, categoryData) => {
    try {
      // For development, mock update behavior
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(categoryData)
      // });
      // const data = await response.json();
      // return data;
      
      // Mock update behavior
      const categoryIndex = mockCategories.findIndex(c => c.id === categoryId);
      if (categoryIndex === -1) {
        throw new Error('Category not found');
      }
      
      mockCategories[categoryIndex] = {
        ...mockCategories[categoryIndex],
        ...categoryData
      };
      
      return mockCategories[categoryIndex];
    } catch (error) {
      console.error(`Error updating category ${categoryId}:`, error);
      throw error;
    }
  },
  
  // Delete a category
  deleteCategory: async (categoryId) => {
    try {
      // For development, mock delete behavior
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
      //   method: 'DELETE'
      // });
      // const data = await response.json();
      // return data;
      
      // Mock delete behavior
      const categoryIndex = mockCategories.findIndex(c => c.id === categoryId);
      if (categoryIndex === -1) {
        throw new Error('Category not found');
      }
      
      mockCategories.splice(categoryIndex, 1);
      return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
      console.error(`Error deleting category ${categoryId}:`, error);
      throw error;
    }
  },
  
  // Auth functions
  login: async (credentials) => {
    try {
      // For development, mock login behavior
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/admin/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // const data = await response.json();
      // return data;
      
      // Mock login success
      if (credentials.email === 'admin@victoriakids.com' && credentials.password === 'admin123') {
        authStatus = {
          isAuthenticated: true,
          user: mockAuthUser
        };
        return { success: true, user: mockAuthUser };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    // For development, just reset auth status
    // In production, call logout API endpoint
    authStatus = {
      isAuthenticated: false,
      user: null
    };
    return { success: true };
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return authStatus.isAuthenticated;
  },
  
  // Get current user
  getCurrentUser: () => {
    return authStatus.user;
  }
};

export default adminService;
