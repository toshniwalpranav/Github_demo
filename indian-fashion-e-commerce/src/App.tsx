/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { products } from './data/products';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartWishlistDrawer from './components/CartWishlistDrawer';
import Footer from './components/Footer';
import ToastContainer, { ToastMessage } from './components/Toast';
import { Sparkles, MapPin, Phone, Mail, Building, Send, Star, MoveRight } from 'lucide-react';

export default function App() {
  // Navigation & search state
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // E-commerce states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Drawer / Modals UI states
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<'cart' | 'wishlist'>('cart');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('fashion_india_cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem('fashion_india_wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedRecent = localStorage.getItem('fashion_india_recent');
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));

      const savedTheme = localStorage.getItem('fashion_india_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.body.classList.add('dark-mode');
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
  }, []);

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem('fashion_india_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('fashion_india_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('fashion_india_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Handle Hash Changes for Related Products link clicking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#view-')) {
        const id = parseInt(hash.replace('#view-', ''), 10);
        const prod = products.find(p => p.id === id);
        if (prod) {
          handleQuickView(prod);
          window.location.hash = ''; // reset hash
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Toast dispatch helper
  const addToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Dark mode toggler
  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('fashion_india_theme', 'dark');
      addToast('Dark mode enabled', 'info');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('fashion_india_theme', 'light');
      addToast('Light mode enabled', 'info');
    }
  };

  // Cart Management
  const handleAddToCart = (product: Product, size: string, color: string) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart((prev) => [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }]);
    }
    addToast(`Added ${product.name} (Size: ${size}) to Bag!`, 'success');
  };

  // Immediate checkout buy now handler
  const handleBuyNow = (product: Product, size: string, color: string) => {
    handleAddToCart(product, size, color);
    setDrawerTab('cart');
    setIsDrawerOpen(true);
  };

  // Wishlist Management
  const handleToggleWishlist = (product: Product) => {
    const isSaved = wishlist.some((item) => item.id === product.id);
    if (isSaved) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      addToast(`Removed ${product.name} from Wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast(`Saved ${product.name} to Wishlist!`, 'success');
    }
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    addToast(`Removed ${product.name} from Wishlist`, 'info');
  };

  // Quick view triggers and recently viewed logs
  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    
    // Log into recently viewed (maintain unique max 4 history items)
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      return [product, ...filtered].slice(0, 4);
    });
  };

  const handleBrandSearch = (brandName: string) => {
    setSearchQuery(brandName);
    setActiveTab('Home');
    document.getElementById('product-display-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Mock contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Message sent successfully! Our executive will revert in 24 hours.', 'success');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${isDarkMode ? 'dark text-white bg-slate-950' : 'bg-slate-50/20 text-slate-900'}`}>
      
      {/* Toast Overlay */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenCart={() => { setDrawerTab('cart'); setIsDrawerOpen(true); }}
        onOpenWishlist={() => { setDrawerTab('wishlist'); setIsDrawerOpen(true); }}
      />

      {/* Main Container */}
      <main className="flex-1">
        {activeTab === 'Home' && !searchQuery && (
          <HeroSection
            setActiveTab={setActiveTab}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* Dynamic Inner Tab Views */}
        {activeTab === 'Contact' ? (
          /* ==================== CONTACT US INTERACTIVE VIEW ==================== */
          <div id="contact-us-page" className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#FF6B00] flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" />
                Get In Touch
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
                We'd Love to Assist You
              </h1>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                Have questions about sizing, regional handlooms, delivery speeds, or bulk wedding coordinates? Contact our concierge desk.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
              
              {/* Contact Form */}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white mb-2">Send Us a Message</h3>
                
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Mahindra"
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF6B00]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF6B00]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Message Detail</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Specify sizing, custom fabrics, or delivery pinsicodes..."
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF6B00] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF6B00] hover:bg-[#E05E00] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/10 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Send Concierge Inquiry
                </button>
              </form>

              {/* Head Offices Info */}
              <div className="space-y-6">
                <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">Head Office Concierges</h3>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-2xl text-[#FF6B00] shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Mumbai Corporate Office</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Fashion India Towers, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-2xl text-[#FF6B00] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Delhi Creative Atelier</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Design Hub No.14, DLF Cyber City, Phase 3, Gurugram, NCR Delhi 122002
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-2xl text-[#FF6B00] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Contact Hotlines</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      <strong>Sales Desk:</strong> +91 22 8902 4433
                    </p>
                    <p className="text-xs text-slate-400">
                      <strong>Support Desk:</strong> support@fashionindia.com
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : activeTab === 'Brands' ? (
          /* ==================== BRANDS DEDICATED VIEW ==================== */
          <div id="brands-showcase-page" className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#FF6B00] flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" />
                Premium Brand Houses
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
                Discover Our Signature Partners
              </h1>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                Explore elite and authentic brand houses. Tap on any brand to load their exclusive products instantly.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { name: "Louis Philippe", type: "Elite Formals", bg: "bg-amber-500" },
                { name: "Allen Solly", type: "Desk-to-Dinner", bg: "bg-blue-600" },
                { name: "Zara", type: "European Chic", bg: "bg-slate-950" },
                { name: "H&M", type: "Urban Streetwear", bg: "bg-red-600" },
                { name: "FabIndia", type: "Handspun Heritage", bg: "bg-emerald-600" },
                { name: "Biba", type: "Festive Elegance", bg: "bg-rose-500" },
                { name: "W", type: "Pastel Ethnics", bg: "bg-indigo-500" },
                { name: "Levis", type: "Legendary Denim", bg: "bg-red-800" },
                { name: "Wrangler", type: "Rugged Outerwears", bg: "bg-amber-800" },
                { name: "Spykar", type: "Street Couture", bg: "bg-blue-900" },
                { name: "Nike", type: "Active Dry-Fit", bg: "bg-slate-900" },
                { name: "Puma", type: "Sports Performance", bg: "bg-emerald-800" },
              ].map((brandItem, index) => (
                <div
                  key={index}
                  onClick={() => handleBrandSearch(brandItem.name)}
                  className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-6 rounded-3xl hover:border-[#FF6B00] hover:shadow-xl transition-all flex flex-col justify-between h-40 relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 ${brandItem.bg} opacity-10 rounded-full translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500`}></div>
                  
                  <div>
                    <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#FF6B00]">
                      {brandItem.type}
                    </span>
                    <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white mt-1 group-hover:text-[#FF6B00] transition-colors">
                      {brandItem.name}
                    </h3>
                  </div>

                  <span className="text-xs font-bold text-slate-400 group-hover:text-[#FF6B00] flex items-center gap-1 transition-all mt-4">
                    Explore House
                    <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ==================== STANDARD PRODUCT LISTINGS & FILTERS ==================== */
          <ProductGrid
            activeTab={activeTab}
            searchQuery={searchQuery}
            onQuickView={handleQuickView}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
            activeCategoryFilter={activeCategoryFilter}
            setActiveCategoryFilter={setActiveCategoryFilter}
          />
        )}

        {/* ==================== FEATURED / RECENTLY VIEWED ROW ==================== */}
        {recentlyViewed.length > 0 && (activeTab === 'Home' || activeTab === 'Men' || activeTab === 'Women' || activeTab === 'Kids') && (
          <div id="recently-viewed-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8 border-t border-slate-100 dark:border-slate-900">
            <h2 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight flex items-center gap-1.5">
              <span className="w-1.5 h-6 bg-[#FF6B00] rounded-full"></span>
              Recently Viewed Apparel
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {recentlyViewed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleQuickView(item)}
                  className="group cursor-pointer bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-150 dark:border-slate-800 hover:border-orange-500/10 hover:shadow-lg transition-all flex items-center gap-3"
                >
                  <div className="w-14 aspect-[3/4] rounded-lg overflow-hidden shrink-0 bg-slate-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[9px] uppercase font-bold text-[#FF6B00] block">{item.brand}</span>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate leading-tight mt-0.5">{item.name}</h4>
                    <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white block mt-1">₹{item.discountPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Shopping Bag Drawer Overlay */}
      <CartWishlistDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        cart={cart}
        setCart={setCart}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        initialTab={drawerTab}
        addToast={addToast}
      />

      {/* Product Quick View Detail Overlay Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onToggleWishlist={handleToggleWishlist}
          isSavedInWishlist={wishlist.some(w => w.id === selectedProduct.id)}
        />
      )}

      {/* Premium Footers */}
      <Footer
        onBrandClick={handleBrandSearch}
        addToast={addToast}
      />
    </div>
  );
}
