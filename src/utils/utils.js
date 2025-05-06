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
  
  if (product.images && product.images.length > 0 && product.images[0]) {
    return product.images[0];
  }
  
  if (product.image) {
    return product.image;
  }
  
  return '/placeholder.svg';
};

/**
 * Format price with currency
 * @param {number|string} price - Price to format
 * @param {string} currency - Currency code
 * @returns {string} - Formatted price
 */
export const formatPrice = (price, currency = 'KSh') => {
  if (price === null || price === undefined) return `${currency} 0.00`;
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) return `${currency} 0.00`;
  
  return `${currency} ${numericPrice.toFixed(2)}`;
};

/**
 * Calculate discount percentage
 * @param {number|string} originalPrice - Original price
 * @param {number|string} currentPrice - Current price
 * @returns {number} - Discount percentage
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice) return 0;
  
  const origPrice = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
  const currPrice = typeof currentPrice === 'string' ? parseFloat(currentPrice) : currentPrice;
  
  if (isNaN(origPrice) || isNaN(currPrice) || origPrice <= currPrice) return 0;
  
  return Math.round(((origPrice - currPrice) / origPrice) * 100);
};
