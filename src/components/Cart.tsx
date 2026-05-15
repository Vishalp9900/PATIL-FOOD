import React, { useState } from 'react';
import { CartItem, PageView } from '../types';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Ticket, ArrowLeft, AlertCircle } from 'lucide-react';
import { handleImageError } from '../utils/foodImage';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (foodItemId: number, delta: number) => void;
  removeItem: (foodItemId: number) => void;
  setPageView: (page: PageView) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const Cart: React.FC<CartProps> = ({ 
  cartItems, 
  updateQuantity, 
  removeItem, 
  setPageView,
  showToast 
}) => {
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<boolean>(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.foodItem.price * item.quantity), 0);
  const isFreeDelivery = subtotal >= 500;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 45;
  const packagingAndTaxes = subtotal === 0 ? 0 : 35;
  const finalTotal = Math.max(0, subtotal + deliveryFee + packagingAndTaxes - discount);

  const applyPromoCode = () => {
    if (!promoCode.trim()) return;
    if (promoApplied) {
      showToast('Promo code already applied!', 'info');
      return;
    }
    const code = promoCode.trim().toUpperCase();
    if (code === 'DHEE50') {
      setDiscount(50);
      setPromoApplied(true);
      showToast('Rs. 50 promo discount applied!', 'success');
    } else if (code === 'FRESH100') {
      if (subtotal >= 600) {
        setDiscount(100);
        setPromoApplied(true);
        showToast('Rs. 100 super discount applied!', 'success');
      } else {
        showToast('Add items worth Rs. 600 or more for FRESH100', 'error');
      }
    } else {
      showToast('Invalid promo code. Try DHEE50', 'error');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-display font-black text-slate-900 mb-3">Your cart is feeling <span className="italic">empty</span></h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-base leading-relaxed">
          Looks like you haven't added any premium dishes yet. Explore our chef's special menu and start satisfying your cravings!
        </p>
        <button
          onClick={() => setPageView('menu')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 text-white font-extrabold rounded-2xl shadow-lg shadow-rose-500/25 hover:bg-rose-600 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Explore Delicious Menu</span>
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">Review Your <span className="italic animated-gradient-text">Order</span></h1>
          <p className="text-slate-500 text-sm mt-1">Check your items and apply promo codes before choosing delivery</p>
        </div>
        <button
          onClick={() => setPageView('menu')}
          className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Add More Food</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {cartItems.map(item => (
            <div 
              key={item.foodItem.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.foodItem.image}
                  alt={item.foodItem.name}
                  onError={handleImageError(item.foodItem.name, item.foodItem.category, item.foodItem.id)}
                  className="w-20 h-20 object-cover rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 shrink-0 border border-slate-50"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                    {item.foodItem.name}
                  </h3>
                  <div className="text-slate-500 text-sm mt-0.5">
                    Rs.{item.foodItem.price} &times; {item.quantity} = <strong className="text-rose-600 font-extrabold">Rs.{item.foodItem.price * item.quantity}</strong>
                  </div>
                  <span className="text-xs text-slate-400 block mt-1">
                    Prep: {item.foodItem.prepTime}
                  </span>
                </div>
              </div>

              {/* Quantity Adjusters */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => updateQuantity(item.foodItem.id, -1)}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:bg-rose-50 hover:text-rose-600 font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-extrabold text-slate-900 text-base">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.foodItem.id, 1)}
                    className="w-8 h-8 bg-rose-500 text-white rounded-lg flex items-center justify-center font-bold shadow-xs hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.foodItem.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove Item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary & Pricing Breakdown */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md sticky top-28">
            
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 pb-4 border-b border-slate-100">
              Payment Summary
            </h3>

            {/* Promo code entry */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                Have a coupon?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter code (e.g. DHEE50)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
                <button
                  onClick={applyPromoCode}
                  disabled={promoApplied || !promoCode.trim()}
                  className="px-5 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {!promoApplied && (
                <span className="text-xs text-rose-500 mt-2 block font-medium">
                  💡 Tip: Use <strong className="font-bold">DHEE50</strong> for Rs.50 off!
                </span>
              )}
            </div>

            <div className="space-y-3.5 text-sm text-slate-600 mb-6 pb-6 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">Rs.{subtotal}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span>Delivery Fee</span>
                  {isFreeDelivery && (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                      FREE
                    </span>
                  )}
                </div>
                <span className="font-bold text-slate-900">
                  {isFreeDelivery ? <span className="line-through text-slate-400 font-normal">Rs.45</span> : `Rs.${deliveryFee}`}
                </span>
              </div>

              {!isFreeDelivery && (
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Add Rs.{500 - subtotal} more for <strong className="text-emerald-600 font-bold">FREE Delivery!</strong></span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Taxes & Restaurant Packing</span>
                <span className="font-bold text-slate-900">Rs.{packagingAndTaxes}</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between items-center text-emerald-600 font-extrabold bg-emerald-50 p-2 rounded-xl">
                  <span>Promo Discount</span>
                  <span>- Rs.{discount}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="text-base font-extrabold text-slate-900 block">Total Amount</span>
                <span className="text-xs text-slate-400">Including GST</span>
              </div>
              <span className="text-3xl font-black text-rose-600">Rs.{finalTotal}</span>
            </div>

            <button
              onClick={() => setPageView('address')}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-4 px-6 rounded-2xl text-center flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all cursor-pointer group"
            >
              <span>Proceed to Select Address</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
