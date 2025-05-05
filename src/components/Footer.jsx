import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component with navigation links, social media, and copyright info
 */
const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Victoria Kids Logo" width={40} height={40} className="rounded-full" />
              <span className="font-bold text-xl">
                <span className="text-[#e91e63]">Victoria</span> <span className="text-[#4caf50]">KIDS</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Quality baby products for your little ones. Making parenting easier since 2020.
            </p>
            <div className="flex gap-4 mt-4">
              <Link to="#" className="text-muted-foreground hover:text-[#e91e63]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-[#e91e63]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-[#e91e63]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-[#e91e63]">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-[#e91e63]">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/products?filter=budget" className="text-muted-foreground hover:text-[#e91e63]">
                  Budget Picks
                </Link>
              </li>
              <li>
                <Link to="/products?filter=luxury" className="text-muted-foreground hover:text-[#e91e63]">
                  Luxury Picks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Account</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-[#e91e63]">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-[#e91e63]">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-muted-foreground hover:text-[#e91e63]">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-muted-foreground hover:text-[#e91e63]">
                  Favorites
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-[#e91e63]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-[#e91e63]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-[#e91e63]">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-[#e91e63]">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Victoria Kids Baby Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
