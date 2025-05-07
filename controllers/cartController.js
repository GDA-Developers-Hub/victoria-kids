/**
 * Cart Controller
 * Handles all cart-related operations
 */

const pool = require('../config/db');
const logger = require('../utils/logger');

/**
 * @desc    Get cart items for the current user
 * @route   GET /api/cart
 * @access  Private
 */
const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get cart items with product details
    const [cartItems] = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, 
       p.name, p.description, p.price, p.original_price, p.stock,
       (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image,
       (SELECT JSON_ARRAYAGG(image_url) FROM product_images WHERE product_id = p.id) as images,
       cat.name as category_name
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       LEFT JOIN categories cat ON p.category_id = cat.id
       WHERE c.user_id = ?`,
      [userId]
    );
    
    res.json(cartItems);
  } catch (error) {
    logger.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const userId = req.user.id;
    
    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    // Check if product exists and has enough stock
    const [products] = await pool.query(
      'SELECT id, stock FROM products WHERE id = ?',
      [product_id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = products[0];
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }
    
    // Check if product is already in cart
    const [existingItems] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );
    
    if (existingItems.length > 0) {
      // Update quantity if product is already in cart
      const newQuantity = existingItems[0].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: 'Cannot add more than available stock' });
      }
      
      await pool.query(
        'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [newQuantity, userId, product_id]
      );
    } else {
      // Add new item to cart
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, product_id, quantity]
      );
    }
    
    // Get updated cart items
    const [cartItems] = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, 
       p.name, p.description, p.price, p.original_price, p.stock,
       (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image,
       (SELECT JSON_ARRAYAGG(image_url) FROM product_images WHERE product_id = p.id) as images,
       cat.name as category_name
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       LEFT JOIN categories cat ON p.category_id = cat.id
       WHERE c.user_id = ?`,
      [userId]
    );
    
    res.status(201).json(cartItems);
  } catch (error) {
    logger.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:id
 * @access  Private
 */
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const userId = req.user.id;
    const cartItemId = req.params.id;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    
    // Get cart item and check stock
    const [cartItems] = await pool.query(
      `SELECT c.*, p.stock 
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.id = ? AND c.user_id = ?`,
      [cartItemId, userId]
    );
    
    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    const cartItem = cartItems[0];
    
    if (quantity > cartItem.stock) {
      return res.status(400).json({ message: 'Cannot add more than available stock' });
    }
    
    // Update quantity
    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, cartItemId, userId]
    );
    
    // Get updated cart items
    const [updatedCart] = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, 
       p.name, p.description, p.price, p.original_price, p.stock,
       (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image,
       (SELECT JSON_ARRAYAGG(image_url) FROM product_images WHERE product_id = p.id) as images,
       cat.name as category_name
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       LEFT JOIN categories cat ON p.category_id = cat.id
       WHERE c.user_id = ?`,
      [userId]
    );
    
    res.json(updatedCart);
  } catch (error) {
    logger.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:id
 * @access  Private
 */
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;
    
    // Delete cart item
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [cartItemId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    // Get updated cart items
    const [cartItems] = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, 
       p.name, p.description, p.price, p.original_price, p.stock,
       (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image,
       (SELECT JSON_ARRAYAGG(image_url) FROM product_images WHERE product_id = p.id) as images,
       cat.name as category_name
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       LEFT JOIN categories cat ON p.category_id = cat.id
       WHERE c.user_id = ?`,
      [userId]
    );
    
    res.json(cartItems);
  } catch (error) {
    logger.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Delete all cart items for user
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = ?',
      [userId]
    );
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    logger.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
}; 