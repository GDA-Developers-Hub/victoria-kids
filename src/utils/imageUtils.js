// Utility functions for handling images

/**
 * Generates a URL for a product image
 * @param {string} path - The image path
 * @returns {string} - Full image URL
 */
export const getProductImageUrl = (path) => {
  // If path already has a full URL, return it
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }
  
  // Otherwise, construct local URL
  if (path) {
    // For local development with no images, return a placeholder
    if (!path.startsWith('/')) {
      return `/${path}`;
    }
    return path;
  }
  
  // Fallback to placeholder image
  return '/placeholder-image.jpg';
};

export default {
  getProductImageUrl
};
