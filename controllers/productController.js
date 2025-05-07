/**
 * Product Controller
 * Handles all product-related operations
 */

const pool = require('../config/db');
const logger = require('../utils/logger');

// Mock product data for development
const products = [
  {
    id: "1",
    name: "Baby Onesie",
    description: "Soft cotton onesie for newborns",
    price: 19.99,
    originalPrice: 24.99,
    images: [
      { image_url: "/images/products/onesie1.jpg" },
      { image_url: "/images/products/onesie2.jpg" },
    ],
    category_id: "1",
    category_name: "Clothing",
    stock: 15,
    rating: 4.5,
    reviews: 28,
    featured: true,
    is_new: true,
    is_budget: false,
    is_luxury: false,
    sizes: ["0-3m", "3-6m", "6-9m"],
    colors: ["Blue", "Pink", "White"],
    material: "100% Organic Cotton",
    age_range: "0-12 months",
    care_instructions: ["Machine wash cold", "Tumble dry low"],
    safety_info: "Meets CPSC safety standards",
    origin: "Made in USA",
    warranty: "30-day satisfaction guarantee",
  },
  {
    id: "2",
    name: "Baby Crib",
    description: "Convertible 4-in-1 crib that grows with your child",
    price: 299.99,
    originalPrice: 349.99,
    images: [
      { image_url: "/images/products/crib1.jpg" },
      { image_url: "/images/products/crib2.jpg" },
    ],
    category_id: "2",
    category_name: "Furniture",
    stock: 8,
    rating: 4.8,
    reviews: 42,
    featured: true,
    is_new: false,
    is_budget: false,
    is_luxury: true,
    sizes: ["Standard"],
    colors: ["Natural Wood", "White", "Gray"],
    material: "Solid Pine Wood",
    age_range: "0-5 years",
    care_instructions: ["Wipe clean with damp cloth"],
    safety_info: "Meets ASTM and CPSC safety standards",
    origin: "Made in Canada",
    warranty: "5-year manufacturer warranty",
  },
  {
    id: "3",
    name: "Baby Bottles Set",
    description: "Set of 3 anti-colic baby bottles",
    price: 24.99,
    originalPrice: 29.99,
    images: [
      { image_url: "/images/products/bottles1.jpg" },
      { image_url: "/images/products/bottles2.jpg" },
    ],
    category_id: "3",
    category_name: "Feeding",
    stock: 25,
    rating: 4.3,
    reviews: 76,
    featured: false,
    is_new: false,
    is_budget: true,
    is_luxury: false,
    sizes: ["4oz", "8oz"],
    colors: ["Clear", "Pink", "Blue"],
    material: "BPA-free plastic",
    age_range: "0+ months",
    care_instructions: ["Dishwasher safe (top rack)", "Sterilize before first use"],
    safety_info: "BPA, PVC, and phthalate free",
    origin: "Made in USA",
    warranty: "1-year warranty against defects",
  },
];

