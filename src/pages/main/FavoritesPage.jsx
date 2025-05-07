import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import ProductCard from '../../components/ProductCard';
import { favoriteService } from '../../utils/favoriteService';
import { productService } from '../../utils/productService';
import { authService } from '../../utils/authService';
import placeholderImage from '../../assets/placeholder.webp';

/**
 * Favorites page component for displaying user's saved products
 */
const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { state: { from: '/favorites' } });
    }
  }, [navigate]);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        // Get favorites from service
        const response = await favoriteService.getFavorites();
        
        // Ensure we have valid favorites data
        const favoritesList = Array.isArray(response) ? response : 
                            (response?.items || []);
        
        // Process favorites to ensure consistent data structure
        const processedFavorites = favoritesList.map(favorite => ({
          ...favorite,
          image: favorite.image || placeholderImage,
          images: favorite.images || [favorite.image || placeholderImage],
          price: parseFloat(favorite.price || 0),
          original_price: favorite.original_price ? parseFloat(favorite.original_price) : null,
          stock: parseInt(favorite.stock || 0, 10),
          rating: parseFloat(favorite.rating || 0),
          reviews: parseInt(favorite.reviews || 0, 10)
        }));
        
        setFavorites(processedFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      loadFavorites();
    }
  }, []);

  // Load suggested products when favorites are loaded
  useEffect(() => {
    const loadSuggestions = async () => {
      if (favorites.length === 0) return;
      
      setLoadingSuggestions(true);
      try {
        // Get a random favorite to find related products
        const randomFavorite = favorites[Math.floor(Math.random() * favorites.length)];
        
        // Get related products
        const response = await productService.getRelatedProducts(randomFavorite.product_id);
        
        // Process suggested products
        const processedSuggestions = (response?.products || []).map(product => ({
          ...product,
          image: product.image || placeholderImage,
          images: product.images || [product.image || placeholderImage],
          price: parseFloat(product.price || 0),
          original_price: product.original_price ? parseFloat(product.original_price) : null,
          stock: parseInt(product.stock || 0, 10),
          rating: parseFloat(product.rating || 0),
          reviews: parseInt(product.reviews || 0, 10)
        }));
        
        setSuggestedProducts(processedSuggestions);
      } catch (error) {
        console.error('Error loading suggested products:', error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    if (favorites.length > 0) {
      loadSuggestions();
    }
  }, [favorites]);

  // Remove item from favorites
  const removeFavorite = async (productId) => {
    try {
      await favoriteService.removeFromFavorites(productId);
      setFavorites(prev => prev.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e91e63]"></div>
        </div>
      ) : favorites.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <div key={item.product_id} className="relative">
                <button
                  className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 shadow-md"
                  onClick={() => removeFavorite(item.product_id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                  <span className="sr-only">Remove from favorites</span>
                </button>
                <ProductCard 
                  product={{
                    id: item.product_id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    originalPrice: item.original_price,
                    images: item.images,
                    category: item.category_name,
                    stock: item.stock,
                    rating: item.rating,
                    reviews: item.reviews
                  }} 
                />
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              asChild
            >
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-gray-100 p-6 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your favorites list is empty</h2>
          <p className="text-muted-foreground mb-6">
            Save items you love to your favorites list and they'll appear here.
          </p>
          <Button className="bg-[#e91e63] hover:bg-[#c2185b]" asChild>
            <Link to="/products">Explore Products</Link>
          </Button>
        </div>
      )}
      
      {favorites.length > 0 && suggestedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {loadingSuggestions ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
              ))
            ) : (
              suggestedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    originalPrice: product.original_price,
                    images: product.images,
                    category: product.category_name,
                    stock: product.stock,
                    rating: product.rating,
                    reviews: product.reviews
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
