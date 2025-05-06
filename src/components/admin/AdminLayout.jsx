import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Main Admin Layout component that wraps all admin pages
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Toggle sidebar visibility (especially for mobile)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
