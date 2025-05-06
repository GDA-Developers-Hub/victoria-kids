import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../utils/authService';
import { cartService } from '../utils/cartService';
import { favoriteService } from '../utils/favoriteService';
import { Button } from './ui/button';
import { Input } from './ui/input';

/**
 * Header component with navigation, search, and user controls
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Get cart and favorites count
  const [cartCount, setCartCount] = useState(cartService.getCartCount());
  const [favoritesCount, setFavoritesCount] = useState(favoriteService.getFavoritesCount());
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [user, setUser] = useState(authService.getCurrentUser());

  // Update counts when component mounts
  React.useEffect(() => {
    setCartCount(cartService.getCartCount());
    setFavoritesCount(favoriteService.getFavoritesCount());
    setIsAuthenticated(authService.isAuthenticated());
    setUser(authService.getCurrentUser());
    
    // Real implementation would include listeners or intervals
    // to update these values when they change
  }, [pathname]); // Re-check when route changes

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
          <Link to="/" className="flex items-center gap-2">
            {/* <img src="/logo.png" alt="Victoria Kids Logo" width={40} height={40} className="rounded-full" /> */}
            <span className="hidden font-bold text-xl md:inline-block">
              <span className="text-[#e91e63]">Victoria</span> <span className="text-[#4caf50]">K</span>
              <span className="text-[#2196f3]">I</span>
              <span className="text-[#ffeb3b]">D</span>
              <span className="text-[#e91e63]">S</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/products") ? "text-primary" : "text-muted-foreground"}`}
          >
            Products
          </Link>
          <Link
            to="/categories"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/categories") ? "text-primary" : "text-muted-foreground"}`}
          >
            Categories
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/about" ? "text-primary" : "text-muted-foreground"}`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/contact" ? "text-primary" : "text-muted-foreground"}`}
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <Input
              type="search"
              placeholder="Search products..."
              className="w-[200px] pl-8 md:w-[200px] lg:w-[300px]"
            />
          </div>

          <Link to="/favorites" className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground hover:text-[#e91e63]"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#e91e63] text-[10px] font-medium text-white">
                {favoritesCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground hover:text-[#e91e63]"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#e91e63] text-[10px] font-medium text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline">Hello, {user?.name || 'User'}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-[#e91e63] hover:bg-[#c2185b]" size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <div className="flex mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute ml-2 mt-2.5 h-4 w-4 text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <Input type="search" placeholder="Search products..." className="w-full pl-8" />
          </div>
          <nav className="grid gap-2">
            <Link
              to="/"
              className={`px-2 py-1 text-sm font-medium rounded-md ${pathname === "/" ? "bg-muted" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-2 py-1 text-sm font-medium rounded-md ${pathname.startsWith("/products") ? "bg-muted" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/categories"
              className={`px-2 py-1 text-sm font-medium rounded-md ${pathname.startsWith("/categories") ? "bg-muted" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className={`px-2 py-1 text-sm font-medium rounded-md ${pathname === "/about" ? "bg-muted" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-2 py-1 text-sm font-medium rounded-md ${pathname === "/contact" ? "bg-muted" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
