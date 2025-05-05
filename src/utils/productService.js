/**
 * Product service for handling product data
 */
import { api } from './api';

// Product type definition for JSDoc
/**
 * @typedef {Object} Product
 * @property {string} id - Product ID
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {number} price - Current price
 * @property {number} [originalPrice] - Original price before discount
 * @property {string} category - Product category
 * @property {number} stock - Stock quantity
 * @property {string[]} [images] - Array of image URLs
 * @property {string} [image] - Main product image
 * @property {boolean} [isNew] - Whether product is new
 * @property {boolean} [isBudget] - Whether product is a budget pick
 * @property {boolean} [isLuxury] - Whether product is a luxury item
 * @property {number} rating - Product rating (0-5)
 * @property {number} reviews - Number of reviews
 * @property {string[]} [sizes] - Available sizes
 * @property {Array<{name: string, code: string}>} [colors] - Available colors
 */

// Fallback mock data in case API fails
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Baby Soft Carrier',
    description: 'Super comfortable baby carrier with ergonomic design for parent and baby comfort. Suitable for babies 0-3 years.',
    price: 3999.99,
    originalPrice: 4999.99,
    category: 'Carriers',
    stock: 15,
    images: ['/products/carrier1.jpg', '/products/carrier2.jpg', '/products/carrier3.jpg'],
    isNew: true,
    rating: 4.7,
    reviews: 124,
    sizes: ['0-12m', '12-36m'],
    colors: [
      { name: 'Blue', code: '#2196f3' },
      { name: 'Pink', code: '#e91e63' },
      { name: 'Gray', code: '#9e9e9e' }
    ]
  },
  // More mock products...
];

class ProductService {
  /**
   * Get all products with filtering, sorting, and pagination
   * @param {Object} options - Query options
   * @param {number} [options.page=1] - Current page
   * @param {number} [options.limit=10] - Items per page
   * @param {string} [options.category] - Filter by category
   * @param {string} [options.search] - Search term
   * @param {string} [options.sort] - Sort field
   * @param {string} [options.order='asc'] - Sort order (asc/desc)
   * @returns {Promise<{data: Product[], total: number, page: number, limit: number}>}
   */
  async getProducts({ page = 1, limit = 10, category, search, sort, order = 'asc' } = {}) {
    try {
      // Prepare query parameters
      const params = { page, limit, order };
      
      if (category) params.category = category;
      if (search) params.search = search;
      if (sort) params.sort = sort;
      
      // Call the API
      const response = await api.products.getAll(params);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Fallback to mock data in development environment
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data as fallback');
        let filtered = [...MOCK_PRODUCTS];
        
        // Apply category filter
        if (category) {
          filtered = filtered.filter(product => 
            product.category.toLowerCase() === category.toLowerCase());
        }
        
        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchLower) || 
            product.description.toLowerCase().includes(searchLower));
        }
        
        // Apply sorting
        if (sort) {
          filtered.sort((a, b) => {
            const aValue = a[sort];
            const bValue = b[sort];
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return order === 'asc' 
                ? aValue.localeCompare(bValue) 
                : bValue.localeCompare(aValue);
            }
            
            return order === 'asc' ? aValue - bValue : bValue - aValue;
          });
        }
        
        // Apply pagination
        const startIndex = (page - 1) * limit;
        const paginatedData = filtered.slice(startIndex, startIndex + limit);
        
        return {
          data: paginatedData,
          total: filtered.length,
          page,
          limit
        };
      }
      
      // Return empty result in production
      return { data: [], total: 0, page, limit };
    }
  }

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Product|null>} - Product or null if not found
   */
  async getProductById(id) {
    if (!id) return null;
    
    try {
      const product = await api.products.getById(id);
      return product;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      
      // Fallback to mock data in development environment
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data as fallback');
        const product = MOCK_PRODUCTS.find(p => p.id === id);
        return product || null;
      }
      
      return null;
    }
  }

  /**
   * Get featured products (newest and top-rated)
   * @param {number} [limit=4] - Number of products to return
   * @returns {Promise<Product[]>} - Featured products
   */
  async getFeaturedProducts(limit = 4) {
    try {
      const featuredProducts = await api.products.getFeatured();
      return featuredProducts.slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      
      // Fallback to mock data in development environment
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data as fallback');
        const newProducts = MOCK_PRODUCTS.filter(p => p.isNew).slice(0, Math.ceil(limit/2));
        const topRated = MOCK_PRODUCTS
          .filter(p => !p.isNew)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit - newProducts.length);
        
        return [...newProducts, ...topRated];
      }
      
      return [];
    }
  }

  /**
   * Get related products (same category)
   * @param {string} productId - Current product ID
   * @param {number} [limit=4] - Number of products to return
   * @returns {Promise<Product[]>} - Related products
   */
  async getRelatedProducts(productId, limit = 4) {
    if (!productId) return [];
    
    try {
      const relatedProducts = await api.products.getRelated(productId);
      return relatedProducts.slice(0, limit);
    } catch (error) {
      console.error(`Error fetching related products for product ID ${productId}:`, error);
      
      // Fallback to mock data in development environment
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data as fallback');
        const currentProduct = MOCK_PRODUCTS.find(p => p.id === productId);
        if (!currentProduct) return [];
        
        return MOCK_PRODUCTS
          .filter(p => p.id !== productId && p.category === currentProduct.category)
          .slice(0, limit);
      }
      
      return [];
    }
  }
  
  /**
   * Search products by query
   * @param {string} query - Search query
   * @param {number} [limit=10] - Number of products to return
   * @returns {Promise<Product[]>} - Search results
   */
  async searchProducts(query, limit = 10) {
    if (!query) return [];
    
    try {
      const searchResults = await api.products.search(query);
      return searchResults.slice(0, limit);
    } catch (error) {
      console.error(`Error searching products with query ${query}:`, error);
      
      // Fallback to mock data in development environment
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data as fallback');
        const searchLower = query.toLowerCase();
        return MOCK_PRODUCTS
          .filter(product => 
            product.name.toLowerCase().includes(searchLower) || 
            product.description.toLowerCase().includes(searchLower))
          .slice(0, limit);
      }
      
      return [];
    }
  }
}

export const productService = new ProductService();
