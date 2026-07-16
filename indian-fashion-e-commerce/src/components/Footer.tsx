/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Facebook, Instagram, Twitter, Heart, Send, Sparkles, Star } from 'lucide-react';

interface FooterProps {
  onBrandClick: (brandName: string) => void;
  addToast: (text: string, type: 'success' | 'info' | 'warning') => void;
}

const TOP_BRANDS = [
  "Allen Solly", "Louis Philippe", "Peter England", "Van Heusen", "Levis", "Wrangler",
  "Spykar", "US Polo Assn", "Roadster", "Highlander", "H&M", "Zara", "Biba", "W",
  "Libas", "Global Desi", "FabIndia", "Aurelia", "Nike", "Adidas", "Puma"
];

const CUSTOMER_REVIEWS = [
  {
    name: "Aishwarya Sen",
    city: "Bangalore",
    review: "The cotton Banarasi sarees are breathtaking! Fast 3 days delivery. The gold Zari detail is immaculate. Truly a luxury e-commerce experience.",
    rating: 5
  },
  {
    name: "Rohan Malhotra",
    city: "New Delhi",
    review: "Incredible fit on the Giza Cotton formal shirt! I bought 3 from Louis Philippe. High contrast colors, very eye-safe and premium structure.",
    rating: 5
  },
  {
    name: "Pooja Hegde",
    city: "Mumbai",
    review: "The kids collections are exceptionally soft. No scratchy materials. It survived 4 washing cycles and still looks vibrant and brand new!",
    rating: 5
  }
];

export default function Footer({ onBrandClick, addToast }: FooterProps) {
  const [email, setEmail] = useState<string>('');
  const [activeReviewIdx, setActiveReviewIdx] = useState<number>(0);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Please enter a valid email address', 'warning');
      return;
    }
    addToast('Thank you! subscribed to Fashion India Newsletter', 'success');
    setEmail('');
  };

  return (
    <footer id="premium-footer" className="bg-slate-900 text-slate-300 dark:bg-slate-950 dark:text-slate-400 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ==================== 1. CUSTOMER REVIEWS ==================== */}
        <div id="customer-reviews-section" className="mb-16 bg-white/5 border border-slate-800 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6B00]/5 rounded-full translate-x-6 -translate-y-6"></div>
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#FF6B00] flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Reviews
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-black text-white mt-1">What Our Customers Say</h3>
          </div>

          <div className="max-w-2xl mx-auto text-center min-h-[140px] flex flex-col justify-between">
            <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
              "{CUSTOMER_REVIEWS[activeReviewIdx]?.review}"
            </p>
            <div className="mt-4">
              <div className="flex justify-center gap-1 mb-1">
                {Array.from({ length: CUSTOMER_REVIEWS[activeReviewIdx]?.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-xs font-bold text-white">
                {CUSTOMER_REVIEWS[activeReviewIdx]?.name}
              </p>
              <p className="text-[10px] text-slate-400">
                {CUSTOMER_REVIEWS[activeReviewIdx]?.city}, IN
              </p>
            </div>
          </div>

          {/* Dots controller */}
          <div className="flex justify-center gap-2 mt-6">
            {CUSTOMER_REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReviewIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeReviewIdx ? 'bg-[#FF6B00] w-4' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ==================== 2. FOOTER COLUMNS ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-slate-800">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B00] flex items-center justify-center text-white font-display font-bold text-lg">
                F
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                FASHION<span className="text-[#FF6B00] font-light">INDIA</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              India's premier luxury apparel marketplace. Bringing handspun, organic cotton sarees, designer kurtis, and modern athletic street apparel straight to your doorstep.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 bg-slate-800 hover:bg-[#FF6B00] rounded-full text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-[#FF6B00] rounded-full text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-[#FF6B00] rounded-full text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Help & Care */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Help & Care</h4>
            <ul className="space-y-2 text-xs font-light text-slate-400">
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Track Orders</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">15-Day Exchange Policies</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Size Guides</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Shipping Details</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Trending Links</h4>
            <ul className="space-y-2 text-xs font-light text-slate-400">
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Indian Handspun Khadi</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Banarasi Gold Silk Sarees</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Active Dry-Fit Activewear</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Heavy Fleece Winter Hoodies</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Bridal Lehenga Selections</a></li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Stay Connected</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Subscribe to unlock flash sales, early collections, and receive custom extra discounts!
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                />
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
              </div>
              <button
                type="submit"
                className="p-2 bg-[#FF6B00] hover:bg-[#E05E00] rounded-xl text-white transition-colors shrink-0"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        </div>

        {/* ==================== 3. BRANDS INDEX ==================== */}
        <div id="brands-index-section" className="py-8 border-b border-slate-800">
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider mb-3">Top Brands Index</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
            {TOP_BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => onBrandClick(brand)}
                className="hover:text-[#FF6B00] transition-colors cursor-pointer"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== 4. COPYRIGHTS ==================== */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Fashion India Premium. Crafted with luxury aesthetics for Indian apparel lovers.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> in India
          </p>
        </div>

      </div>
    </footer>
  );
}
