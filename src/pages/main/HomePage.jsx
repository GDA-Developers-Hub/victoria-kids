import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import ProductCard from '../../components/ProductCard';
import { productService } from '../../utils/productService';
import { categoryService } from '../../utils/categoryService';
import { Badge } from '../../components/ui/badge';
import banner from '../../assets/baby1.jpg';
import banner2 from '../../assets/banner1.jpg';
import banner3 from '../../assets/banner2.avif';
import banner4 from '../../assets/pump.jpg';
/**
 * Home page component displaying hero section, featured products, and categories
 */
const HomePage = () => {
  // State for different product sections
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [flashDeals, setFlashDeals] = useState([]);
  const [budgetPicks, setBudgetPicks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load categories
        const categoriesResponse = await categoryService.getCategories();
        const allCategories = categoriesResponse.categories || [];
        setCategories(allCategories);
        
        // Set active category to "all" by default
        setActiveCategory('all');
        
        // Load all products from admin/products endpoint
        const allProductsResponse = await productService.getProducts({
          limit: 30 // Get enough products to show in various sections
        });
        
        const allProducts = allProductsResponse?.data || [];
        
        // Use these products as featured products
        setFeaturedProducts(allProducts);
        
        // Create a map of products by category
        const categoryProducts = { all: allProducts };
        
        // For each category, filter the products that belong to it
        allCategories.forEach(category => {
          const categoryName = category.name.toLowerCase();
          const productsInCategory = allProducts.filter(product => 
            (product.category_name || '').toLowerCase() === categoryName
          );
          categoryProducts[category.slug] = productsInCategory;
        });
        
        setProductsByCategory(categoryProducts);
        
        // Filter products to get flash deals (products with discounts)
        const discountedProducts = allProducts.filter(p => p.original_price || p.originalPrice);
        setFlashDeals(discountedProducts.slice(0, 5));
        
        // Sort products by price for budget picks
        const sortedByPrice = [...allProducts].sort((a, b) => {
          const priceA = parseFloat(a.price);
          const priceB = parseFloat(b.price);
          return priceA - priceB;
        });
        setBudgetPicks(sortedByPrice.slice(0, 5));
        
        // Filter new arrivals (products marked as new or recent)
        const newProducts = allProducts.filter(p => p.is_new || p.isNew).slice(0, 5);
        // If not enough products marked as new, use the most recent ones by ID
        if (newProducts.length < 5) {
          const sortedById = [...allProducts].sort((a, b) => b.id - a.id);
          const additional = sortedById.filter(p => !newProducts.some(np => np.id === p.id));
          newProducts.push(...additional.slice(0, 5 - newProducts.length));
        }
        setNewArrivals(newProducts);
        
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Loading skeleton
  const ProductSkeleton = () => (
    <div className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
  );

  // "See All" link component
  const SeeAllLink = ({ to, className }) => (
    <Link to={to} className={`text-sm text-[#e91e63] hover:underline ${className || ''}`}>
      View All →
    </Link>
  );

  // Section title component
  const SectionTitle = ({ title, linkTo }) => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {linkTo && <SeeAllLink to={linkTo} />}
    </div>
  );

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:w-1/5 bg-white rounded-lg shadow-sm p-4 h-fit">
            <h2 className="font-bold text-lg mb-4">Categories</h2>
            {categories.length === 0 && !isLoading && (
              <p className="text-gray-500 text-sm">No categories found</p>
            )}
            {isLoading && (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            )}
            <ul className="space-y-2">
              {isLoading ? (
                Array(8).fill(0).map((_, i) => (
                  <li key={i} className="animate-pulse h-8 bg-gray-100 rounded"></li>
                ))
              ) : (
                categories.slice(0, 8).map((category) => (
                  <li key={category.id}>
                    <Link 
                      to={`/categories/${category.slug}`}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-md group transition-colors"
                    >
                      <div className="w-8 h-8 rounded-md overflow-hidden mr-3">
                        <img 
                          src={category.image || `/categories/${category.slug}.jpg`} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                      <span>{category.name}</span>
                    </Link>
                  </li>
                ))
              )}
              <li>
                <Link 
                  to="/categories"
                  className="flex items-center p-2 text-[#e91e63] hover:bg-pink-50 rounded-md"
                >
                  All Categories <span className="ml-1">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="lg:w-4/5">
            {/* Mobile Search Bar */}
            <div className="lg:hidden mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border border-gray-200 rounded-md py-2 px-4 pl-9 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Hero Banner with Categories underneath */}
            <div className="mb-6">
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-400 rounded-t-lg overflow-hidden">
                <div className="relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-500/80 to-transparent z-10"></div>
                  <div className="relative z-20 p-6 flex flex-col justify-center h-full">
                  <Badge className="mb-2 bg-white text-black hover:bg-white w-fit">SUMMER SALE</Badge>
                    <h1 className="text-2xl font-bold text-white mb-2">Quality Products for Your<br />Little Ones</h1>
                    <p className="text-white text-opacity-90 mb-4 text-sm">Up to 40% off on selected baby essentials. Limited time offer!</p>
                  <Button className="bg-white text-black hover:bg-gray-100 w-fit" asChild>
                    <Link to="/products">SHOP NOW</Link>
                  </Button>
                </div>
                <img 
                  src={banner}
                  alt="Baby products showcase" 
                    className="absolute top-0 right-0 h-full object-cover object-right w-1/2"
                  />
                </div>
              </div>

              {/* Shop By Category - directly underneath the hero */}
              <div className="bg-white py-4 px-2 rounded-b-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2 px-2">Shop By Category</h3>
                <div className="flex overflow-x-auto pb-2 gap-3 px-2 hide-scrollbar">
                  {isLoading ? (
                    Array(8).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse w-16 flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))
                  ) : (
                    categories.slice(0, 8).map((category) => (
                      <Link 
                        key={category.id}
                        to={`/categories/${category.slug}`}
                        className="flex flex-col items-center w-16 flex-shrink-0"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mb-1">
                          <img 
                            src={category.image || `/categories/${category.slug}.jpg`} 
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                        </div>
                        <span className="text-xs text-center truncate w-full">{category.name}</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
              </div>
            </div>

        {/* Product Sections - Full Width */}
        <div className="mt-8">
            {/* All Products Section */}
          <div className="mb-8">
              <SectionTitle title="All Products" linkTo="/products" />
              <div className="overflow-x-auto">
                <div className="flex space-x-2 mb-4">
                <Button 
                  variant={activeCategory === 'all' ? "default" : "outline"} 
                  size="sm" 
                  className="whitespace-nowrap"
                  onClick={() => setActiveCategory('all')}
                >
                  All
                </Button>
                  {categories.slice(0, 7).map((category) => (
                    <Button 
                      key={category.id} 
                    variant={activeCategory === category.slug ? "default" : "outline"}
                      size="sm"
                      className="whitespace-nowrap bg-gray-200"
                    onClick={() => setActiveCategory(category.slug)}
                    >
                    {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {Array(10).fill(0).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {activeCategory === 'all' ? (
                  featuredProducts.length > 0 ? (
                    featuredProducts.slice(0, 10).map((product) => (
                    <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No products found</p>
                </div>
                  )
                ) : (
                  productsByCategory[activeCategory] && productsByCategory[activeCategory].length > 0 ? (
                    productsByCategory[activeCategory].slice(0, 10).map((product) => (
                    <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No products found in this category</p>
                    </div>
                  )
                )}
                </div>
              )}
            </div>

            {/* Promotional Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Educational Toys Banner */}
            <div className="bg-green-100 rounded-lg overflow-hidden relative">
              <div className="relative z-10 p-6">
                <h3 className="text-2xl font-bold mb-2">Educational Toys</h3>
                <p className="mb-4">Develop your baby's skills</p>
                <Button size="sm" variant="outline" className="bg-white hover:bg-white hover:text-green-600 border-white" asChild>
                    <Link to="/categories/toys">Shop Now</Link>
                  </Button>
                </div>
              <img 
                src={banner2}
                alt="Educational Toys" 
                className="absolute top-0 right-0 h-full w-full object-cover object-center opacity-30 z-0"
              />
              </div>
              
              {/* Organic Clothing Banner */}
            <div className="bg-blue-100 rounded-lg overflow-hidden relative">
              <div className="relative z-10 p-6">
                <h3 className="text-2xl font-bold mb-2">Organic Clothing</h3>
                <p className="mb-4">Gentle on baby's skin</p>
                <Button size="sm" variant="outline" className="bg-white hover:bg-white hover:text-blue-600 border-white" asChild>
                    <Link to="/categories/clothing">Shop Now</Link>
                  </Button>
                </div>
              <img 
                src={banner3}
                alt="Organic Clothing" 
                className="absolute top-0 right-0 h-full w-full object-cover object-center opacity-30 z-0"
              />
              </div>
            </div>

          {/* Flash Deals Section */}
          <div className="mb-8">
            <SectionTitle title="Flash Deals" linkTo="/products?discount=true" />
              
              {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {Array(5).fill(0).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {flashDeals.slice(0, 5).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

            {/* New Arrivals Section */}
          <div className="mb-8">
            <SectionTitle title="New Arrivals" linkTo="/products?sort=newest" />
              
              {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {Array(5).fill(0).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {newArrivals.slice(0, 5).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

          {/* Promotional Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Educational Toys Banner */}
            <div className="bg-green-100 rounded-lg overflow-hidden relative">
              <div className="relative z-10 p-6">
                <h3 className="text-2xl font-bold mb-2">Educational Toys</h3>
                <p className="mb-4">Develop your baby's skills</p>
                <Button size="sm" variant="outline" className="bg-white hover:bg-white hover:text-green-600 border-white" asChild>
                  <Link to="/categories/toys">Shop Now</Link>
                </Button>
              </div>
              <img 
                src={banner}
                alt="Educational Toys" 
                className="absolute top-0 right-0 h-full w-full object-cover object-center opacity-30 z-0"
              />
            </div>

            {/* Organic Clothing Banner */}
            <div className="bg-blue-100 rounded-lg overflow-hidden relative">
              <div className="relative z-10 p-6">
                <h3 className="text-2xl font-bold mb-2">Organic Clothing</h3>
                <p className="mb-4">Gentle on baby's skin</p>
                <Button size="sm" variant="outline" className="bg-white hover:bg-white hover:text-blue-600 border-white" asChild>
                  <Link to="/categories/clothing">Shop Now</Link>
                </Button>
              </div>
              <img 
                src={banner3}
                alt="Organic Clothing" 
                className="absolute top-0 right-0 h-full w-full object-cover object-center opacity-30 z-0"
              />
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar - Mobile Only */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 z-50">
          <Link to="/" className="flex flex-col items-center text-pink-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/categories" className="flex flex-col items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs">Categories</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs">Cart</span>
          </Link>
          <Link to="/favorites" className="flex flex-col items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">Favorites</span>
          </Link>
          <Link to="/account" className="flex flex-col items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Account</span>
          </Link>
        </div>

        {/* Add padding at the bottom to account for the fixed navigation on mobile */}
        <div className="h-16 lg:h-0"></div>
      </div>
    </div>
  );
};

export default HomePage;
