import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { authService } from '../../../utils/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // In a real application, this would call an API to send reset instructions
      // For this demo, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, assume success for admin@example.com
      if (email === 'admin@example.com' || email.includes('@victoriakids.com')) {
        setIsSuccess(true);
      } else {
        // In a real app, you should not disclose whether an email exists or not for security
        // But for the demo, we'll show different behavior
        setError('We could not find an admin account with that email address.');
      }
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError('Failed to request password reset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-4">
        <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate('/admin/login')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold">Reset Admin Password</h2>
            </div>

            {!isSuccess ? (
              <>
                <p className="text-gray-600 mb-6">
                  Enter your admin email address and we'll send you instructions to reset your password.
                </p>

                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#e91e63] hover:bg-[#c2185b]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending Instructions...' : 'Send Reset Instructions'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-green-600 mb-2">Check your email</h3>
                <p className="text-gray-600 mb-6">
                  We've sent password reset instructions to <span className="font-medium">{email}</span>. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => navigate('/admin/login')}
                    variant="outline"
                    className="w-full"
                  >
                    Return to Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail('');
                    }}
                    variant="link"
                    className="text-[#e91e63]"
                  >
                    Try a different email
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need help? <Link to="/contact" className="text-[#e91e63] hover:underline">Contact Support</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
