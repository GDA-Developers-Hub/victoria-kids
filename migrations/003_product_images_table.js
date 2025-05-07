/**
 * Migration: 003_product_images_table
 * Description: Adds product_images table and removes image_url from products table
 */

const up = async (connection) => {
  // Create product_images table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      is_primary BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Migrate existing product images to the new table
  await connection.query(`
    INSERT INTO product_images (product_id, image_url, is_primary)
    SELECT id, image_url, TRUE FROM products WHERE image_url IS NOT NULL AND image_url != ''
  `);

  // Log completion
  console.log('Product images table created and existing images migrated.');
};

const down = async (connection) => {
  // Drop the product_images table
  await connection.query('DROP TABLE IF EXISTS product_images');
};

module.exports = {
  up,
  down
};
