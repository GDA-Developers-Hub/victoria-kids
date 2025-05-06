import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminService from "../../../utils/adminService";
import { formatCurrency } from "../../../utils/stringUtils";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_sales: 0,
    total_orders: 0,
    total_customers: 0,
    total_products: 0,
    sales_by_month: [],
    top_products: [],
    recent_orders: []
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard stats
        const dashboardStats = await adminService.getDashboardStats();
        setStats(dashboardStats);
        
        // Fetch categories
        const categoriesData = await adminService.getCategories(1, 10);
        setCategories(categoriesData.categories || []);
        
        // Fetch products
        const productsData = await adminService.getProducts(1, 5);
        setProducts(productsData.products || []);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Card component for summary stats
  const StatCard = ({ title, value, icon, color }) => (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`rounded-full p-3 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e91e63] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store's performance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.total_sales)}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
          color="bg-green-100 text-green-700"
        />
        <StatCard
          title="Total Orders"
          value={stats.total_orders}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z" />
            </svg>
          }
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          title="Total Customers"
          value={stats.total_customers}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          color="bg-purple-100 text-purple-700"
        />
        <StatCard
          title="Total Products"
          value={stats.total_products}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.5" y1="6.5" y2="6.5" />
            </svg>
          }
          color="bg-pink-100 text-pink-700"
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Recent Orders</h3>
              <Link to="/admin/orders" className="text-sm text-[#e91e63] hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-2">Order ID</th>
                    <th className="text-left font-medium p-2">Customer</th>
                    <th className="text-left font-medium p-2">Status</th>
                    <th className="text-right font-medium p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_orders && stats.recent_orders.length > 0 ? (
                    stats.recent_orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">#{order.id}</td>
                        <td className="p-2">{order.user_name}</td>
                        <td className="p-2">
                          <span 
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-2 text-right">{formatCurrency(order.total)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-muted-foreground">
                        No recent orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Top Products</h3>
              <Link to="/admin/products" className="text-sm text-[#e91e63] hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {stats.top_products && stats.top_products.length > 0 ? (
                stats.top_products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 mr-3">
                        <img 
                          src={product.image || '/placeholder.jpg'} 
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      Sold: <span className="font-medium">{product.sold}</span>
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No top products data
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Recent Products */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Recent Products</h3>
              <Link to="/admin/products" className="text-sm text-[#e91e63] hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="flex items-center border-b pb-2">
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 mr-3">
                      <img 
                        src={product.imageUrl || '/placeholder.jpg'} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="text-sm">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No products found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Categories</h3>
              <Link to="/admin/categories" className="text-sm text-[#e91e63] hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center border-b pb-2">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 mr-3">
                      <img 
                        src={category.imageUrl || '/placeholder.jpg'} 
                        alt={category.name}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.count || 0} products
                      </p>
                    </div>
                    <div>
                      {category.featured && (
                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No categories found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/products/new" className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mx-auto mb-2 text-[#e91e63]">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            <span className="text-sm font-medium">Add Product</span>
          </Link>
          <Link to="/admin/categories/new" className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mx-auto mb-2 text-[#e91e63]">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <span className="text-sm font-medium">Add Category</span>
          </Link>
          <Link to="/admin/orders" className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mx-auto mb-2 text-[#e91e63]">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            <span className="text-sm font-medium">View Orders</span>
          </Link>
          <Link to="/admin/customers" className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mx-auto mb-2 text-[#e91e63]">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="text-sm font-medium">View Customers</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 