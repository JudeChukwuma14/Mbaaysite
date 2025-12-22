import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaFire, FaSearch, FaClock, FaShoppingBag } from 'react-icons/fa';
import { IoFlash, IoGrid, IoList } from 'react-icons/io5';
import { getAllProduct } from '@/utils/productApi';
import FlashSaleProductCard from '@/components/FlashSales/FlashSaleProductCard';
import FlashSaleCountdown from '@/components/FlashSales/FlashSaleCountdown';
import Pagination from './Pagination';
import SkeletonLoader from './FlashSaleSkeleton';

interface Product {
  description: string;
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  flashSalePrice?: number;
  flashSaleStatus?: string;
  flashSaleDiscount?: number;
  flashSaleStartDate?: string;
  flashSaleEndDate?: string;
  images: string[];
  poster?: string;
  inventory?: number;
  rating?: number;
  reviews?: number;
  productType?: string;
  category?: string;
  createdAt: string;
}

interface FilterOptions {
  minPrice: number;
  maxPrice: number;
  categories: string[];
  inStockOnly: boolean;
  discountRange: string;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'discount' | 'ending-soon';
}

const FlashSalePage: React.FC = () => {
  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<FilterOptions>({
    minPrice: 0,
    maxPrice: 1000000,
    categories: [],
    inStockOnly: false,
    discountRange: 'all',
    sortBy: 'ending-soon'
  });

  // Fetch flash sale products
  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      setLoading(true);
      try {
        const result = await getAllProduct();
        const productsData = Array.isArray(result) ? result : result.products || [];
        
        // Filter active flash sale products
        const flashSaleProducts = productsData.filter((product: Product) => 
          product.flashSaleStatus === "Active" || 
          product.productType === "flash sale"
        );

        setProducts(flashSaleProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load flash sale products');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const allCategories = products
      .map(product => product.category)
      .filter(Boolean) as string[];
    return [...new Set(allCategories)];
  }, [products]);

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(product => {
      const price = product.flashSalePrice || product.price;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        product.category && filters.categories.includes(product.category)
      );
    }

    // In stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => (product.inventory || 0) > 0);
    }

    // Discount filter
    if (filters.discountRange !== 'all') {
      filtered = filtered.filter(product => {
        const discount = product.flashSaleDiscount || 0;
        switch (filters.discountRange) {
          case '10-30': return discount >= 10 && discount <= 30;
          case '30-50': return discount >= 30 && discount <= 50;
          case '50+': return discount >= 50;
          default: return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      const priceA = a.flashSalePrice || a.price;
      const priceB = b.flashSalePrice || b.price;
      const discountA = a.flashSaleDiscount || 0;
      const discountB = b.flashSaleDiscount || 0;
      const endDateA = a.flashSaleEndDate ? new Date(a.flashSaleEndDate).getTime() : Infinity;
      const endDateB = b.flashSaleEndDate ? new Date(b.flashSaleEndDate).getTime() : Infinity;

      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'discount':
          return discountB - discountA;
        case 'ending-soon':
          return endDateA - endDateB;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Stats
  const stats = useMemo(() => {
    const activeProducts = products.filter(p => p.flashSaleStatus === 'Active');
    const totalDiscount = activeProducts.reduce((sum, p) => sum + (p.flashSaleDiscount || 0), 0);
    const avgDiscount = activeProducts.length > 0 ? Math.round(totalDiscount / activeProducts.length) : 0;
    const endingSoon = activeProducts.filter(p => {
      if (!p.flashSaleEndDate) return false;
      const endTime = new Date(p.flashSaleEndDate).getTime();
      const now = new Date().getTime();
      return endTime - now < 24 * 60 * 60 * 1000; // Ends in less than 24 hours
    });

    return {
      total: products.length,
      active: activeProducts.length,
      avgDiscount,
      endingSoon: endingSoon.length,
      inStock: products.filter(p => (p.inventory || 0) > 0).length
    };
  }, [products]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 1000000,
      categories: [],
      inStockOnly: false,
      discountRange: 'all',
      sortBy: 'ending-soon'
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl mb-6 text-red-500">🔥</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Flash Sales</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <IoFlash className="text-2xl text-white" />
              <span className="text-white font-bold text-lg">LIMITED TIME OFFER</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              FLASH SALE <span className="text-yellow-300">🔥</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Don't miss out on incredible deals! Limited time offers with massive discounts.
            </p>
            <FlashSaleCountdown />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Offers</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Active Now</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.avgDiscount}%</div>
              <div className="text-sm text-gray-600">Avg Discount</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.endingSoon}</div>
              <div className="text-sm text-gray-600">Ending Soon</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.inStock}</div>
              <div className="text-sm text-gray-600">In Stock</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header with Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Flash Sale Products <span className="text-orange-500">({filteredAndSortedProducts.length})</span>
            </h2>
            <p className="text-gray-600 mt-1">
              Browse through our limited-time offers and save big!
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Items per page selector */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
              </select>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-600'}`}
              >
                <IoGrid className="text-lg" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-600'}`}
              >
                <IoList className="text-lg" />
              </button>
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaFilter />
              <span>Filters</span>
              {Object.values(filters).some(filter => 
                Array.isArray(filter) ? filter.length > 0 : 
                typeof filter === 'boolean' ? filter : 
                filter !== (filters as any).default) && (
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search flash sale products by name or category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Reset All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-4">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">₦{filters.minPrice.toLocaleString()}</span>
                    <span className="text-sm text-gray-600">₦{filters.maxPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-4">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={(e) => {
                            const newCategories = e.target.checked
                              ? [...filters.categories, category]
                              : filters.categories.filter(c => c !== category);
                            handleFilterChange('categories', newCategories);
                          }}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          ({products.filter(p => p.category === category).length})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Discount Range */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-4">Discount</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Discounts' },
                    { value: '10-30', label: '10% - 30% Off' },
                    { value: '30-50', label: '30% - 50% Off' },
                    { value: '50+', label: '50%+ Off' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="discount"
                        value={option.value}
                        checked={filters.discountRange === option.value}
                        onChange={(e) => handleFilterChange('discountRange', e.target.value)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-4">Availability</h4>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>

              {/* Sort By */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-4">Sort By</h4>
                <div className="space-y-2">
                  {[
                    { value: 'ending-soon', label: 'Ending Soon', icon: <FaClock /> },
                    { value: 'newest', label: 'Newest', icon: <FaFire /> },
                    { value: 'discount', label: 'Highest Discount', icon: <FaSortAmountDown /> },
                    { value: 'price-low', label: 'Price: Low to High', icon: <FaSortAmountUp /> },
                    { value: 'price-high', label: 'Price: High to Low', icon: <FaSortAmountDown /> }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange('sortBy', option.value as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.sortBy === option.value
                          ? 'bg-orange-50 text-orange-600 border border-orange-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`${filters.sortBy === option.value ? 'text-orange-600' : 'text-gray-400'}`}>
                        {option.icon}
                      </span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile filter close button */}
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {loading ? (
              <SkeletonLoader count={itemsPerPage} />
            ) : currentProducts.length > 0 ? (
              <>
                {/* Products Grid/List */}
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
                }>
                  {currentProducts.map((product) => (
                    viewMode === 'grid' ? (
                      <FlashSaleProductCard key={product._id} product={product} />
                    ) : (
                      <div key={product._id} className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/4">
                            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                              <img
                                src={product.images[0] || product.poster || '/placeholder.svg'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                              {product.flashSaleStatus === 'Active' && (
                                <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                  FLASH SALE
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="md:w-3/4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                            <div className="flex flex-wrap gap-4 mb-4">
                              {product.category && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                  {product.category}
                                </span>
                              )}
                              {product.inventory && product.inventory > 0 && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                  In Stock ({product.inventory})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                              <div className="text-2xl font-bold text-gray-900">
                                ₦{(product.flashSalePrice || product.price).toLocaleString()}
                              </div>
                              {product.originalPrice && product.originalPrice > (product.flashSalePrice || product.price) && (
                                <>
                                  <div className="text-lg text-gray-500 line-through">
                                    ₦{product.originalPrice.toLocaleString()}
                                  </div>
                                  <div className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-bold">
                                    -{product.flashSaleDiscount || 
                                      Math.round(((product.originalPrice - (product.flashSalePrice || product.price)) / product.originalPrice) * 100)}%
                                  </div>
                                </>
                              )}
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {product.description || 'No description available'}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {product.flashSaleEndDate && (
                                  <div className="flex items-center gap-2 text-sm text-red-600">
                                    <FaClock />
                                    <span>Ends: {new Date(product.flashSaleEndDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              <Link
                                to={`/product/${product._id}`}
                                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                    <div className="text-center text-sm text-gray-500 mt-4">
                      Showing {startIndex + 1} - {Math.min(endIndex, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
                    </div>
                  </div>
                )}

                {/* No results fallback */}
                {filteredAndSortedProducts.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-6 text-gray-300">🔥</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">No products found</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Try adjusting your filters or search query to find what you're looking for.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-6 text-gray-300">🛒</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No Flash Sales Available</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  There are no active flash sales at the moment. Check back soon for amazing deals!
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  <FaShoppingBag />
                  Browse All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want to be notified about upcoming flash sales?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive deals and limited-time offers!
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSalePage;