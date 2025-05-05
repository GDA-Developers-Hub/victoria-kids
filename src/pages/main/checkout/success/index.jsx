import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home, Package } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import Layout from '../../../../components/Layout';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  
  useEffect(() => {
    // In a real application, you'd fetch order details from the API
    // using an order ID passed in the URL or from state
    // For this demo, we'll use mock data or data passed through location state
    
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');
    
    // Use order data passed from checkout page or generate mock data
    const mockOrderDetails = location.state?.orderDetails || {
      id: orderId || 'ORD-' + Math.floor(Math.random() * 10000000),
      date: new Date().toLocaleDateString(),
      items: location.state?.items || [
        {
          id: 'p1',
          name: 'Baby Cotton Romper',
          price: 1299.00,
          quantity: 2,
          image: 'https://example.com/images/products/romper.jpg'
        },
        {
          id: 'p2',
          name: 'Soft Teddy Bear',
          price: 899.00,
          quantity: 1,
          image: 'https://example.com/images/products/teddy.jpg'
        }
      ],
      paymentMethod: location.state?.paymentMethod || 'Credit Card',
      shippingAddress: location.state?.shippingAddress || {
        fullName: 'John Doe',
        addressLine1: '123 Main Street',
        city: 'Nairobi',
        state: 'Nairobi County',
        postalCode: '00100',
        country: 'Kenya',
        phone: '+254712345678'
      },
      subtotal: location.state?.subtotal || 3497.00,
      shipping: location.state?.shipping || 599.00,
      total: location.state?.total || 4096.00
    };
    
    setOrderDetails(mockOrderDetails);
    
    // Clear cart if order was successful
    // Uncomment this in a real application:
    // if (orderId) {
    //   cartService.clearCart();
    // }
  }, [location]);

  if (!orderDetails) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex justify-center">
            <p>Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-green-100 p-3">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-600">Order Confirmed!</h1>
              <p className="mt-2 text-lg text-gray-600">
                Thank you for your purchase. Your order has been received and is now being processed.
              </p>
            </div>

            <div className="mb-8 rounded-lg border bg-gray-50 p-4">
              <div className="mb-4 flex justify-between">
                <div>
                  <h2 className="font-semibold">Order Number</h2>
                  <p className="text-gray-600">{orderDetails.id}</p>
                </div>
                <div>
                  <h2 className="font-semibold">Date</h2>
                  <p className="text-gray-600">{orderDetails.date}</p>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="font-semibold">Shipping Address</h2>
                <p className="text-gray-600">
                  {orderDetails.shippingAddress.fullName}<br />
                  {orderDetails.shippingAddress.addressLine1}<br />
                  {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postalCode}<br />
                  {orderDetails.shippingAddress.country}
                </p>
              </div>

              <div>
                <h2 className="font-semibold">Payment Method</h2>
                <p className="text-gray-600">{orderDetails.paymentMethod}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

              <div className="mb-4 space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <div className="h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                        <img 
                          src={item.image || '/placeholder.svg'} 
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.src = '/placeholder.svg' }}
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">KSh {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-4 text-right">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>KSh {orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>KSh {orderDetails.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>KSh {orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-lg border bg-blue-50 p-4 text-blue-800">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <Package className="h-5 w-5" />
                Shipping Information
              </h3>
              <p>Your order will be shipped within 1-2 business days. You will receive a shipping confirmation with tracking details via email.</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="flex-1 bg-[#e91e63] hover:bg-[#c2185b]"
                onClick={() => navigate('/products')}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/')}
              >
                <Home className="mr-2 h-5 w-5" />
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccessPage;
