import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { cn, getProductImageUrl, calculateDiscount } from '../utils/utils';
import { authService } from '../utils/authService';
import { favoriteService } from '../utils/favoriteService';
import { cartService } from '../utils/cartService';

/**
 * ProductCard component for displaying product information in a grid
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @param {string} [props.className] - Additional CSS classes
 */
const ProductCard = ({ product, className }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    // Check if product is in favorites
    const checkFavoriteStatus = async () => {
      if (authService.isAuthenticated()) {
        try {
          const isFav = await favoriteService.checkIsFavorite(product.id);
          setIsFavorite(isFav);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };

    checkFavoriteStatus();
  }, [product.id]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authService.isAuthenticated()) {
      alert("Please log in to add items to favorites");
      return;
    }

    setIsTogglingFavorite(true);

    try {
      if (isFavorite) {
        await favoriteService.removeFromFavorites(product.id);
        setIsFavorite(false);
      } else {
        await favoriteService.addToFavorites(product.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authService.isAuthenticated()) {
      alert("Please log in to add items to cart");
      return;
    }

    setIsAddingToCart(true);

    try {
      await cartService.addToCart(product.id, 1);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Function to determine which badge to show (prioritize in this order)
  const getBadge = () => {
    if (product.isNew) {
      return { label: "New", bgColor: "bg-[#2196f3]" };
    } else if (product.originalPrice) {
      const discount = calculateDiscount(product.originalPrice, product.price);
      return { label: `${discount}% OFF`, bgColor: "bg-[#e91e63]" };
    } else if (product.isBudget) {
      return { label: "Budget", bgColor: "bg-[#4caf50]" };
    } else if (product.isLuxury) {
      return { label: "Luxury", bgColor: "bg-[#9c27b0]" };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <Card className={cn("overflow-hidden bg-white border-0 shadow-sm rounded-lg", className)}>
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={getProductImageUrl(product)}
            alt={product.name}
            className="object-cover w-full h-full"
            crossOrigin="anonymous"
          />
          
          {/* Heart/Favorite button */}
          <button
            className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-sm"
            onClick={toggleFavorite}
            disabled={isTogglingFavorite}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill={isFavorite ? "#e91e63" : "none"} 
              stroke={isFavorite ? "#e91e63" : "#666"} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-5 w-5"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>

          {/* Badge (New, OFF, etc) - only show one based on priority */}
          {badge && (
            <div className={`absolute left-0 top-3 ${badge.bgColor} text-white text-xs py-1 px-2 rounded-r-full font-medium`}>
              {badge.label}
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-3">
        <div className="mb-1">
          {/* Star Rating */}
          <div className="flex items-center text-xs">
            <div className="flex items-center text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg 
                  key={i}
                  xmlns="http://www.w3.org/2000/svg" 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="h-3 w-3"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <span className="ml-1 text-gray-500">({product.reviews})</span>
          </div>
        </div>

        <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
        
        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice ? (
              <div className="flex flex-col">
                <span className="font-bold text-sm">KSh {product.price.toFixed(2)}</span>
                <span className="text-xs text-gray-500 line-through">
                  KSh {product.originalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-sm">KSh {product.price.toFixed(2)}</span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <button 
            className="bg-white rounded-full p-1.5 border border-gray-200 shadow-sm"
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock <= 0}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-4 w-4 text-gray-700"
            >
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
