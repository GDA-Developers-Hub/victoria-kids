/**
 * Utility functions for handling images
 */

/**
 * Get product image URL - if the URL is a Firebase URL (contains firebasestorage), 
 * return it directly, otherwise prepend with the appropriate base path
 * 
 * @param {string} imageUrl - The image URL or path
 * @returns {string} - The full image URL
 */
export const getProductImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return '/placeholder.jpg';
  }
  
  // If it's already a complete URL (has http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Otherwise, prepend with base URL
  return `/images/products/${imageUrl}`;
};

/**
 * Get category image URL
 * 
 * @param {string} imageUrl - The image URL or path
 * @returns {string} - The full image URL
 */
export const getCategoryImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return '/placeholder.jpg';
  }
  
  // If it's already a complete URL (has http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Otherwise, prepend with base URL
  return `/images/categories/${imageUrl}`;
};

/**
 * Format file size to human-readable format
 * 
 * @param {number} bytes - The file size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default {
  getProductImageUrl,
  getCategoryImageUrl,
  formatFileSize,
};
