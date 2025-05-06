import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productService } from '../../utils/productService';
import ProductCard from '../../components/ProductCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

/**
 * Products page component displaying product listings with filtering and pagination
 */
const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Extract query parameters
  const initialPage = parseInt(queryParams.get('page') || '1', 10);
  const initialCategory = queryParams.get('category') || '';
  const initialSearch = queryParams.get('search') || '';
  const initialSort = queryParams.get('sort') || 'name';
  const initialOrder = queryParams.get('order') || 'asc';
  const initialFilter = queryParams.get('filter') || '';
  
  // State variables
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);
  const [filter, setFilter] = useState(initialFilter);
  const [isLoading, setIsLoading] = useState(true);

  // Available categories
  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'toys', name: 'Toys' },
    { id: 'feeding', name: 'Feeding' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'travel', name: 'Travel' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'carriers', name: 'Carriers' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'rating-desc', label: 'Rating (Highest)' },
    { value: 'rating-asc', label: 'Rating (Lowest)' },
  ];

  // Filter options
  const filterOptions = [
    { value: '', label: 'All Products' },
    { value: 'new', label: 'New Arrivals' },
    { value: 'budget', label: 'Budget Picks' },
    { value: 'luxury', label: 'Luxury Items' },
    { value: 'sale', label: 'On Sale' },
  ];

  // Load products when parameters change
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Handle filter mapping to API parameters
        let categoryParam = category;
        let searchParam = search;
        
        if (filter === 'new') {
          searchParam = 'new';
        } else if (filter === 'budget') {
          searchParam = 'budget';
        } else if (filter === 'luxury') {
          searchParam = 'luxury';
        } else if (filter === 'sale') {
          searchParam = 'sale';
        }
        
        const result = await productService.getProducts({
          page,
          limit: 12,
          category: categoryParam,
          search: searchParam,
          sort,
          order,
        });
        
        setProducts(result?.data || []);
        setTotalProducts(result?.total || 0);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
    
    // Update URL parameters
    const params = new URLSearchParams();
    if (page !== 1) params.set('page', page.toString());
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (sort !== 'name') params.set('sort', sort);
    if (order !== 'asc') params.set('order', order);
    if (filter) params.set('filter', filter);
    
    const newSearch = params.toString();
    if (location.search !== `?${newSearch}`) {
      navigate({ search: newSearch ? `?${newSearch}` : '' }, { replace: true });
    }
  }, [page, category, search, sort, order, filter, location.search, navigate]);

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    const [sortValue, orderValue] = value.split('-');
    setSort(sortValue);
    setOrder(orderValue);
    setPage(1); // Reset to first page when changing sort
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1); // Reset to first page when changing filter
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // Reset to first page when changing category
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(totalProducts / 12));
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {/* Filters and search */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="filter" className="block text-sm font-medium mb-1">
              Filter By
            </label>
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={`${sort}-${order}`}
              onChange={handleSortChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <label htmlFor="search" className="text-sm font-medium">
              Search Products
            </label>
            <div className="flex">
              <Input
                id="search"
                type="search"
                placeholder="Search by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="ml-2 bg-[#e91e63] hover:bg-[#c2185b]">
                Search
              </Button>
            </div>
          </form>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {filter && (
              <div className="bg-[#e91e63] text-white px-3 py-1 rounded-full text-sm flex items-center">
                {filterOptions.find(f => f.value === filter)?.label}
                <button
                  onClick={() => setFilter('')}
                  className="ml-2 focus:outline-none"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
            
            {category && (
              <div className="bg-[#2196f3] text-white px-3 py-1 rounded-full text-sm flex items-center">
                {categories.find(c => c.id === category)?.name}
                <button
                  onClick={() => setCategory('')}
                  className="ml-2 focus:outline-none"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
            
            {search && (
              <div className="bg-[#4caf50] text-white px-3 py-1 rounded-full text-sm flex items-center">
                Search: {search}
                <button
                  onClick={() => setSearch('')}
                  className="ml-2 focus:outline-none"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
          <Button
            onClick={() => {
              setCategory('');
              setSearch('');
              setFilter('');
              setSort('name');
              setOrder('asc');
              setPage(1);
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && pageNumbers && pageNumbers.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-10 h-10 p-0"
            >
              <span className="sr-only">Previous page</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Button>
            
            {pageNumbers.map((num) => (
              <Button
                key={num}
                variant={page === num ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(num)}
                className={`w-10 h-10 p-0 ${page === num ? 'bg-[#e91e63] hover:bg-[#c2185b]' : ''}`}
              >
                {num}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="w-10 h-10 p-0"
            >
              <span className="sr-only">Next page</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
