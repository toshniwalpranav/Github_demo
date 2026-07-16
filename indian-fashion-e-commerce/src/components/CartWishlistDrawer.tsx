/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Product } from '../types';
import { X, Trash2, Tag, ShoppingBag, Heart, ArrowRight, ShieldCheck, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface CartWishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  initialTab: 'cart' | 'wishlist';
  addToast: (text: string, type: 'success' | 'info' | 'warning') => void;
}

export default function CartWishlistDrawer({
  isOpen,
  onClose,
  cart,
  setCart,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  initialTab,
  addToast
}: CartWishlistDrawerProps) {
  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist'>(initialTab);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  
  // Checkout flow state
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'cod'
  });

  if (!isOpen) return null;

  // Quantity helpers
  const updateQuantity = (itemIndex: number, change: number) => {
    const updated = [...cart];
    const item = updated[itemIndex];
    if (!item) return;

    const newQty = item.quantity + change;
    if (newQty <= 0) {
      updated.splice(itemIndex, 1);
      addToast(`${item.product.name} removed from Shopping Bag`, 'info');
    } else {
      item.quantity = newQty;
    }
    setCart(updated);
  };

  const removeItem = (itemIndex: number) => {
    const updated = [...cart];
    const removedItem = updated[itemIndex];
    updated.splice(itemIndex, 1);
    setCart(updated);
    if (removedItem) {
      addToast(`${removedItem.product.name} removed from Shopping Bag`, 'info');
    }
  };

  // Pricing math
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.discountPrice * item.quantity), 0);
  
  // Coupon logic
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', percent: 10 });
      addToast('Promo WELCOME10 Applied: Saved 10% Extra!', 'success');
      setCouponCode('');
    } else {
      addToast('Invalid or Expired Coupon Code', 'warning');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon code removed', 'info');
  };

  const couponDiscount = appliedCoupon ? Math.round(cartSubtotal * (appliedCoupon.percent / 100)) : 0;
  
  // Delivery Fee logic: Free above 1499, else flat 99
  const isFreeDelivery = cartSubtotal >= 1499;
  const deliveryFee = cartSubtotal > 0 && !isFreeDelivery ? 99 : 0;
  
  // 5% GST (Indian Apparel standard)
  const gst = Math.round((cartSubtotal - couponDiscount) * 0.05);
  
  // Grand Total to pay
  const grandTotal = cartSubtotal - couponDiscount + deliveryFee + gst;

  // Checkout submit handler
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.postalCode || !shippingAddress.phone) {
      addToast('Please fill all mandatory shipping details', 'warning');
      return;
    }
    // Success simulation
    setOrderPlaced(true);
    setCart([]);
    setAppliedCoupon(null);
    addToast('Order placed successfully!', 'success');
  };

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      {/* Drawer Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="w-full max-w-md bg-white dark:bg-slate-950 h-full shadow-2xl flex flex-col relative"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab('cart');
                setIsCheckingOut(false);
                setOrderPlaced(false);
              }}
              className={`font-display font-extrabold text-base pb-1 relative ${
                activeTab === 'cart'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Shopping Bag ({cart.length})
              {activeTab === 'cart' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF6B00] rounded-full"></span>}
            </button>

            <button
              onClick={() => {
                setActiveTab('wishlist');
                setIsCheckingOut(false);
                setOrderPlaced(false);
              }}
              className={`font-display font-extrabold text-base pb-1 relative flex items-center gap-1 ${
                activeTab === 'wishlist'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Saved Wishlist ({wishlist.length})
              {activeTab === 'wishlist' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF6B00] rounded-full"></span>}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {orderPlaced ? (
            /* ==================== MOCK SUCCESS SCREEN ==================== */
            <div id="order-success-screen" className="text-center py-12 flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-md shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                Order Confirmed
              </span>
              <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white">Jai Hind! Your Order is Placed</h2>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mb-6">
                Your luxury apparel will be handpacked and dispatched immediately. Estimate delivery: <strong>3-5 Days</strong> to Mumbai.
              </p>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl w-full border border-slate-150 text-left mb-6">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Receipt Details</span>
                <p className="text-xs text-slate-700 dark:text-slate-300"><strong>Order Number:</strong> #FI-9023{Math.floor(Math.random() * 900) + 100}</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1"><strong>Ship to:</strong> {shippingAddress.fullName}</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5"><strong>Payment Method:</strong> {shippingAddress.paymentMethod.toUpperCase()}</p>
              </div>
              <button
                onClick={() => {
                  setOrderPlaced(false);
                  setIsCheckingOut(false);
                  onClose();
                }}
                className="w-full py-3.5 bg-[#FF6B00] text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/20"
              >
                Continue Shopping
              </button>
            </div>
          ) : isCheckingOut ? (
            /* ==================== MOCK CHECKOUT FLOW ==================== */
            <form id="checkout-form-container" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="flex items-center gap-1.5 mb-4 text-[#FF6B00]">
                <MapPin className="w-5 h-5" />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Shipping Address</h3>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pranav Sharma"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Detailed Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Flat No, Building, Street Name..."
                  value={shippingAddress.addressLine}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Postal PIN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 400001"
                    maxLength={6}
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10 digit mobile number"
                  maxLength={10}
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`border-2 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer text-center transition-all ${
                    shippingAddress.paymentMethod === 'cod' ? 'border-[#FF6B00] bg-orange-50/50' : 'border-slate-100 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={shippingAddress.paymentMethod === 'cod'}
                      onChange={() => setShippingAddress({ ...shippingAddress, paymentMethod: 'cod' })}
                      className="hidden"
                    />
                    <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Cash On Delivery</span>
                    <span className="text-[9px] text-slate-400">Pay at door</span>
                  </label>

                  <label className={`border-2 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer text-center transition-all ${
                    shippingAddress.paymentMethod === 'upi' ? 'border-[#FF6B00] bg-orange-50/50' : 'border-slate-100 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={shippingAddress.paymentMethod === 'upi'}
                      onChange={() => setShippingAddress({ ...shippingAddress, paymentMethod: 'upi' })}
                      className="hidden"
                    />
                    <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">UPI / QR Code</span>
                    <span className="text-[9px] text-slate-400">Instant digital</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-slate-500">Amount Payable (Incl GST)</span>
                  <span className="font-mono font-extrabold text-base text-slate-900 dark:text-white">₹{grandTotal}</span>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-extrabold text-sm rounded-2xl shadow-lg"
                >
                  Place Confirmed Order
                </button>
              </div>
            </form>
          ) : activeTab === 'cart' ? (
            /* ==================== SHOPPING CART TAB ==================== */
            cart.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/20 text-[#FF6B00] rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">Your Bag is Empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mb-6">Explore the premium clothing collection and add items to your shopping bag.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-[#FF6B00] text-white font-bold text-xs rounded-full"
                >
                  Browse Store
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 relative group"
                  >
                    {/* Item Image */}
                    <div className="w-20 aspect-[3/4] bg-slate-200 rounded-xl overflow-hidden shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">{item.product.brand}</span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{item.product.name}</h4>
                        
                        {/* Selected Specs */}
                        <div className="flex gap-2 mt-1">
                          <span className="text-[9px] font-mono font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500">
                            Size: {item.selectedSize}
                          </span>
                          <span className="text-[9px] font-sans font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500">
                            Color: {item.selectedColor}
                          </span>
                        </div>
                      </div>

                      {/* Pricing + Quantity Controls */}
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                          ₹{item.product.discountPrice * item.quantity}
                        </span>

                        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-850">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(index)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* ==================== WISHLIST TAB ==================== */
            wishlist.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/20 text-[#FF6B00] rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">Wishlist is Empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mb-6">Keep tabs on designs you admire. Tap the heart badge on cards to save.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-[#FF6B00] text-white font-bold text-xs rounded-full"
                >
                  Discover Designs
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 relative group"
                  >
                    <div className="w-16 aspect-[3/4] bg-slate-200 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">{item.brand}</span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{item.name}</h4>
                        <p className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-1">₹{item.discountPrice}</p>
                      </div>

                      {/* Move to bag button */}
                      <button
                        onClick={() => {
                          onAddToCart(item, item.sizes[0] || 'M', item.colors[0] || 'Black');
                          onRemoveFromWishlist(item);
                        }}
                        className="text-[10px] font-bold text-white bg-[#FF6B00] px-3 py-1.5 rounded-xl hover:bg-[#E05E00] w-max"
                      >
                        Move to Bag
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveFromWishlist(item)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* ==================== BILLING FOOTER FRAME (Shopping Bag only) ==================== */}
        {activeTab === 'cart' && cart.length > 0 && !isCheckingOut && !orderPlaced && (
          <div id="cart-summary-footer" className="p-5 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950">
            {/* Coupon Application Box */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Promo Code: WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF6B00]"
                />
                <Tag className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-slate-900 hover:bg-[#FF6B00] dark:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
              >
                Apply
              </button>
            </div>

            {/* Applied Coupon Tag */}
            {appliedCoupon && (
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800 rounded-xl mb-4 text-xs">
                <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-bold">
                  <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0" />
                  Promo Applied: Extra 10% Off
                </span>
                <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-slate-600 font-extrabold text-sm ml-2">
                  ✕
                </button>
              </div>
            )}

            {/* Cost Breakdown */}
            <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-850 pb-4 mb-4 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">₹{cartSubtotal}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Savings ({appliedCoupon.code})</span>
                  <span className="font-mono font-medium">-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">₹{gst}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}
                </span>
              </div>
              {!isFreeDelivery && (
                <p className="text-[10px] text-slate-400 text-right font-light">
                  Add <strong>₹{1499 - cartSubtotal}</strong> more to unlock FREE shipping!
                </p>
              )}
            </div>

            {/* Total to pay */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Grand Order Total</span>
              <span className="font-mono font-black text-lg text-slate-900 dark:text-white">₹{grandTotal}</span>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/15"
            >
              <span>Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SSL Encryption • Safe & Secure Indian Payments</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
