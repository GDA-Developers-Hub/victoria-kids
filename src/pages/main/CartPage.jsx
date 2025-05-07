import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { cartService } from '../../utils/cartService';
import { productService } from '../../utils/productService';
import { authService } from '../../utils/authService';
import placeholderImage from '../../assets/placeholder.webp';

/**
 * Cart page component for displaying and managing items in the shopping cart
 */
const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        // Get cart items from service
        const items = await cartService.getCart();
        
        // Process items to ensure consistent data structure
        const processedItems = items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          name: item.name,
          description: item.description,
          image: item.image || placeholderImage,
          images: item.images || [item.image || placeholderImage],
          quantity: parseInt(item.quantity || 1, 10),
          price: parseFloat(item.price || 0),
          original_price: item.original_price ? parseFloat(item.original_price) : null,
          stock: parseInt(item.stock || 0, 10),
          category_name: item.category_name
        }));
        
        setCartItems(processedItems);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      loadCart();
    } else {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [navigate]);

  // Update cart item quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      const updatedCart = await cartService.updateCartItem(itemId, quantity);
      
      // Process items to ensure consistent data structure
      const processedItems = updatedCart.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        description: item.description,
        image: item.image || placeholderImage,
        images: item.images || [item.image || placeholderImage],
        quantity: parseInt(item.quantity || 1, 10),
        price: parseFloat(item.price || 0),
        original_price: item.original_price ? parseFloat(item.original_price) : null,
        stock: parseInt(item.stock || 0, 10),
        category_name: item.category_name
      }));
      
      setCartItems(processedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      const updatedCart = await cartService.removeFromCart(itemId);
      
      // Process items to ensure consistent data structure
      const processedItems = updatedCart.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        description: item.description,
        image: item.image || placeholderImage,
        images: item.images || [item.image || placeholderImage],
        quantity: parseInt(item.quantity || 1, 10),
        price: parseFloat(item.price || 0),
        original_price: item.original_price ? parseFloat(item.original_price) : null,
        stock: parseInt(item.stock || 0, 10),
        category_name: item.category_name
      }));
      
      setCartItems(processedItems);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    setPromoError('');
    
    // Simple mock promo code validation
    if (promoCode === 'WELCOME10') {
      setPromoDiscount(10);
    } else if (promoCode === 'SUMMER20') {
      setPromoDiscount(20);
    } else {
      setPromoError('Invalid promo code');
      setPromoDiscount(0);
    }
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const discount = (subtotal * promoDiscount) / 100;
  const total = subtotal + shipping - discount;

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-lg shadow">
                  {/* Product Image */}
                  <div className="w-24 h-24">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src = placeholderImage;
                      }}
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category_name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                      {item.original_price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline" onClick={applyPromoCode}>Apply</Button>
              </div>
              
              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Checkout Button */}
              <Button className="w-full mt-4" size="lg" onClick={proceedToCheckout}>
                Proceed to Checkout
              </Button>
              
              {/* Continue Shopping */}
              <Link to="/products">
                <Button variant="outline" className="w-full mt-2">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
