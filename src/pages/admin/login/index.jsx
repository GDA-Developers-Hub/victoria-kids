import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { authService } from '../../../utils/authService';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Add specific admin role check
      const success = await authService.login(email, password, true);
      
      if (success) {
        // Verify that the user has admin role
        const user = authService.getCurrentUser();
        if (user && user.role === 'admin') {
          navigate('/admin');
        } else {
          authService.logout(); // Force logout if not admin
          throw new Error('You do not have admin privileges');
        }
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err instanceof Error ? err.message : 'Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-4">
        <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 space-y-1 flex flex-col items-center">
            <div className="mb-4">
              <img
                src="/logo.png"
                alt="Victoria Kids Logo"
                width={80}
                height={80}
                className="rounded-full border-4 border-white shadow-md"
              />
            </div>
            <h2 className="text-2xl font-bold">Admin Login</h2>
            <p className="text-center text-gray-500">
              Enter your admin credentials to access the dashboard
            </p>
          </div>
          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#e91e63] hover:bg-[#c2185b]" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in to Dashboard"}
              </Button>
            </form>
          </div>
          <div className="p-6 bg-gray-50 flex flex-col items-center gap-2">
            <Link to="/" className="text-sm text-[#e91e63] hover:underline">
              Return to Main Store
            </Link>
            <p className="text-xs text-gray-500">
              Admin access is restricted. Please contact the system administrator if you need access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
