import { useState } from 'react';

// The Navbar component for admin layout
function Navbar({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Toggle user dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile menu button */}
        <button onClick={toggleSidebar} className="mr-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
          <span className="sr-only">Open menu</span>
        </button>
        
        {/* Title (visible on mobile) */}
        <div className="flex items-center md:hidden">
          <span className="text-lg font-medium">Victoria Kids Admin</span>
        </div>
        
        {/* Search box */}
        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" x2="16.65" y1="21" y2="16.65"/>
            </svg>
            <input
              type="search"
              placeholder="Search..."
              className="h-9 w-64 rounded-md border border-gray-200 bg-white pl-8 text-sm outline-none focus:border-[#e91e63] focus:ring-[#e91e63]"
            />
          </div>
          
          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 rounded-full text-sm focus:outline-none"
              aria-expanded={dropdownOpen}
            >
              <span className="hidden md:block">Admin User</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e91e63] text-white">
                <span>AU</span>
              </div>
            </button>
            
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg">
                <a
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </a>
                <a
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <a
                  href="/admin/logout"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
