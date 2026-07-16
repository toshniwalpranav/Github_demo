/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { products } from '../data/products';
import { Heart, ShoppingCart, Eye, Star, SlidersHorizontal, ChevronDown, RefreshCw, AlertCircle, ShoppingBag, ArrowUpDown } from 'lucide-react';

interface ProductGridProps {
  activeTab: string;
  searchQuery: string;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onBuyNow: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
  activeCategoryFilter: string;
  setActiveCategoryFilter: (cat: string) => void;
}

const ITEMS_PER_PAGE = 12;

export default function ProductGrid({
  activeTab,
  searchQuery,
  onQuickView,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  wishlist,
  activeCategoryFilter,
  setActiveCategoryFilter
}: ProductGridProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(4999);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  
  const [sortBy, setSortBy] = useState<string>('trending');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Trigger loading skeleton on search, tab switch, or filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    setCurrentPage(1);
    return () => clearTimeout(timer);
  }, [activeTab, searchQuery, selectedBrand, selectedColor, selectedSize, maxPrice, minDiscount, minRating, onlyInStock, activeCategoryFilter]);

  // Derive unique brands, colors, and categories dynamically from products
  const allBrands = Array.from(new Set(products.map(p => p.brand))).sort();
  const allCategories = Array.from(new Set(products.map(p => p.category))).sort();
  const allColors = Array.from(new Set(products.flatMap(p => p.colors))).sort();
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y", "26", "28", "30", "32", "34", "36", "38", "40", "42", "44"];

  // Filter products based on criteria
  const filteredProducts = products.filter((product) => {
    // 1. Tab / Segment Filter
    if (activeTab === 'Men' && product.gender !== 'Men') return false;
    if (activeTab === 'Women' && product.gender !== 'Women') return false;
    if (activeTab === 'Kids' && product.gender !== 'Kids') return false;
    if (activeTab === 'New Arrivals' && !product.isNew) return false;
    if (activeTab === 'Sale' && product.discount < 30) return false;
    if (activeTab === 'Brands' && selectedBrand === 'All') {
      // Just keep it as is, or show top brands
    }

    // 2. Navigation bar Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat && !matchDesc) return false;
    }

    // 3. Category Filter
    if (activeCategoryFilter !== 'All' && product.category !== activeCategoryFilter) return false;

    // 4. Brand Filter
    if (selectedBrand !== 'All' && product.brand !== selectedBrand) return false;

    // 5. Color Filter
    if (selectedColor !== 'All' && !product.colors.includes(selectedColor)) return false;

    // 6. Size Filter
    if (selectedSize !== 'All' && !product.sizes.includes(selectedSize)) return false;

    // 7. Max Price Filter
    if (product.discountPrice > maxPrice) return false;

    // 8. Min Discount Filter
    if (product.discount < minDiscount) return false;

    // 9. Min Rating Filter
    if (product.rating < minRating) return false;

    // 10. Availability / Stock
    if (onlyInStock && product.stock <= 0) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.discountPrice - b.discountPrice;
    if (sortBy === 'price-desc') return b.discountPrice - a.discountPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviews - a.reviews;
    if (sortBy === 'discount') return b.discount - a.discount;
    if (sortBy === 'trending') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    return 0;
  });

  // Pagination bounds
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetAllFilters = () => {
    setSelectedBrand('All');
    setSelectedColor('All');
    setSelectedSize('All');
    setMaxPrice(4999);
    setMinDiscount(0);
    setMinRating(0);
    setOnlyInStock(false);
    setActiveCategoryFilter('All');
    setSortBy('trending');
  };

  const isProductInWishlist = (pId: number) => wishlist.some(item => item.id === pId);

  return (
    <section id="product-display-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
      
      {/* Segment Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{activeTab === 'Home' ? 'Curated Collection' : activeTab}</span>
            <span className="text-sm font-mono font-medium text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">
              {totalItems} Items
            </span>
          </h2>
          {searchQuery && (
            <p className="text-sm text-slate-500 mt-1">
              Showing search results for <strong className="text-[#FF6B00]">"{searchQuery}"</strong>
            </p>
          )}
        </div>

        {/* Sorting & Filter Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="flex lg:hidden items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FF6B00]" />
            Filters
          </button>

          {/* Sort Menu */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm flex-1 sm:flex-initial">
            <ArrowUpDown className="w-4 h-4 text-[#FF6B00] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-xs font-bold w-full"
            >
              <option value="trending" className="dark:bg-slate-900">Sort: Trending</option>
              <option value="price-asc" className="dark:bg-slate-900">Price: Low to High</option>
              <option value="price-desc" className="dark:bg-slate-900">Price: High to Low</option>
              <option value="rating" className="dark:bg-slate-900">Customer Rating</option>
              <option value="reviews" className="dark:bg-slate-900">Popularity</option>
              <option value="discount" className="dark:bg-slate-900">Discount %</option>
            </select>
          </div>

          {/* Reset Filters Quick Button */}
          {(selectedBrand !== 'All' || selectedColor !== 'All' || selectedSize !== 'All' || maxPrice < 4999 || minDiscount > 0 || minRating > 0 || onlyInStock || activeCategoryFilter !== 'All') && (
            <button
              onClick={resetAllFilters}
              className="p-2 bg-orange-50 dark:bg-orange-950/20 text-[#FF6B00] hover:text-white hover:bg-[#FF6B00] rounded-xl transition-all"
              title="Clear All Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* ==================== FILTERS SIDEBAR (DESKTOP) ==================== */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-24 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-400">Refine Search</h3>
            <button
              onClick={resetAllFilters}
              className="text-xs font-bold text-[#FF6B00] hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
            {/* Category Filter */}
            <div className="pt-0">
              <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3">Category</h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                <button
                  onClick={() => setActiveCategoryFilter('All')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex justify-between items-center ${
                    activeCategoryFilter === 'All'
                      ? 'bg-orange-50 dark:bg-orange-950/20 text-[#FF6B00]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex justify-between items-center ${
                      activeCategoryFilter === cat
                        ? 'bg-orange-50 dark:bg-orange-950/20 text-[#FF6B00]'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="pt-4">
              <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3">Brand</h4>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-850 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="All">All Brands</option>
                {allBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Price Filter Slider */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Max Price</h4>
                <span className="text-xs font-mono font-extrabold text-[#FF6B00]">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="499"
                max="4999"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#FF6B00] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>₹499</span>
                <span>₹4999</span>
              </div>
            </div>

            {/* Sizes Filter */}
            <div className="pt-4">
              <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3">Size</h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSize('All')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono border ${
                    selectedSize === 'All'
                      ? 'bg-[#FF6B00] border-transparent text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-[#FF6B00]'
                  }`}
                >
                  All
                </button>
                {allSizes.slice(0, 8).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono border ${
                      selectedSize === sz
                        ? 'bg-[#FF6B00] border-transparent text-white'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-[#FF6B00]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="pt-4">
              <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3">Color</h4>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-850 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="All">All Colors</option>
                {allColors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            {/* Discount Filter */}
            <div className="pt-4">
              <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3">Min Discount</h4>
              <div className="space-y-1.5">
                {[0, 10, 20, 30, 40, 50].map((disc) => (
                  <button
                    key={disc}
                    onClick={() => setMinDiscount(disc)}
                    className={`w-full text-left px-2 py-1 rounded-lg text-xs font-medium flex justify-between items-center ${
                      minDiscount === disc
                        ? 'text-[#FF6B00] font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-[#FF6B00]'
                    }`}
                  >
                    <span>{disc === 0 ? 'All Discounts' : `${disc}% and above`}</span>
                    {minDiscount === disc && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4">
              <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3">Minimum Rating</h4>
              <div className="space-y-1.5">
                {[0, 4, 4.5].map((rat) => (
                  <button
                    key={rat}
                    onClick={() => setMinRating(rat)}
                    className={`w-full text-left px-2 py-1 rounded-lg text-xs font-medium flex justify-between items-center ${
                      minRating === rat
                        ? 'text-[#FF6B00] font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-[#FF6B00]'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {rat === 0 ? 'All Ratings' : `${rat} ⭐ and above`}
                    </span>
                    {minRating === rat && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="pt-4 pb-0 flex items-center justify-between">
              <label htmlFor="inStockCheckbox" className="text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                Exclude Out of Stock
              </label>
              <input
                id="inStockCheckbox"
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4.5 h-4.5 rounded text-[#FF6B00] accent-[#FF6B00] cursor-pointer"
              />
            </div>
          </div>
        </aside>

        {/* ==================== FILTERS OVERLAY (MOBILE DRAWER) ==================== */}
        {showFiltersMobile && (
          <div id="mobile-filter-overlay" className="fixed inset-0 z-50 bg-black/50 flex justify-end lg:hidden">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              className="w-80 bg-white dark:bg-slate-900 h-full p-6 overflow-y-auto flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">Refine Selection</h3>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              {/* Duplicate Filters structure inside mobile drawer */}
              <div className="space-y-6 flex-1 pr-1">
                <div>
                  <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-2">Category</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {allCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          activeCategoryFilter === cat ? 'bg-[#FF6B00] text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-2">Brand</h4>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-800"
                  >
                    <option value="All">All Brands</option>
                    {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Max Price</h4>
                    <span className="text-xs font-mono font-extrabold text-[#FF6B00]">₹{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="499"
                    max="4999"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#FF6B00]"
                  />
                </div>

                <div>
                  <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-2">Min Discount</h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[0, 10, 20, 30, 40, 50].map((d) => (
                      <button
                        key={d}
                        onClick={() => setMinDiscount(d)}
                        className={`py-2 rounded-xl text-xs font-semibold ${
                          minDiscount === d ? 'bg-[#FF6B00] text-white' : 'bg-slate-50 dark:bg-slate-850 text-slate-600'
                        }`}
                      >
                        {d === 0 ? 'All' : `${d}%+`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pb-6">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Exclude Out of Stock</span>
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#FF6B00]"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <button
                  onClick={resetAllFilters}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="flex-1 py-3 bg-[#FF6B00] text-white rounded-xl text-xs font-bold"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ==================== PRODUCT CARDS GRID ==================== */}
        <div className="flex-1">
          {isLoading ? (
            /* Loading Skeleton */
            <div id="loading-skeletons" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm animate-pulse">
                  <div className="w-full aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 w-2/3 rounded-full mb-2"></div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 w-full rounded-full mb-3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 w-1/2 rounded-full mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 flex-1 rounded-full"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 w-10 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            /* Empty State */
            <div id="empty-results-box" className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-8">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">No Apparel Found</h3>
              <p className="text-slate-400 text-sm mt-1 mb-6">We couldn't find any products matching your specific selection criteria.</p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 bg-[#FF6B00] text-white rounded-full font-bold text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Real Cards Grid */
            <div>
              <div id="active-cards-grid" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => {
                  const isSaved = isProductInWishlist(product.id);
                  const isLowStock = product.stock > 0 && product.stock <= 15;
                  const isOutOfStock = product.stock <= 0;

                  return (
                    <motion.div
                      key={product.id}
                      id={`product-card-${product.id}`}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-3 sm:p-4 shadow-sm hover:shadow-xl hover:border-orange-500/20 dark:hover:border-orange-500/20 transition-all flex flex-col relative"
                    >
                      {/* Badge Top Left */}
                      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5">
                        {product.isNew && (
                          <span className="bg-emerald-500 text-white font-sans font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            New
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="bg-[#FF6B00] text-white font-sans font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Bestseller
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => onToggleWishlist(product)}
                        id={`wishlist-toggle-${product.id}`}
                        className={`absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md ${
                          isSaved
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-300 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>

                      {/* Image Stage */}
                      <div className="zoom-container w-full aspect-[3/4] bg-slate-50 dark:bg-slate-800 rounded-2xl mb-4 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="zoom-img w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />

                        {/* Quick View Cover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => onQuickView(product)}
                            className="p-3 bg-white text-slate-900 rounded-full shadow-lg hover:scale-110 transition-transform"
                            title="Quick View"
                          >
                            <Eye className="w-5 h-5 text-[#FF6B00]" />
                          </button>
                        </div>
                      </div>

                      {/* Info Frame */}
                      <div className="flex-1 flex flex-col">
                        <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#FF6B00] mb-0.5">
                          {product.brand}
                        </span>
                        
                        <h3 className="text-xs sm:text-sm font-sans font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-1">
                          {product.name}
                        </h3>

                        {/* Rating block */}
                        <div className="flex items-center gap-1 mb-2.5">
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded">
                            {product.rating} <Star className="w-3 h-3 fill-current" />
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">({product.reviews})</span>
                        </div>

                        {/* Price Frame */}
                        <div className="mt-auto flex items-baseline gap-2 mb-3">
                          <span className="font-mono text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                            ₹{product.discountPrice}
                          </span>
                          {product.discount > 0 && (
                            <>
                              <span className="font-mono text-xs text-slate-400 line-through">
                                ₹{product.price}
                              </span>
                              <span className="text-[10px] sm:text-xs font-black text-red-500">
                                ({product.discount}% OFF)
                              </span>
                            </>
                          )}
                        </div>

                        {/* Stock alerts */}
                        <div className="mb-3">
                          {isOutOfStock ? (
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">
                              Only {product.stock} left!
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                              In Stock
                            </span>
                          )}
                        </div>

                        {/* Sizes Pill list */}
                        <div className="flex gap-1 mb-3 overflow-x-auto py-0.5">
                          {product.sizes.slice(0, 4).map((sz) => (
                            <span key={sz} className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 rounded">
                              {sz}
                            </span>
                          ))}
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex gap-2">
                          <button
                            disabled={isOutOfStock}
                            onClick={() => onAddToCart(product, product.sizes[0] || 'M', product.colors[0] || 'Black')}
                            className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#FF6B00]/10 dark:hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Cart
                          </button>
                          
                          <button
                            disabled={isOutOfStock}
                            onClick={() => onBuyNow(product, product.sizes[0] || 'M', product.colors[0] || 'Black')}
                            className="flex-1 py-2 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md shadow-orange-500/10"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ==================== PAGINATION CONTROLS ==================== */}
              {totalPages > 1 && (
                <div id="pagination-controls" className="flex items-center justify-center gap-2 mt-12 border-t border-slate-100 dark:border-slate-800 pt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNo = idx + 1;
                    return (
                      <button
                        key={pageNo}
                        onClick={() => setCurrentPage(pageNo)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          currentPage === pageNo
                            ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/10'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {pageNo}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
