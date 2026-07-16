/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, BadgePercent } from 'lucide-react';

interface HeroSectionProps {
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
}

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: "Festive Style Revolution",
    subtitle: "AUTHENTIC & FUSION COUTURES",
    tagline: "Flat 30% OFF on elite kurtas, premium Banarasi sarees, and traditional drapes.",
    badge: "FESTIVE SALE",
    buttonText: "Shop Festive",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop&q=80",
    tab: "Women",
    query: ""
  },
  {
    id: 2,
    title: "Urban Street & Denim",
    subtitle: "ELEVATED CASUAL WEAR",
    tagline: "Upgrade your capsule wardrobe with Levi's, H&M, Zara and premium Roadster wear.",
    badge: "WELCOME10",
    badgeLabel: "Save Extra 10% Off",
    buttonText: "Explore Casuals",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1200&auto=format&fit=crop&q=80",
    tab: "Men",
    query: "Jeans"
  },
  {
    id: 3,
    title: "Playful Active Adventures",
    subtitle: "DURABLE KIDS COLLECTIONS",
    tagline: "Unrestricted play with Nike, Puma, H&M. Buy 2 Get 1 Free on selected articles.",
    badge: "BUY 2 GET 1 FREE",
    buttonText: "Explore Kids",
    image: "https://images.unsplash.com/photo-1540479859555-17af45c78a90?w=1200&auto=format&fit=crop&q=80",
    tab: "Kids",
    query: ""
  }
];

const CATEGORIES = [
  { name: "Kurtis & Sarees", image: "https://images.unsplash.com/photo-1610030469915-98e550d6193c?w=150&auto=format&fit=crop&q=80", tab: "Women", query: "Kurti" },
  { name: "Premium Shirts", image: "https://images.unsplash.com/photo-1620012253295-c05cb1e7421b?w=150&auto=format&fit=crop&q=80", tab: "Men", query: "Shirts" },
  { name: "Kids Frocks", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=150&auto=format&fit=crop&q=80", tab: "Kids", query: "Frocks" },
  { name: "Elite Blazers", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=80", tab: "Men", query: "Blazers" },
  { name: "Designer Tops", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", tab: "Women", query: "Tops" },
  { name: "Active Hoodies", image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=150&auto=format&fit=crop&q=80", tab: "Kids", query: "Hoodie" },
];

const DISCOUNT_BANNERS = [
  { title: "Festive Grand Sale", discount: "Flat 30% OFF", desc: "Use coupon in checkout", bg: "from-amber-600 to-rose-700 text-white", tab: "Women", query: "Kurtis" },
  { title: "Clearance Stock", discount: "Up to 60% OFF", desc: "Selected outerwear & hoodies", bg: "from-[#FF6B00] to-orange-700 text-white", tab: "New Arrivals", query: "" },
  { title: "Welcome Privilege", discount: "Extra 10% OFF", desc: "Use code: WELCOME10", bg: "from-slate-900 to-slate-850 text-white border border-slate-800 dark:border-slate-700", tab: "Sale", query: "" }
];

export default function HeroSection({ setActiveTab, setSearchQuery }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerAction = (tab: string, query: string) => {
    setActiveTab(tab);
    setSearchQuery(query);
    // Smooth scroll to product grid
    document.getElementById('product-display-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="hero-section-container" className="w-full bg-slate-50 dark:bg-slate-950 pb-12">
      {/* 1. Main Hero Carousel */}
      <div className="relative h-[480px] sm:h-[540px] md:h-[600px] w-full overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          {CAROUSEL_SLIDES.map((slide, index) => {
            if (index !== currentSlide) return null;
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full flex items-center justify-start bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(15,15,17,0.95) 20%, rgba(15,15,17,0.7) 50%, rgba(15,15,17,0.2) 100%), url(${slide.image})`
                }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-lg md:max-w-2xl text-left">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-rose-600 rounded-full text-xs font-bold text-white tracking-widest uppercase mb-4"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {slide.badge}
                    </motion.div>

                    <motion.h4
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-orange-400 font-sans text-xs sm:text-sm font-black uppercase tracking-widest mb-2"
                    >
                      {slide.subtitle}
                    </motion.h4>

                    <motion.h1
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-white font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none mb-4"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-slate-300 font-sans text-base sm:text-lg mb-8 leading-relaxed font-light"
                    >
                      {slide.tagline}
                    </motion.p>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-wrap items-center gap-4"
                    >
                      <button
                        onClick={() => handleBannerAction(slide.tab, slide.query)}
                        className="px-8 py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-semibold text-sm rounded-full shadow-lg shadow-orange-500/20 flex items-center gap-2 group transition-all"
                      >
                        {slide.buttonText}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>

                      {slide.badgeLabel && (
                        <span className="text-sm text-slate-400">
                          Or enter coupon code <strong className="text-white underline font-mono">{slide.badge}</strong>
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Carousel Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
          {CAROUSEL_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentSlide ? 'bg-[#FF6B00] scale-125' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. Micro-Features Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 p-4">
          <div className="flex items-center gap-4 p-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Free Delivery</p>
              <p className="text-xs text-slate-400">On orders above ₹1,499</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Easy Exchange</p>
              <p className="text-xs text-slate-400">15-day no questions asked</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">100% Genuine</p>
              <p className="text-xs text-slate-400">Directly from official brand stores</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center shrink-0">
              <BadgePercent className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">WELCOME10</p>
              <p className="text-xs text-slate-400">Flat 10% off for first-time buyers</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Circular Hot Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Shop Hot Categories
          </h2>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 justify-center">
          {CATEGORIES.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleBannerAction(cat.tab, cat.query)}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#FF6B00] transition-all shadow-md group-hover:shadow-lg group-hover:scale-105 duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#FF6B00] transition-colors text-center font-sans">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Elegant Discount Board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DISCOUNT_BANNERS.map((banner, index) => (
            <div
              key={index}
              onClick={() => handleBannerAction(banner.tab, banner.query)}
              className={`rounded-2xl p-6 bg-gradient-to-r ${banner.bg} shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group overflow-hidden relative`}
            >
              {/* Highlight flare effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 -translate-y-12 rotate-45 transform group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative z-10">
                <p className="text-xs uppercase font-extrabold tracking-widest text-orange-200/90 mb-1">{banner.title}</p>
                <h3 className="text-2xl font-display font-black leading-none mb-1">{banner.discount}</h3>
                <p className="text-xs font-medium text-white/80">{banner.desc}</p>
              </div>

              <div className="relative z-10 w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#FF6B00] text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