/**
 * @desc    Get all products with filtering and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
    const sort = req.query.sort || "createdAt,desc";

    // Apply filters to mock data
    let filteredProducts = [...products];
    
    // Apply search filter
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply category filter
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category_id === category || p.category_name.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply price filter
    filteredProducts = filteredProducts.filter(p => 
      p.price >= minPrice && p.price <= maxPrice
    );
    
    // Apply sorting
    const [sortField, sortOrder] = sort.split(',');
    filteredProducts.sort((a, b) => {
      if (sortOrder === 'desc') {
        return b[sortField] > a[sortField] ? 1 : -1;
      }
      return a[sortField] > b[sortField] ? 1 : -1;
    });
    
    // Apply pagination
    const paginatedProducts = filteredProducts.slice(skip, skip + limit);
    
    res.json({
      products: paginatedProducts,
      page,
      pages: Math.ceil(filteredProducts.length / limit),
      total: filteredProducts.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT p.*, c.name as category_name,
       (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image,
       (SELECT JSON_ARRAYAGG(image_url) FROM product_images WHERE product_id = p.id) as images
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get product sizes
    const [sizes] = await pool.query(
      'SELECT size FROM product_sizes WHERE product_id = ?',
      [req.params.id]
    );
    
    // Get product colors
    const [colors] = await pool.query(
      'SELECT name, code FROM product_colors WHERE product_id = ?',
      [req.params.id]
    );
    
    // Get product care instructions
    const [careInstructions] = await pool.query(
      'SELECT instruction FROM product_care_instructions WHERE product_id = ?',
      [req.params.id]
    );
    
    const product = {
      ...products[0],
      sizes: sizes.map(s => s.size),
      colors: colors,
      careInstructions: careInstructions.map(ci => ci.instruction)
    };
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category_id,
      stock,
      featured,
      is_new,
      is_budget,
      is_luxury,
      sizes,
      colors,
      material,
      age_range,
      care_instructions,
      safety_info,
      origin,
      warranty,
      images
    } = req.body;
    
    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert the product
      const [productResult] = await connection.query(
        `INSERT INTO products (
          name, description, price, original_price, category_id,
          stock, featured, is_new, is_budget, is_luxury
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
      name,
      description,
          parseFloat(price),
          parseFloat(originalPrice || price),
      category_id,
          parseInt(stock) || 0,
          featured === 'true' ? 1 : 0,
          is_new === 'true' ? 1 : 0,
          is_budget === 'true' ? 1 : 0,
          is_luxury === 'true' ? 1 : 0
        ]
      );
      
      const productId = productResult.insertId;
      
      // Process and save image URLs from Firebase
      if (images && productId) {
        const imageUrls = typeof images === 'string' ? JSON.parse(images) : images;
        
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
          for (let i = 0; i < imageUrls.length; i++) {
            // Set the first image as primary
            const isPrimary = i === 0 ? 1 : 0;
            
            await connection.query(
              `INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)`,
              [productId, imageUrls[i], isPrimary]
            );
          }
        }
      }
      
      // Commit the transaction
      await connection.commit();
      
      // Fetch the complete product with images
      const [productData] = await pool.query(
        `SELECT p.*, c.name as category_name FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = ?`,
        [productId]
      );
      
      const [productImages] = await pool.query(
        `SELECT id, image_url, is_primary FROM product_images WHERE product_id = ?`,
        [productId]
      );
      
      const newProduct = {
        ...productData[0],
        images: productImages
      };
    
    res.status(201).json(newProduct);
    } catch (err) {
      // If there's an error, roll back the transaction
      await connection.rollback();
      throw err;
    } finally {
      // Release the connection
      connection.release();
    }
  } catch (error) {
    logger.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const {
      name,
      description,
      price,
      originalPrice,
      category_id,
      stock,
      featured,
      is_new,
      is_budget,
      is_luxury,
      sizes,
      colors,
      material,
      age_range,
      care_instructions,
      safety_info,
      origin,
      warranty
    } = req.body;
    
    // Process updated images
    let updatedImages = products[productIndex].images;
    if (req.body.images) {
      try {
        // Parse the image URLs array from the request
        const imageUrls = JSON.parse(req.body.images);
        updatedImages = imageUrls.map(url => ({
          image_url: url
        }));
        logger.info(`Product ${req.params.id} updated with ${updatedImages.length} images`);
      } catch (error) {
        logger.error('Error parsing image URLs:', error);
      }
    }
    
    // Update the product
    const updatedProduct = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      description: description || products[productIndex].description,
      price: price ? parseFloat(price) : products[productIndex].price,
      originalPrice: originalPrice ? parseFloat(originalPrice) : products[productIndex].originalPrice,
      images: updatedImages,
      category_id: category_id || products[productIndex].category_id,
      stock: stock ? parseInt(stock) : products[productIndex].stock,
      featured: featured !== undefined ? featured === 'true' : products[productIndex].featured,
      is_new: is_new !== undefined ? is_new === 'true' : products[productIndex].is_new,
      is_budget: is_budget !== undefined ? is_budget === 'true' : products[productIndex].is_budget,
      is_luxury: is_luxury !== undefined ? is_luxury === 'true' : products[productIndex].is_luxury,
      sizes: sizes ? sizes.split(',') : products[productIndex].sizes,
      colors: colors ? colors.split(',') : products[productIndex].colors,
      material: material || products[productIndex].material,
      age_range: age_range || products[productIndex].age_range,
      care_instructions: care_instructions ? care_instructions.split(',') : products[productIndex].care_instructions,
      safety_info: safety_info || products[productIndex].safety_info,
      origin: origin || products[productIndex].origin,
      warranty: warranty || products[productIndex].warranty
    };
    
    // In a real app, you'd update in database
    products[productIndex] = updatedProduct;
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // In a real app, you'd delete from database and storage
    const deletedProduct = products.splice(productIndex, 1)[0];
    
    res.json({ message: 'Product removed', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const featuredProducts = products.filter(p => p.featured).slice(0, limit);
    
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get new arrivals
 * @route   GET /api/products/new
 * @access  Public
 */
