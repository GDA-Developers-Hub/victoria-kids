/**
 * Utility function to conditionally join classNames together
 * @param {...string} classes - CSS class names to be conditionally joined
 * @returns {string} - Joined class names
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Get the product image URL
 * @param {object} product - Product object
 * @returns {string} - Image URL
 */
export const getProductImageUrl = (product) => {
  if (!product) return '/placeholder.svg';
  
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  
  if (product.image) {
    return product.image;
  }
  
  return '/placeholder.svg';
};

/**
 * Format price with currency
 * @param {number} price - Price to format
 * @param {string} currency - Currency code
 * @returns {string} - Formatted price
 */
export const formatPrice = (price, currency = 'KSh') => {
  if (typeof price !== 'number') return `${currency} 0.00`;
  return `${currency} ${price.toFixed(2)}`;
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current price
 * @returns {number} - Discount percentage
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};
