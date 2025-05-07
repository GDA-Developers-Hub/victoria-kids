/**
 * Migration: 002_sample_data
 * Description: Adds sample data for development environment
 */

const up = async (connection) => {
  // First ensure tables exist
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      role ENUM('customer', 'admin') DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      original_price DECIMAL(10, 2),
      image_url VARCHAR(255),
      category_id INT,
      stock INT DEFAULT 0,
      rating DECIMAL(3, 1) DEFAULT 0,
      reviews INT DEFAULT 0,
      featured BOOLEAN DEFAULT FALSE,
      is_new BOOLEAN DEFAULT FALSE,
      is_budget BOOLEAN DEFAULT FALSE,
      is_luxury BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);

  // Check if we already have users
  const [usersResult] = await connection.query('SELECT COUNT(*) as count FROM users');
  if (usersResult[0].count === 0) {
    console.log('Adding sample users...');
    
    // Insert sample admin user
    await connection.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('Admin User', 'admin@example.com', '$2a$10$NxW7GWzEzp23Rq4DUMWNnubQ3AKrEPH/TJH5JRdLlLKJm8JRcJvMK', 'admin')
    `);
    
    // Insert sample customer
    await connection.query(`
      INSERT INTO users (name, email, password, phone)
      VALUES ('Test User', 'test@example.com', '$2a$10$NxW7GWzEzp23Rq4DUMWNnubQ3AKrEPH/TJH5JRdLlLKJm8JRcJvMK', '555-123-4567')
    `);
  }
  
  // Check if we already have categories
  const [categoriesResult] = await connection.query('SELECT COUNT(*) as count FROM categories');
  if (categoriesResult[0].count === 0) {
    console.log('Adding sample categories...');
    
    // Insert sample categories
    await connection.query(`
      INSERT INTO categories (name, slug, description, image_url) VALUES
      ('Clothing', 'clothing', 'Baby clothes and accessories', '/images/categories/clothing.jpg'),
      ('Furniture', 'furniture', 'Cribs, changing tables, and more', '/images/categories/furniture.jpg'),
      ('Feeding', 'feeding', 'Bottles, bibs, and other feeding supplies', '/images/categories/feeding.jpg'),
      ('Toys', 'toys', 'Educational and fun toys for all ages', '/images/categories/toys.jpg'),
      ('Electronics', 'electronics', 'Monitors, humidifiers, and other electronics', '/images/categories/electronics.jpg')
    `);
  }
  
  // Check if we already have products
  const [productsResult] = await connection.query('SELECT COUNT(*) as count FROM products');
  if (productsResult[0].count === 0) {
    console.log('Adding sample products...');
    
    // Insert sample products
    await connection.query(`
      INSERT INTO products (name, description, price, original_price, image_url, category_id, stock, rating, reviews, featured, is_new, is_budget, is_luxury) VALUES
      ('Baby Onesie', 'Soft cotton onesie for newborns', 19.99, 24.99, '/images/products/onesie1.jpg', 1, 15, 4.5, 28, TRUE, TRUE, FALSE, FALSE),
      ('Baby Crib', 'Convertible 4-in-1 crib that grows with your child', 299.99, 349.99, '/images/products/crib1.jpg', 2, 8, 4.8, 42, TRUE, FALSE, FALSE, TRUE),
      ('Baby Bottles Set', 'Set of 3 anti-colic baby bottles', 24.99, 29.99, '/images/products/bottles1.jpg', 3, 25, 4.3, 76, FALSE, FALSE, TRUE, FALSE),
      ('Baby Monitor', 'HD video monitor with night vision', 89.99, 99.99, '/images/products/monitor1.jpg', 5, 5, 4.6, 54, TRUE, FALSE, FALSE, FALSE),
      ('Baby Mobile', 'Musical mobile with starry night projection', 39.99, 49.99, '/images/products/mobile1.jpg', 4, 3, 4.2, 31, FALSE, TRUE, FALSE, FALSE)
    `);
  }
};

const down = async (connection) => {
  // Remove sample data
  await connection.query('DELETE FROM products');
  await connection.query('DELETE FROM categories');
  await connection.query('DELETE FROM users');
};

module.exports = {
  up,
  down
}; 