import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import ProductCard from '../../components/ProductCard';
import { favoriteService } from '../../utils/favoriteService';
import { productService } from '../../utils/productService';
import { authService } from '../../utils/authService';

/**
 * Favorites page component for displaying user's saved products
 */
const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
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
        const favoritesData = await favoriteService.getFavorites();
        
        // Ensure favoritesList is an array
        const favoritesList = Array.isArray(favoritesData) ? favoritesData : 
                             (favoritesData && favoritesData.items ? favoritesData.items : []);
        
        setFavorites(favoritesList);
        
        // The API is already returning product details, no need to fetch them separately
        const productsData = favoritesList.map(favorite => {
          return {
            id: favorite.product_id,
            name: favorite.name || 'Unnamed Product',
            description: favorite.description || '',
            price: parseFloat(favorite.price || 0),
            originalPrice: favorite.original_price,
            image: favorite.image || '/placeholder.svg',
            category_name: favorite.category_name || '',
            stock: parseInt(favorite.stock || 10, 10),
            rating: parseFloat(favorite.rating || 0),
            reviews: parseInt(favorite.reviews || 0, 10),
            featured: favorite.featured || 0,
            is_new: favorite.is_new || 0
          };
        });
        
        setFavoriteProducts(productsData);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Load suggested products when favorites are loaded
  useEffect(() => {
    const loadSuggestions = async () => {
      if (favoriteProducts.length === 0) return;
      
      setLoadingSuggestions(true);
      try {
        // Get a random favorite to find related products
        const randomFavorite = favoriteProducts[Math.floor(Math.random() * favoriteProducts.length)];
        
        // Get related products - use product_id from the favorite item
        const productId = randomFavorite.id || randomFavorite.product_id;
        const { products } = await productService.getRelatedProducts(productId, 4);
        setSuggestedProducts(products || []);
      } catch (error) {
        console.error('Error loading suggested products:', error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    if (favoriteProducts.length > 0) {
      loadSuggestions();
    }
  }, [favoriteProducts]);

  // Remove item from favorites
  const removeFavorite = async (productId) => {
    try {
      // Ensure product ID is a string
      const idStr = String(productId);
      
      await favoriteService.removeFromFavorites(idStr);
      
      // Update local state directly instead of refetching
      setFavorites(prev => prev.filter(item => 
        String(item.product_id) !== idStr
      ));
      
      // Also update displayed products
      setFavoriteProducts(prev => prev.filter(product => 
        String(product.id) !== idStr && String(product.product_id) !== idStr
      ));
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
      ) : favoriteProducts.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <div key={product.id || Math.random()} className="relative">
                <button
                  className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 shadow-md"
                  onClick={() => removeFavorite(product.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                  <span className="sr-only">Remove from favorites</span>
                </button>
                <ProductCard 
                  product={{
                    id: product.id,
                    name: product.name || 'Unnamed Product',
                    description: product.description || '',
                    price: parseFloat(product.price || 0),
                    originalPrice: product.originalPrice || product.original_price,
                    images: Array.isArray(product.images) ? product.images : 
                           (product.image ? [product.image] : []),
                    category: product.category || product.category_name || '',
                    stock: parseInt(product.stock || 10, 10),
                    rating: parseFloat(product.rating || 0),
                    reviews: parseInt(product.reviews || 0, 10)
                  }} 
                />
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => favoriteService.getFavorites().length === 0}
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
      
      {favoriteProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {loadingSuggestions ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
              ))
            ) : suggestedProducts.length > 0 ? (
              // Suggested products
              suggestedProducts.map((product) => (
                <ProductCard
                  key={product.id || Math.random()}
                  product={{
                    id: product.id,
                    name: product.name || 'Unnamed Product',
                    description: product.description || '',
                    price: parseFloat(product.price || 0),
                    originalPrice: product.originalPrice || product.original_price,
                    images: Array.isArray(product.images) ? product.images : 
                          (product.image ? [product.image] : []),
                    category: product.category || product.category_name || '',
                    stock: parseInt(product.stock || 10, 10),
                    rating: parseFloat(product.rating || 0),
                    reviews: parseInt(product.reviews || 0, 10)
                  }}
                />
              ))
            ) : (
              // No suggestions available
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
