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
        // Get favorites
        const favs = favoriteService.getFavorites();
        setFavorites(favs);
        
        // Get product details for each favorite
        const productsData = await Promise.all(
          favs.map(async (productId) => {
            const product = await productService.getProductById(productId);
            return product;
          })
        );
        
        setFavoriteProducts(productsData.filter(Boolean)); // Filter out any null products
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Remove item from favorites
  const removeFavorite = async (productId) => {
    try {
      await favoriteService.removeFromFavorites(productId);
      
      // Update local state
      setFavorites(prev => prev.filter(id => id !== productId));
      setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
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
              <div key={product.id} className="relative">
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
                <ProductCard product={product} />
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
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
