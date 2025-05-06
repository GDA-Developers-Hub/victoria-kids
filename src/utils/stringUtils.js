/**
 * String utility functions
 */

/**
 * Convert a string to a URL-friendly slug
 * @param {string} text - The string to convert to a slug
 * @returns {string} The slugified string
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/&/g, '-and-')     // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')   // Remove all non-word characters
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
};

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} [maxLength=100] - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};

/**
 * Format a price as currency
 * @param {number} amount - The amount to format
 * @param {string} [currencyCode='KSh'] - Currency code
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currencyCode = 'KSh') => {
  if (amount === null || amount === undefined) return '';
  
  return `${currencyCode} ${parseFloat(amount).toFixed(2)}`;
};

/**
 * Capitalize the first letter of each word
 * @param {string} text - The text to capitalize
 * @returns {string} Text with first letter of each word capitalized
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default {
  slugify,
  truncateText,
  formatCurrency,
  capitalizeWords
}; 