const getNewArrivals = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const newArrivals = products.filter(p => p.is_new).slice(0, limit);
    
    res.json(newArrivals);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get budget products
 * @route   GET /api/products/budget
 * @access  Public
 */
const getBudgetProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const budgetProducts = products.filter(p => p.is_budget).slice(0, limit);
    
    res.json(budgetProducts);
  } catch (error) {
    console.error('Error fetching budget products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get luxury products
 * @route   GET /api/products/luxury
 * @access  Public
 */
const getLuxuryProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const luxuryProducts = products.filter(p => p.is_luxury).slice(0, limit);
    
    res.json(luxuryProducts);
  } catch (error) {
    console.error('Error fetching luxury products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get related products
 * @route   GET /api/products/related/:id
 * @access  Public
 */
const getRelatedProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    const limit = parseInt(req.query.limit) || 4;
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find products in the same category
    const relatedProducts = products
      .filter(p => p.id !== productId && p.category_id === product.category_id)
      .slice(0, limit);
    
    res.json(relatedProducts);
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all products with admin details
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
const getAdminProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Try to fetch from database first
    let productsData;
    let totalCount;
    
    try {
      // Base query
      let query = `
        SELECT 
          p.id, 
          p.name, 
          p.description,
          p.price,
          p.original_price,
          p.stock,
          p.featured,
          p.is_new,
          c.name as category_name,
          p.created_at,
          (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
      `;
      
      let countQuery = 'SELECT COUNT(*) as total FROM products p';
      
      // Add search filter
      if (search) {
        query += ` WHERE p.name LIKE ? OR p.description LIKE ?`;
        countQuery += ` WHERE p.name LIKE ? OR p.description LIKE ?`;
      }
      
      // Add sorting
      query += ` ORDER BY p.created_at DESC`;
      
      // Add pagination
      query += ` LIMIT ? OFFSET ?`;
      
      // Execute queries
      let queryParams = [];
      let countParams = [];
      
      if (search) {
        const searchParam = `%${search}%`;
        queryParams = [searchParam, searchParam, limit, skip];
        countParams = [searchParam, searchParam];
      } else {
        queryParams = [limit, skip];
      }
      
      [productsData] = await pool.query(query, queryParams);
      const [countResult] = await pool.query(countQuery, countParams);
      totalCount = countResult[0].total;
      
    } catch (dbError) {
      logger.error('Database error for admin products, using mock data:', dbError);
      
      // Fall back to mock data
      let filteredProducts = [...products];
      
      // Apply search filter
      if (search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) || 
          p.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Apply pagination
      productsData = filteredProducts.slice(skip, skip + limit);
      totalCount = filteredProducts.length;
    }
    
    res.json({
      products: productsData,
      page,
      pages: Math.ceil(totalCount / limit),
      total: totalCount
    });
  } catch (error) {
    logger.error('Error fetching admin products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getBudgetProducts,
  getLuxuryProducts,
  getRelatedProducts,
  getAdminProducts
}; 