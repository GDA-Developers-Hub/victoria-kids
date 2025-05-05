import { useState, useEffect } from 'react';

// The Sidebar component for admin layout
function Sidebar({ isOpen, toggleSidebar }) {
  const [activePath, setActivePath] = useState('');

  // Set active path based on current URL
  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  // Generate class for nav links based on active state
  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-[#e91e63]";
    return activePath === path 
      ? `${baseClass} bg-pink-50 text-[#e91e63] font-medium`
      : `${baseClass} text-gray-700`;
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0`}>
      {/* Mobile close button */}
      <div className="flex items-center justify-between border-b p-4 md:hidden">
        <span className="font-semibold">Victoria Kids Admin</span>
        <button onClick={toggleSidebar} className="rounded-full p-1 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
      
      {/* Logo (visible on desktop) */}
      <div className="hidden border-b p-4 md:block">
        <span className="font-semibold text-[#e91e63]">Victoria Kids Admin</span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-auto p-4">
        <div className="space-y-1">
          <a href="/admin" className={getLinkClass('/admin')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1"/>
              <rect width="7" height="5" x="14" y="3" rx="1"/>
              <rect width="7" height="9" x="14" y="12" rx="1"/>
              <rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
            Dashboard
          </a>
          <a href="/admin/products" className={getLinkClass('/admin/products')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3h6m-6 0-6 6h6m0-6v18m6-18 6 6h-6m0-6v18"/>
            </svg>
            Products
          </a>
          <a href="/admin/categories" className={getLinkClass('/admin/categories')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="8" height="8" x="3" y="3" rx="2"/>
              <rect width="8" height="8" x="13" y="3" rx="2"/>
              <rect width="8" height="8" x="3" y="13" rx="2"/>
              <rect width="8" height="8" x="13" y="13" rx="2"/>
            </svg>
            Categories
          </a>
          <a href="/admin/orders" className={getLinkClass('/admin/orders')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            Orders
          </a>
          <a href="/admin/customers" className={getLinkClass('/admin/customers')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Customers
          </a>
        </div>
      </nav>
      
      {/* Admin actions */}
      <div className="border-t p-4">
        <div className="space-y-1">
          <a href="/admin/settings" className={getLinkClass('/admin/settings')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Settings
          </a>
          <a href="/admin/logout" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 transition-all hover:bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
