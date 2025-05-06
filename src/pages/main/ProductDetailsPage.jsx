import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingCart, Star, Truck, CheckCircle2, Info, ShieldCheck, Zap } from 'lucide-react';
import { productService } from '../../utils/productService';
import { cartService } from '../../utils/cartService';
import { favoriteService } from '../../utils/favoriteService';
import { authService } from '../../utils/authService';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../utils/utils';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useState('details');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await productService.getProductById(id);
        const product = response.product || response;
        
        if (!product) {
          setError('Product not found');
          return;
        }
        
        // Process product data to match the component's expected format
        const processedProduct = {
          ...product,
          // Convert string price to number if needed
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          // Handle original_price vs originalPrice
          originalPrice: product.original_price ? parseFloat(product.original_price) : product.originalPrice,
          // Handle images array or single image
          images: product.images || (product.image ? [product.image] : ['/placeholder.svg']),
          // Default fields if missing
          rating: product.rating || 4, // Default rating if missing
          reviews: product.reviews || 0,
          // Handle category naming differences
          category: product.category_name || product.category,
          // Default to empty arrays for optional fields
          sizes: product.sizes || [],
          colors: product.colors || []
        };
        
        setProduct(processedProduct);
        setSelectedSize(processedProduct.sizes[0] || '');
        setSelectedColor(processedProduct.colors[0]?.name || '');
        
        // Get related products
        const relatedResponse = await productService.getRelatedProducts(id);
        
        // Process related products to match expected format
        const processedRelatedProducts = (relatedResponse.products || []).map(relProduct => ({
          ...relProduct,
          // Convert string price to number if needed
          price: typeof relProduct.price === 'string' ? parseFloat(relProduct.price) : relProduct.price,
          // Handle original_price vs originalPrice
          originalPrice: relProduct.original_price ? parseFloat(relProduct.original_price) : relProduct.originalPrice,
          // Handle images array or single image
          images: relProduct.images || (relProduct.image ? [relProduct.image] : ['/placeholder.svg']),
        }));
        
        setRelatedProducts(processedRelatedProducts);
        
        // Check if product is in favorites
        if (authService.isAuthenticated()) {
          const isFav = await favoriteService.checkIsFavorite(product.id);
          setIsFavorite(isFav);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleFavorite = async () => {
    if (!authService.isAuthenticated()) {
      alert('Please log in to add items to favorites');
      return;
    }

    setIsTogglingFavorite(true);

    try {
      if (isFavorite) {
        await favoriteService.removeFromFavorites(product.id);
        setIsFavorite(false);
        alert('Removed from favorites');
      } else {
        await favoriteService.addToFavorites(product.id);
        setIsFavorite(true);
        alert('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) {
      alert('Please log in to add items to cart');
      return;
    }

    setIsAddingToCart(true);

    try {
      await cartService.addToCart(product.id, quantity, {
        size: selectedSize || undefined,
        color: selectedColor || undefined
      });
      alert('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <p>Loading product details...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested product could not be found.'}</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
        {/* Product Main Section */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={`${product.name}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-2 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative h-20 w-20 cursor-pointer overflow-hidden rounded-md border",
                    index === 0 && "ring-2 ring-[#e91e63] ring-offset-2",
                  )}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(product.rating) ? "fill-[#ffeb3b] text-[#ffeb3b]" : "text-muted-foreground",
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">({product.reviews || 0} reviews)</span>
                </div>

                <Badge className={product.stock > 0 ? "bg-[#4caf50]" : "bg-red-500"}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {product.originalPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">KSh {product.price.toFixed(2)}</span>
                  <span className="text-xl text-muted-foreground line-through">KSh {product.originalPrice.toFixed(2)}</span>
                  <Badge className="bg-[#e91e63]">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              ) : (
                <span className="text-3xl font-bold">KSh {product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={cn(
                        "flex h-10 w-16 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50",
                        selectedSize === size && "border-[#e91e63] bg-pink-50 text-[#e91e63]"
                      )}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <div key={color.name} className="flex flex-col items-center">
                      <button
                        className={cn(
                          "h-8 w-8 rounded-full border shadow-sm",
                          selectedColor === color.name && "ring-2 ring-[#e91e63] ring-offset-2"
                        )}
                        style={{ backgroundColor: color.code }}
                        onClick={() => setSelectedColor(color.name)}
                      />
                      <span className="mt-1 text-center text-xs">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-r-none"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <div className="flex h-10 w-12 items-center justify-center text-sm font-medium">{quantity}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-l-none"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">{product.stock} available</span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1 bg-[#e91e63] hover:bg-[#c2185b]"
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                className={cn("flex-1", isFavorite && "bg-pink-50 text-[#e91e63]")}
                onClick={toggleFavorite}
                disabled={isTogglingFavorite}
              >
                <Heart className={cn("mr-2 h-5 w-5", isFavorite && "fill-[#e91e63] text-[#e91e63]")} />
                {isFavorite ? "Added to Favorites" : "Add to Favorites"}
              </Button>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#4caf50]" />
                <span className="font-medium">Free shipping</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Free standard shipping on orders over KSh 5,000</p>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <div className="mb-4 w-full border-b pb-px">
            <div className="flex overflow-x-auto">
              <button
                className={cn(
                  "px-4 py-2 font-medium",
                  selectedTab === "details" && "border-b-2 border-[#e91e63] text-[#e91e63]"
                )}
                onClick={() => setSelectedTab("details")}
              >
                Product Details
              </button>
              <button
                className={cn(
                  "px-4 py-2 font-medium",
                  selectedTab === "specifications" && "border-b-2 border-[#e91e63] text-[#e91e63]"
                )}
                onClick={() => setSelectedTab("specifications")}
              >
                Specifications
              </button>
              <button
                className={cn(
                  "px-4 py-2 font-medium",
                  selectedTab === "care" && "border-b-2 border-[#e91e63] text-[#e91e63]"
                )}
                onClick={() => setSelectedTab("care")}
              >
                Care Instructions
              </button>
              <button
                className={cn(
                  "px-4 py-2 font-medium",
                  selectedTab === "shipping" && "border-b-2 border-[#e91e63] text-[#e91e63]"
                )}
                onClick={() => setSelectedTab("shipping")}
              >
                Shipping & Returns
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="pt-4">
            {/* Details Tab */}
            {selectedTab === "details" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">About this product</h3>
                <p className="text-gray-700">{product.description}</p>

                {product.ageRange && (
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-1 px-2 py-0">
                      Age
                    </Badge>
                    <p>{product.ageRange}</p>
                  </div>
                )}

                {product.safetyInfo && (
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-1 h-5 w-5 text-green-500" />
                    <p>{product.safetyInfo}</p>
                  </div>
                )}

                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium">Key Features</h4>
                  <ul className="space-y-2">
                    {product.tags && product.tags.map((tag, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#e91e63]" />
                        <span className="capitalize">{tag.replace("-", " ")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {selectedTab === "specifications" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Product Specifications</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  {product.material && (
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium text-gray-500">Material</h4>
                      <p className="mt-1">{product.material}</p>
                    </div>
                  )}

                  {product.origin && (
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium text-gray-500">Country of Origin</h4>
                      <p className="mt-1">{product.origin}</p>
                    </div>
                  )}

                  {product.warranty && (
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium text-gray-500">Warranty</h4>
                      <p className="mt-1">{product.warranty}</p>
                    </div>
                  )}

                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium text-gray-500">Stock</h4>
                    <p className="mt-1">{product.stock} units available</p>
                  </div>
                </div>

                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-6">
                    <h4 className="mb-2 font-medium">Available Sizes</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors && product.colors.length > 0 && (
                  <div className="mt-6">
                    <h4 className="mb-2 font-medium">Available Colors</h4>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className="h-8 w-8 rounded-full border shadow-sm"
                            style={{ backgroundColor: color.code }}
                            title={color.name}
                          />
                          <span className="mt-1 text-xs">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Care Instructions Tab */}
            {selectedTab === "care" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Care Instructions</h3>

                {product.careInstructions && product.careInstructions.length > 0 ? (
                  <div className="rounded-lg border p-4">
                    <ul className="space-y-2">
                      {product.careInstructions.map((instruction, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500">No specific care instructions provided for this product.</p>
                )}

                <div className="mt-4 rounded-lg bg-yellow-50 p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-medium text-yellow-800">
                    <Zap className="h-5 w-5" />
                    Care Tips
                  </h4>
                  <p className="text-yellow-700">
                    For baby clothing, we recommend using mild, baby-safe detergent and washing new items before first use.
                  </p>
                </div>
              </div>
            )}

            {/* Shipping & Returns Tab */}
            {selectedTab === "shipping" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Shipping & Returns</h3>

                <div className="rounded-lg border p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[#4caf50]" />
                    <h4 className="font-medium">Shipping Information</h4>
                  </div>
                  <ul className="ml-7 space-y-2 text-gray-700">
                    <li>Free standard shipping on orders over KSh 5,000</li>
                    <li>Standard shipping (3-5 business days): KSh 599</li>
                    <li>Express shipping (1-2 business days): KSh 999</li>
                    <li>Same-day delivery available in Nairobi (order before 10 AM)</li>
                  </ul>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#e91e63]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                      />
                    </svg>
                    <h4 className="font-medium">Return Policy</h4>
                  </div>
                  <ul className="ml-7 space-y-2 text-gray-700">
                    <li>30-day return policy for unused items in original packaging</li>
                    <li>For hygiene reasons, certain items like pacifiers cannot be returned once opened</li>
                    <li>Defective items can be returned for replacement or full refund</li>
                    <li>Return shipping is free for defective items</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">You might also like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id} 
                  className="group cursor-pointer"
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  <div className="overflow-hidden rounded-lg border bg-white">
                    <div className="relative aspect-square">
                      <img
                        src={relatedProduct.images[0] || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {relatedProduct.discount > 0 && (
                        <div className="absolute left-0 top-0 bg-[#e91e63] px-2 py-1 text-xs font-medium text-white">
                          {relatedProduct.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-1 text-sm font-medium">{relatedProduct.name}</h3>
                      <div className="mt-1 flex items-center justify-between">
                        <div>
                          {relatedProduct.originalPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">KSh {relatedProduct.price.toFixed(2)}</span>
                              <span className="text-xs text-gray-500 line-through">
                                KSh {relatedProduct.originalPrice.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium">KSh {relatedProduct.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  );
};

export default ProductDetailsPage;
