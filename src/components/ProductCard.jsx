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

  return (
    <Card className={cn("h-full overflow-hidden transition-all hover:shadow-md", className)}>
      <Link to={`/products/${product.id}`} className="relative block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={getProductImageUrl(product)}
            alt={product.name}
            className="object-cover w-full h-full transition-transform hover:scale-105"
            crossOrigin="anonymous"
          />
          <button
            className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-muted-foreground hover:text-[#e91e63]"
            onClick={toggleFavorite}
            disabled={isTogglingFavorite}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill={isFavorite ? "#e91e63" : "none"} 
              stroke={isFavorite ? "#e91e63" : "currentColor"} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-5 w-5"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
            <span className="sr-only">Add to favorites</span>
          </button>

          {product.isNew && (
            <Badge className="absolute left-2 top-2 bg-[#2196f3]">New</Badge>
          )}

          {product.originalPrice && (
            <Badge className="absolute left-2 top-2 bg-[#e91e63]">
              {calculateDiscount(product.originalPrice, product.price)}% OFF
            </Badge>
          )}

          {product.isBudget && !product.isNew && !product.originalPrice && (
            <Badge className="absolute left-2 top-2 bg-[#4caf50]">Budget Pick</Badge>
          )}

          {product.isLuxury && !product.isNew && !product.originalPrice && (
            <Badge className="absolute left-2 top-2 bg-[#9c27b0]">Luxury</Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
        </div>

        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg 
                key={i}
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill={i < Math.floor(product.rating) ? "#ffeb3b" : "none"} 
                stroke={i < Math.floor(product.rating) ? "#ffeb3b" : "currentColor"} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(product.rating) ? "fill-[#ffeb3b] text-[#ffeb3b]" : "text-muted-foreground",
                )}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span className="ml-2 text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            {product.originalPrice ? (
              <div className="flex items-center gap-2">
                <span className="font-bold">KSh {product.price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground line-through">
                  KSh {product.originalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-bold">KSh {product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-[#e91e63] hover:bg-[#c2185b]"
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
            className="mr-2 h-4 w-4"
          >
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
