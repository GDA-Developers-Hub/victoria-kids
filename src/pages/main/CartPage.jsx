import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { cartService } from '../../utils/cartService';
import { productService } from '../../utils/productService';
import { authService } from '../../utils/authService';

/**
 * Cart page component for displaying and managing items in the shopping cart
 */
const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
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
        const itemsData = await cartService.getCart();
        
        // Ensure items is an array
        const items = Array.isArray(itemsData) ? itemsData : 
                     (itemsData && itemsData.items ? itemsData.items : []);
        
        setCartItems(items);
        
        // The API is already returning product details, no need to fetch them separately
        const productsData = items.map(item => {
          return {
            id: item.product_id,
            name: item.name || 'Unnamed Product',
            price: parseFloat(item.price || 0),
            quantity: item.quantity || 1,
            image: item.image || '/placeholder.svg',
            // Add other fields if available
            category: item.category_name || '',
            stock: parseInt(item.stock || 10, 10)
          };
        });
        
        setCartProducts(productsData);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Update cart item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      // Ensure product ID is a string
      const idStr = String(productId);
      
      await cartService.updateCartItem(idStr, quantity);
      
      // Update local state
      const updatedCart = await cartService.getCart();
      setCartItems(updatedCart);
      
      // Update product quantity in the display
      setCartProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, quantity } 
            : product
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      // Ensure product ID is a string
      const idStr = String(productId);
      
      await cartService.removeFromCart(idStr);
      
      // Update local state
      const updatedCart = await cartService.getCart();
      setCartItems(updatedCart);
      
      // Remove product from display
      setCartProducts(prev => prev.filter(product => product.id !== productId));
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
  const subtotal = cartProducts.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
  
  const shippingFee = subtotal > 5000 || subtotal === 0 ? 0 : 350;
  const discountAmount = (subtotal * promoDiscount) / 100;
  const total = subtotal + shippingFee - discountAmount;

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e91e63]"></div>
        </div>
      ) : cartProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cartProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 mr-4 flex-shrink-0">
                            <img 
                              src={(product.images && Array.isArray(product.images) && product.images[0]) || 
                                product.image || '/placeholder.svg'} 
                              alt={product.name || 'Product'}
                              className="h-16 w-16 object-cover rounded-md"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{product.name || 'Unnamed Product'}</h3>
                            <p className="text-sm text-gray-500">{product.category || product.category_name || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">KSh {parseFloat(product.price || 0).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center border rounded-md w-24">
                          <button
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                            onClick={() => updateQuantity(product.id, Math.max(1, product.quantity - 1))}
                            disabled={product.quantity <= 1}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          </button>
                          <span className="flex-1 text-center">{product.quantity || 1}</span>
                          <button
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                            onClick={() => updateQuantity(product.id, Math.min(product.stock || 10, product.quantity + 1))}
                            disabled={product.quantity >= (product.stock || 10)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          KSh {(parseFloat(product.price || 0) * (product.quantity || 1)).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between">
              <Button
                variant="outline"
                className="mb-4 sm:mb-0"
                asChild
              >
                <Link to="/products">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"></path></svg>
                  Continue Shopping
                </Link>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => cartService.clearCart().then(() => {
                  setCartItems([]);
                  setCartProducts([]);
                })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Clear Cart
              </Button>
            </div>
          </div>
          
          <div>
            <div className="rounded-lg border p-6 bg-gray-50">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>KSh {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingFee > 0 ? `KSh ${shippingFee.toFixed(2)}` : 'Free'}</span>
                </div>
                
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#e91e63]">
                    <span>Discount ({promoDiscount}%)</span>
                    <span>-KSh {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>KSh {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="mb-4">
                  <label htmlFor="promo-code" className="block text-sm font-medium mb-1">
                    Promo Code
                  </label>
                  <div className="flex">
                    <Input
                      id="promo-code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="rounded-r-none flex-1"
                    />
                    <Button
                      onClick={applyPromoCode}
                      className="rounded-l-none bg-[#9c27b0] hover:bg-[#7b1fa2]"
                    >
                      Apply
                    </Button>
                  </div>
                  {promoError && (
                    <p className="text-red-500 text-xs mt-1">{promoError}</p>
                  )}
                  {promoDiscount > 0 && (
                    <p className="text-[#4caf50] text-xs mt-1">Promo code applied successfully!</p>
                  )}
                </div>
                
                <Button
                  className="w-full bg-[#e91e63] hover:bg-[#c2185b]"
                  onClick={proceedToCheckout}
                  disabled={cartProducts.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>Free shipping on orders over KSh 5,000</p>
                <div className="flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#4caf50]"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-gray-100 p-6 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button className="bg-[#e91e63] hover:bg-[#c2185b]" asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
