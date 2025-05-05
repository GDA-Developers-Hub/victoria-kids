import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { cartService } from '../../utils/cartService';
import { productService } from '../../utils/productService';
import { authService } from '../../utils/authService';

/**
 * Checkout page component for order finalization
 */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Kenya'
  });

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Kenya'
  });

  const [sameBilling, setSameBilling] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [navigate]);

  // Load cart and products
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        // Get cart items
        const items = cartService.getCart();
        
        if (items.length === 0) {
          navigate('/cart');
          return;
        }
        
        // Get product details for each cart item
        const productsData = await Promise.all(
          items.map(async (item) => {
            const product = await productService.getProductById(item.productId);
            return {
              ...product,
              quantity: item.quantity
            };
          })
        );
        
        setCartProducts(productsData.filter(Boolean));
        
        // Pre-fill user info if available
        const user = authService.getCurrentUser();
        if (user) {
          setShippingInfo(prev => ({
            ...prev,
            firstName: user.name?.split(' ')[0] || '',
            lastName: user.name?.split(' ')[1] || '',
            email: user.email || ''
          }));
          
          setBillingInfo(prev => ({
            ...prev,
            firstName: user.name?.split(' ')[0] || '',
            lastName: user.name?.split(' ')[1] || '',
            email: user.email || ''
          }));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [navigate]);

  // Handle shipping form change
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update billing if same as shipping
    if (sameBilling) {
      setBillingInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle billing form change
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle same billing toggle
  const handleSameBillingToggle = (e) => {
    setSameBilling(e.target.checked);
    if (e.target.checked) {
      setBillingInfo(shippingInfo);
    }
  };

  // Calculate cart totals
  const subtotal = cartProducts.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
  
  const shippingFee = subtotal > 5000 || subtotal === 0 ? 0 : 350;
  const tax = subtotal * 0.16; // 16% VAT
  const total = subtotal + shippingFee + tax;

  // Submit order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Simulate API call for placing order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful order
      await cartService.clearCart();
      
      // Redirect to success page
      navigate('/checkout/success', { 
        state: { 
          orderId: 'ORD' + Math.floor(100000 + Math.random() * 900000),
          total
        } 
      });
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e91e63]"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitOrder}>
            {/* Shipping Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shipping-firstName" className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <Input
                    id="shipping-firstName"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="shipping-lastName" className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <Input
                    id="shipping-lastName"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="shipping-email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input
                    id="shipping-email"
                    name="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="shipping-phone" className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="shipping-phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="shipping-address" className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <Input
                    id="shipping-address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="shipping-city" className="block text-sm font-medium mb-1">
                    City
                  </label>
                  <Input
                    id="shipping-city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="shipping-postalCode" className="block text-sm font-medium mb-1">
                    Postal Code
                  </label>
                  <Input
                    id="shipping-postalCode"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="shipping-country" className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <select
                    id="shipping-country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="Kenya">Kenya</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Rwanda">Rwanda</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Billing Information */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Billing Information</h2>
                <div className="flex items-center">
                  <input
                    id="same-billing"
                    type="checkbox"
                    checked={sameBilling}
                    onChange={handleSameBillingToggle}
                    className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                  />
                  <label htmlFor="same-billing" className="ml-2 text-sm text-gray-600">
                    Same as shipping
                  </label>
                </div>
              </div>
              
              {!sameBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="billing-firstName" className="block text-sm font-medium mb-1">
                      First Name
                    </label>
                    <Input
                      id="billing-firstName"
                      name="firstName"
                      value={billingInfo.firstName}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="billing-lastName" className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <Input
                      id="billing-lastName"
                      name="lastName"
                      value={billingInfo.lastName}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="billing-email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input
                      id="billing-email"
                      name="email"
                      type="email"
                      value={billingInfo.email}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="billing-phone" className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <Input
                      id="billing-phone"
                      name="phone"
                      value={billingInfo.phone}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="billing-address" className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <Input
                      id="billing-address"
                      name="address"
                      value={billingInfo.address}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="billing-city" className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <Input
                      id="billing-city"
                      name="city"
                      value={billingInfo.city}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="billing-postalCode" className="block text-sm font-medium mb-1">
                      Postal Code
                    </label>
                    <Input
                      id="billing-postalCode"
                      name="postalCode"
                      value={billingInfo.postalCode}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="billing-country" className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <select
                      id="billing-country"
                      name="country"
                      value={billingInfo.country}
                      onChange={handleBillingChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Rwanda">Rwanda</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            {/* Payment Method */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="payment-mpesa"
                    name="payment-method"
                    type="radio"
                    checked={paymentMethod === 'mpesa'}
                    onChange={() => setPaymentMethod('mpesa')}
                    className="h-4 w-4 border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                  />
                  <label htmlFor="payment-mpesa" className="ml-3 flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">M-Pesa</span>
                    <img src="/payment/mpesa.png" alt="M-Pesa" className="h-8" />
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="payment-card"
                    name="payment-method"
                    type="radio"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="h-4 w-4 border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                  />
                  <label htmlFor="payment-card" className="ml-3 flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">Credit/Debit Card</span>
                    <div className="flex space-x-2">
                      <img src="/payment/visa.png" alt="Visa" className="h-8" />
                      <img src="/payment/mastercard.png" alt="Mastercard" className="h-8" />
                    </div>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="payment-cash"
                    name="payment-method"
                    type="radio"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="h-4 w-4 border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                  />
                  <label htmlFor="payment-cash" className="ml-3">
                    <span className="text-sm font-medium text-gray-900">Cash on Delivery</span>
                  </label>
                </div>
              </div>
              
              {paymentMethod === 'mpesa' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm mb-2">
                    You'll receive an M-Pesa payment prompt on your phone after placing the order.
                  </p>
                  <div>
                    <label htmlFor="mpesa-phone" className="block text-sm font-medium mb-1">
                      M-Pesa Phone Number
                    </label>
                    <Input
                      id="mpesa-phone"
                      placeholder="e.g., 07XX XXX XXX"
                      defaultValue={shippingInfo.phone}
                    />
                  </div>
                </div>
              )}
              
              {paymentMethod === 'card' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md space-y-4">
                  <div>
                    <label htmlFor="card-number" className="block text-sm font-medium mb-1">
                      Card Number
                    </label>
                    <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="card-expiry" className="block text-sm font-medium mb-1">
                        Expiry Date
                      </label>
                      <Input id="card-expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label htmlFor="card-cvc" className="block text-sm font-medium mb-1">
                        CVC
                      </label>
                      <Input id="card-cvc" placeholder="XXX" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-8">
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="/terms" className="text-[#e91e63] hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-[#e91e63] hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#e91e63] hover:bg-[#c2185b]"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Place Order - KSh ${total.toFixed(2)}`}
            </Button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="rounded-lg border bg-gray-50 overflow-hidden sticky top-24">
            <div className="px-6 py-4 bg-gray-100 border-b">
              <h2 className="font-semibold">Order Summary</h2>
            </div>
            
            <div className="p-6">
              <div className="max-h-[400px] overflow-y-auto mb-4">
                {cartProducts.map((product) => (
                  <div key={product.id} className="flex py-2 border-b">
                    <div className="h-16 w-16 mr-4 flex-shrink-0">
                      <img 
                        src={product.images?.[0] || product.image || '/placeholder.svg'} 
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{product.name}</h3>
                      <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                      <p className="text-sm font-medium mt-1">
                        KSh {(product.price * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 py-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>KSh {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingFee > 0 ? `KSh ${shippingFee.toFixed(2)}` : 'Free'}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (16% VAT)</span>
                  <span>KSh {tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>KSh {total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <div className="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#4caf50]"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#2196f3]"><rect width="20" height="12" x="2" y="6" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                  <span>Encrypted payment details</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
