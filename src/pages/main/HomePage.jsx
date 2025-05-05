import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import ProductCard from '../../components/ProductCard';
import { productService } from '../../utils/productService';

/**
 * Home page component displaying hero section, featured products, and categories
 */
const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await productService.getFeaturedProducts(8);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  // Categories data
  const categories = [
    { id: 'clothing', name: 'Clothing', image: '/categories/clothing.jpg' },
    { id: 'toys', name: 'Toys', image: '/categories/toys.jpg' },
    { id: 'feeding', name: 'Feeding', image: '/categories/feeding.jpg' },
    { id: 'furniture', name: 'Furniture', image: '/categories/furniture.jpg' },
    { id: 'travel', name: 'Travel', image: '/categories/travel.jpg' },
    { id: 'electronics', name: 'Electronics', image: '/categories/electronics.jpg' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-24 bg-gradient-to-r from-[#ffebee] to-[#f3e5f5]">
        <div className="container flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#e91e63]">Quality Products</span> for Your Little Ones
            </h1>
            <p className="text-lg mb-6 text-gray-700">
              Discover our collection of premium baby products designed for comfort, safety, and style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-[#e91e63] hover:bg-[#c2185b] text-white" size="lg" asChild>
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/categories">View Categories</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/banner.jpg" 
              alt="Baby products showcase" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-[#e91e63] hover:underline">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="group relative flex flex-col items-center overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <img
                    src={category.image || '/placeholder.svg'}
                    alt={category.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-[#e8f5e9] p-4 mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-[#4caf50] h-8 w-8"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground">
                Every product in our store is carefully selected to ensure the highest quality for your baby.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-[#e3f2fd] p-4 mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-[#2196f3] h-8 w-8"
                >
                  <rect width="20" height="12" x="2" y="6" rx="2"/>
                  <path d="M12 12h.01"/>
                  <path d="M17 12h.01"/>
                  <path d="M7 12h.01"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">
                We use the most secure payment methods to ensure your transactions are safe.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-[#fff8e1] p-4 mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-[#ffc107] h-8 w-8"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4"/>
                  <path d="M12 16h.01"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                We deliver your orders promptly to ensure you get what you need when you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-[#f3e5f5]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Get updates on new products, special offers, and parenting tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
              <Button className="bg-[#e91e63] hover:bg-[#c2185b]">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
