/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Heart, Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

const SEARCH_SUGGESTIONS = [
  "Kurta Set", "Levis Jeans", "Silk Saree", "Frock", "Zara Dress", "Formal Shirt", "Graphic T-Shirt", "Sherpa Jacket"
];

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  cartCount,
  wishlistCount,
  isDarkMode,
  toggleDarkMode,
  onOpenCart,
  onOpenWishlist
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: 'Home', val: 'Home' },
    { name: 'Men', val: 'Men' },
    { name: 'Women', val: 'Women' },
    { name: 'Kids', val: 'Kids' },
    { name: 'New Arrivals', val: 'New Arrivals' },
    { name: 'Sale', val: 'Sale' },
    { name: 'Brands', val: 'Brands' },
    { name: 'Contact', val: 'Contact' }
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <header
      id="main-nav-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-950/95 shadow-md border-b border-slate-100 dark:border-slate-800 backdrop-blur-md py-3'
          : 'bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          id="nav-logo-section"
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => {
            setActiveTab('Home');
            setSearchQuery('');
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-orange-500/20">
            F
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-[#FF6B00] to-[#E05E00] dark:from-white dark:to-orange-500 bg-clip-text text-transparent">
            FASHION<span className="text-slate-500 dark:text-slate-400 font-light">INDIA</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.val;
            return (
              <button
                key={item.val}
                id={`nav-tab-${item.val.toLowerCase()}`}
                onClick={() => {
                  setActiveTab(item.val);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-full font-sans text-sm font-semibold transition-all duration-200 relative ${
                  isActive
                    ? 'text-white bg-[#FF6B00] shadow-md shadow-orange-500/10'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {item.name}
                {item.val === 'Sale' && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                    30%+
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Search Bar Container */}
        <div ref={suggestionRef} id="nav-search-container" className="hidden md:flex relative flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search premium apparel, brands, categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-full border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/15 transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Popular Searches</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {SEARCH_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-880 text-slate-700 dark:text-slate-300 rounded-full hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-[#FF6B00] transition-colors flex items-center gap-1"
                  >
                    {suggestion}
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
              {searchQuery && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-2 text-xs text-slate-500 flex items-center justify-between">
                  <span>Press enter to search for <strong className="text-[#FF6B00]">"{searchQuery}"</strong></span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div id="nav-actions-container" className="flex items-center gap-2 sm:gap-4">
          {/* Dark Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            id="theme-toggle-btn"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-5.5 h-5.5" /> : <Moon className="w-5.5 h-5.5" />}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            id="wishlist-trigger-btn"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-5.5 h-5.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md shadow-orange-500/20">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            id="cart-trigger-btn"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition-colors relative"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5.5 h-5.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md shadow-orange-500/20">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full lg:hidden transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input (Visible on small screens) */}
      <div className="px-4 mt-2 md:hidden">
        <div ref={suggestionRef} className="relative w-full">
          <input
            type="text"
            placeholder="Search premium apparel, brands..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-full border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#FF6B00] transition-all"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Suggestions Mobile */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 text-xs bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-orange-50 hover:text-[#FF6B00] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-sidebar-overlay" className="fixed inset-0 top-[115px] z-30 bg-black/50 lg:hidden">
          <nav className="bg-white dark:bg-slate-950 w-64 h-full shadow-xl border-r border-slate-100 dark:border-slate-900 p-6 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.val;
              return (
                <button
                  key={item.val}
                  onClick={() => {
                    setActiveTab(item.val);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-white bg-[#FF6B00]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.name}
                  {item.val === 'Sale' && (
                    <span className="ml-2 bg-red-500 text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold">
                      HOT
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
