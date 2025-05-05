/**
 * Real category service that connects to the backend API
 */
import { api, toast } from './api';

// Fallback mock data for development and testing
const mockCategories = [
  {
    id: '1',
    name: 'Baby Clothing',
    slug: 'baby-clothing',
    description: 'Comfortable and stylish clothing for babies',
    image: 'https://example.com/images/categories/baby-clothing.jpg',
    count: 42,
    featured: true
  },
  {
    id: '2',
    name: 'Toys',
    slug: 'toys',
    description: 'Educational and fun toys for children of all ages',
    image: 'https://example.com/images/categories/toys.jpg',
    count: 36,
    featured: true
  },
  // Add more mock categories as needed for testing
];

// Category service with real API integration
export const categoryService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.categories.getAll();
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock category data as fallback');
        return { categories: mockCategories };
      }
      
      throw error;
    }
  },

  // Get featured categories
  getFeaturedCategories: async () => {
    try {
      const response = await api.categories.getFeatured();
      return response;
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock featured category data as fallback');
        const featuredCategories = mockCategories.filter(category => category.featured);
        return { categories: featuredCategories };
      }
      
      throw error;
    }
  },

  // Get a category by ID
  getCategoryById: async (id) => {
    if (!id) return { category: null };
    
    try {
      const response = await api.categories.getById(id);
      return response;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock category data as fallback');
        const category = mockCategories.find(c => c.id === id);
        return { category };
      }
      
      throw error;
    }
  },

  // Get a category by slug
  getCategoryBySlug: async (slug) => {
    if (!slug) return { category: null };
    
    try {
      const response = await api.categories.getBySlug(slug);
      return response;
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock category data as fallback');
        const category = mockCategories.find(c => c.slug === slug);
        return { category };
      }
      
      throw error;
    }
  },

  // Create a new category (admin function)
  createCategory: async (categoryData) => {
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
  },

  // Update a category (admin function)
  updateCategory: async (id, categoryData) => {
    if (!id) throw new Error('Category ID is required');
    
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
  },

  // Delete a category (admin function)
  deleteCategory: async (id) => {
    if (!id) throw new Error('Category ID is required');
    
    try {
      const response = await api.categories.delete(id);
      toast.success('Category deleted successfully');
      return response;
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
};

export default categoryService;
