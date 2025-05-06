import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../utils/categoryService';

/**
 * Categories page component displaying all product categories fetched from API
 */
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await categoryService.getCategories();
        setCategories(response.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Placeholder for popular collections - replace with dynamic data if needed
  const popularCollections = [
    { name: 'New Arrivals', image: '/collections/new-arrivals.jpg', url: '/products?filter=new' },
    { name: 'Budget Picks', image: '/collections/budget-picks.jpg', url: '/products?filter=budget' },
    { name: 'Luxury Items', image: '/collections/luxury-items.jpg', url: '/products?filter=luxury' },
    { name: 'On Sale', image: '/collections/on-sale.jpg', url: '/products?filter=sale' }
  ];

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Shop by Category</h1>
        <p className="text-center py-8">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Shop by Category</h1>
        <p className="text-center text-red-500 py-8">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Shop by Category</h1>

      {/* Featured Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {categories.length > 0 ? (
          categories.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative overflow-hidden rounded-lg h-64 flex items-end justify-start text-left bg-cover bg-center"
              style={{ backgroundImage: `url(${category.image || '/placeholder.svg'})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity" />
              <div className="relative w-full p-5 md:p-6">
                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-white opacity-90 mb-3">{category.description}</p>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center py-8">No featured categories found.</p>
        )}
      </div>

      {/* All Categories */}
      <h2 className="text-2xl font-bold mb-6">All Categories</h2>
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group block overflow-hidden rounded-lg border transition-colors hover:border-primary"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={category.image || '/placeholder.svg'}
                  alt={category.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium group-hover:text-[#e91e63]">{category.name}</h3>
                {/* Product count removed as it might not be available from API */}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center py-8">No categories found.</p>
      )}

      {/* Popular Collections */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Popular Collections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { name: 'New Arrivals', image: '/collections/new-arrivals.jpg', url: '/products?filter=new' },
          { name: 'Budget Picks', image: '/collections/budget-picks.jpg', url: '/products?filter=budget' },
          { name: 'Luxury Items', image: '/collections/luxury-items.jpg', url: '/products?filter=luxury' },
          { name: 'On Sale', image: '/collections/on-sale.jpg', url: '/products?filter=sale' }
        ].map((collection, index) => (
          <Link
            key={index}
            to={collection.url}
            className="group block overflow-hidden rounded-lg border transition-colors hover:border-primary"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={collection.image || '/placeholder.svg'}
                alt={collection.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white font-medium">{collection.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Seasonal Picks */}
      <div className="mt-12 relative overflow-hidden rounded-lg bg-gradient-to-r from-[#e8f5e9] to-[#f1f8e9] p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="inline-block bg-[#4caf50] text-white text-xs px-3 py-1 rounded-full mb-2">
              Limited Time
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Seasonal Baby Essentials</h2>
            <p className="mb-6 text-gray-700">
              Discover our hand-picked selection of seasonal must-haves for your little one.
              Perfect for the current weather and specially discounted for a limited time.
            </p>
            <Link
              to="/products?filter=seasonal"
              className="inline-flex items-center bg-[#4caf50] hover:bg-[#388e3c] text-white px-4 py-2 rounded-md"
            >
              Shop Seasonal Picks
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </Link>
          </div>
          <div className="hidden md:block">
            <img 
              src="/seasonal-baby.jpg" 
              alt="Seasonal baby products" 
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
