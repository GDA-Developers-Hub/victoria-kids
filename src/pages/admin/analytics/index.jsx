import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, ShoppingBag, DollarSign, TrendingUp, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

// Mock data for analytics
const generateMockAnalyticsData = () => {
  // Mock revenue data (last 7 days)
  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 50000) + 10000,
      orders: Math.floor(Math.random() * 20) + 5
    };
  });

  // Mock sales by category data
  const categoryData = [
    { name: 'Baby Clothing', value: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Toys', value: Math.floor(Math.random() * 4000) + 800 },
    { name: 'Strollers', value: Math.floor(Math.random() * 3000) + 600 },
    { name: 'Feeding', value: Math.floor(Math.random() * 2500) + 500 },
    { name: 'Diapers', value: Math.floor(Math.random() * 2000) + 400 }
  ];

  // Mock top products data
  const topProducts = [
    {
      id: 'p1',
      name: 'Baby Cotton Romper Set',
      sales: Math.floor(Math.random() * 100) + 20,
      revenue: Math.floor(Math.random() * 20000) + 5000,
      change: Math.floor(Math.random() * 30) - 10
    },
    {
      id: 'p2',
      name: 'Soft Teddy Bear Plush Toy',
      sales: Math.floor(Math.random() * 80) + 15,
      revenue: Math.floor(Math.random() * 15000) + 4000,
      change: Math.floor(Math.random() * 30) - 10
    },
    {
      id: 'p3',
      name: 'Premium Baby Stroller',
      sales: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 25000) + 15000,
      change: Math.floor(Math.random() * 30) - 10
    },
    {
      id: 'p4',
      name: 'Baby Feeding Bottle Set',
      sales: Math.floor(Math.random() * 70) + 15,
      revenue: Math.floor(Math.random() * 10000) + 3000,
      change: Math.floor(Math.random() * 30) - 10
    },
    {
      id: 'p5',
      name: 'Organic Bamboo Baby Diapers',
      sales: Math.floor(Math.random() * 200) + 50,
      revenue: Math.floor(Math.random() * 18000) + 6000,
      change: Math.floor(Math.random() * 30) - 10
    }
  ];

  // Mock overall stats
  const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = revenueData.reduce((sum, day) => sum + day.orders, 0);
  const stats = {
    revenue: totalRevenue,
    orders: totalOrders,
    customers: Math.floor(Math.random() * 200) + 100,
    averageOrderValue: Math.floor(totalRevenue / totalOrders),
    salesGrowth: Math.floor(Math.random() * 30) - 5,
    orderGrowth: Math.floor(Math.random() * 25) - 5,
    conversionRate: (Math.random() * 5 + 1).toFixed(2)
  };

  return { revenueData, categoryData, topProducts, stats };
};

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch analytics data
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockAnalyticsData();
      setData(mockData);
      setLoading(false);
    }, 800);
  }, [timeRange]); // Refresh data when time range changes

  // Colors for charts
  const COLORS = ['#e91e63', '#4caf50', '#2196f3', '#ff9800', '#9c27b0'];

  if (loading || !data) {
    return (
      <AdminLayout>
        <div className="container px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <p>Loading analytics data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const { revenueData, categoryData, topProducts, stats } = data;

  return (
    <AdminLayout>
      <div className="container px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <div className="mt-4 flex items-center space-x-2 md:mt-0">
            <span className="text-sm text-gray-500">Time Range:</span>
            <div className="inline-flex rounded-md shadow-sm">
              <Button
                variant={timeRange === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('week')}
                className={timeRange === 'week' ? 'bg-[#e91e63] hover:bg-[#c2185b]' : ''}
              >
                Week
              </Button>
              <Button
                variant={timeRange === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('month')}
                className={timeRange === 'month' ? 'bg-[#e91e63] hover:bg-[#c2185b]' : ''}
              >
                Month
              </Button>
              <Button
                variant={timeRange === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('year')}
                className={timeRange === 'year' ? 'bg-[#e91e63] hover:bg-[#c2185b]' : ''}
              >
                Year
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Total Revenue</span>
              <div className="rounded-full bg-pink-100 p-2 text-pink-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold">KSh {stats.revenue.toLocaleString()}</h3>
              <div className="mt-1 flex items-center">
                {stats.salesGrowth > 0 ? (
                  <div className="flex items-center text-green-600">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    <span className="text-xs font-medium">{stats.salesGrowth}% from previous period</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                    <span className="text-xs font-medium">{Math.abs(stats.salesGrowth)}% from previous period</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Total Orders</span>
              <div className="rounded-full bg-green-100 p-2 text-green-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold">{stats.orders}</h3>
              <div className="mt-1 flex items-center">
                {stats.orderGrowth > 0 ? (
                  <div className="flex items-center text-green-600">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    <span className="text-xs font-medium">{stats.orderGrowth}% from previous period</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                    <span className="text-xs font-medium">{Math.abs(stats.orderGrowth)}% from previous period</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">New Customers</span>
              <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold">{stats.customers}</h3>
              <div className="mt-1 flex items-center">
                <span className="text-xs font-medium text-gray-500">Conversion Rate: {stats.conversionRate}%</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Average Order Value</span>
              <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold">KSh {stats.averageOrderValue.toLocaleString()}</h3>
              <div className="mt-1">
                <span className="text-xs font-medium text-gray-500">Per customer transaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue & Orders Chart */}
        <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Revenue & Orders</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#e91e63" />
                <YAxis yAxisId="right" orientation="right" stroke="#4caf50" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (KSh)" stroke="#e91e63" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#4caf50" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category & Top Products */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Sales by Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `KSh ${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Top Selling Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium text-right">Units Sold</th>
                    <th className="pb-3 font-medium text-right">Revenue</th>
                    <th className="pb-3 font-medium text-right">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{product.name}</td>
                      <td className="py-3 text-right">{product.sales}</td>
                      <td className="py-3 text-right">KSh {product.revenue.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <Badge 
                          className={product.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {product.change > 0 ? '+' : ''}{product.change}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">New order #ORD-{Math.floor(Math.random() * 10000)}</p>
                <p className="text-sm text-gray-500">Customer purchased 3 items for KSh 4,599</p>
                <p className="text-xs text-gray-400">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-green-100 p-2 text-green-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">New customer registration</p>
                <p className="text-sm text-gray-500">Jane Doe created a new account</p>
                <p className="text-xs text-gray-400">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Inventory update</p>
                <p className="text-sm text-gray-500">12 products restocked, 3 products out of stock</p>
                <p className="text-xs text-gray-400">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
