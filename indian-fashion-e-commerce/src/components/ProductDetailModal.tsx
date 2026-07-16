/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { products } from '../data/products';
import { Heart, ShoppingBag, ShoppingCart, Star, X, Truck, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onBuyNow: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  isSavedInWishlist: boolean;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isSavedInWishlist
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Black');
  const [zoomStyle, setZoomStyle] = useState<{ backgroundPosition: string; display: string }>({
    backgroundPosition: '0% 0%',
    display: 'none'
  });

  const isLowStock = product.stock > 0 && product.stock <= 15;
  const isOutOfStock = product.stock <= 0;

  // Find 3 Related Products (same category or gender, excluding the current product)
  const relatedItems = products
    .filter((item) => item.id !== product.id && (item.category === product.category || item.gender === product.gender))
    .slice(0, 3);

  // Mouse move zoom calculations
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
      display: 'block'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ backgroundPosition: '0% 0%', display: 'none' });
  };

  return (
    <div id="product-detail-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-950 rounded-3xl w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-300 rounded-full flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Interactive Image Gallery & Zoom */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between border-r border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40">
          <div className="relative">
            {/* Main Interactive Zoom Canvas */}
            <div
              className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Zoom Panel */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  ...zoomStyle,
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: '200%',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
            </div>

            {/* Tiny Gallery Mock Indicator */}
            <div className="flex gap-2.5 mt-4">
              <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-[#FF6B00] shadow-sm cursor-pointer">
                <img src={product.image} alt="Thumbnail 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="w-16 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <img src={product.image} alt="Thumbnail 2" className="w-full h-full object-cover filter saturate-50" referrerPolicy="no-referrer" />
              </div>
              <div className="w-16 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <img src={product.image} alt="Thumbnail 3" className="w-full h-full object-cover filter hue-rotate-15" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>

          {/* Core Trust Indicators */}
          <div className="grid grid-cols-3 gap-2.5 mt-6 pt-6 border-t border-slate-150 dark:border-slate-850">
            <div className="text-center">
              <Truck className="w-5 h-5 mx-auto text-[#FF6B00] mb-1" />
              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Quick Delivery</p>
              <p className="text-[8px] text-slate-400">{product.delivery}</p>
            </div>
            <div className="text-center border-x border-slate-200 dark:border-slate-800">
              <RefreshCw className="w-5 h-5 mx-auto text-[#FF6B00] mb-1" />
              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">15-day Exchange</p>
              <p className="text-[8px] text-slate-400">Doorstep pickups</p>
            </div>
            <div className="text-center">
              <ShieldCheck className="w-5 h-5 mx-auto text-[#FF6B00] mb-1" />
              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">100% Original</p>
              <p className="text-[8px] text-slate-400">Certified seller</p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Product Specs & Purchase controls */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div>
            {/* Header / Brand info */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs font-sans font-black uppercase tracking-widest text-[#FF6B00]">
                {product.brand}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">•</span>
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white mb-2 leading-tight">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs rounded-lg">
                {product.rating} <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {product.reviews} Certified Customer Reviews
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-4 bg-orange-50/50 dark:bg-orange-950/10 p-4 rounded-2xl border border-orange-500/10">
              <span className="font-mono text-2xl font-black text-slate-900 dark:text-white">
                ₹{product.discountPrice}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="font-mono text-sm text-slate-400 line-through">
                    ₹{product.price}
                  </span>
                  <span className="text-sm font-black text-red-500 flex items-center gap-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    ({product.discount}% Off Holiday Special)
                  </span>
                </>
              )}
            </div>

            {/* Stock Alerts */}
            <div className="mb-5">
              {isOutOfStock ? (
                <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full animate-pulse">
                  Hurry! Only {product.stock} left in stock.
                </span>
              ) : (
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  Highly Available (In Stock)
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Technical grid */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl mb-6">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Fabric</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{product.fabric}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Fit Profile</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{product.fit}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Occasion</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{product.occasion}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Delivery Profile</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{product.delivery}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Select Size
                </span>
                <span className="text-xs text-[#FF6B00] font-bold cursor-pointer hover:underline">
                  Size Guide
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 rounded-xl text-xs font-black font-mono border-2 transition-all ${
                      selectedSize === size
                        ? 'bg-[#FF6B00] border-transparent text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#FF6B00]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2">
                Select Color: <span className="text-[#FF6B00]">{selectedColor}</span>
              </span>
              <div className="flex gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                      selectedColor === color
                        ? 'border-[#FF6B00] bg-orange-50 text-[#FF6B00] font-black'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons & Related */}
          <div>
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-center ${
                  isSavedInWishlist
                    ? 'bg-red-500 border-transparent text-white shadow-lg'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-red-500'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5.5 h-5.5 ${isSavedInWishlist ? 'fill-current' : ''}`} />
              </button>

              <button
                disabled={isOutOfStock}
                onClick={() => onAddToCart(product, selectedSize, selectedColor)}
                className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-900 hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] text-slate-700 dark:text-slate-200 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Shopping Bag
              </button>

              <button
                disabled={isOutOfStock}
                onClick={() => onBuyNow(product, selectedSize, selectedColor)}
                className="flex-1 py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20 animate-bounce-once"
              >
                <ShoppingBag className="w-5 h-5" />
                Proceed to Buy
              </button>
            </div>

            {/* Related items panel */}
            {relatedItems.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-900 pt-6">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">You May Also Like</h3>
                <div className="grid grid-cols-3 gap-3">
                  {relatedItems.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-transparent hover:border-orange-500/10 transition-all flex flex-col"
                      onClick={() => {
                        // Change active product in modal (re-initializes detail)
                        window.location.hash = `view-${item.id}`;
                        // We will set this up via state change in the App logic.
                      }}
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden mb-1.5 bg-slate-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block truncate">{item.brand}</span>
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate block leading-tight">{item.name}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-white mt-0.5">₹{item.discountPrice}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
