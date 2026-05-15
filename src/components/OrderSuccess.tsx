import React from 'react';
import { Order, PageView } from '../types';
import { CheckCircle2, Package, MapPin, Clock, ArrowRight, UtensilsCrossed } from 'lucide-react';

interface OrderSuccessProps {
  lastOrder: Order | null;
  setPageView: (page: PageView) => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({ lastOrder, setPageView }) => {
  if (!lastOrder) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <h2 className="text-2xl font-bold mb-4">No Recent Order</h2>
        <button
          onClick={() => setPageView('menu')}
          className="bg-rose-500 text-white font-bold px-6 py-3 rounded-xl cursor-pointer"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
      
      {/* Success Badge */}
      <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-emerald-500/25 animate-bounce">
        <CheckCircle2 className="w-14 h-14" />
      </div>

      <span className="bg-emerald-50 text-emerald-600 text-xs font-black uppercase px-3 py-1 rounded-full mb-2 inline-block">
        Order Confirmed! 🎉
      </span>

      <h1 className="text-4xl sm:text-5xl font-display font-black text-slate-900 tracking-tight mb-3">
        Your food is being <span className="italic animated-gradient-text">prepared</span>
      </h1>
      <p className="text-slate-500 max-w-md mx-auto mb-8 text-base">
        Our master chefs have started crafting your order. Sit back and relax while we get it ready for lightning-fast delivery!
      </p>

      {/* Order Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-lg text-left mb-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs text-slate-400 font-bold block">ORDER NUMBER</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{lastOrder.id}</span>
          </div>

          <div className="bg-amber-50 p-3 rounded-2xl flex items-center gap-2 text-amber-800">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-[10px] font-bold block text-amber-600 uppercase tracking-wider">Estimated Delivery</span>
              <span className="text-sm font-extrabold">{lastOrder.estimatedDelivery}</span>
            </div>
          </div>
        </div>

        {/* Address and items summary */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-rose-500" />
              <span>Order Summary</span>
            </h4>
            <div className="space-y-2">
              {lastOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm font-semibold text-slate-700">
                  <span>{item.quantity}x {item.foodItem.name}</span>
                  <span className="text-slate-900 font-bold">Rs.{item.priceAtPurchase * item.quantity}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Paid</span>
                <span className="text-rose-600">Rs.{lastOrder.totalPrice}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Delivering To</span>
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="font-bold text-slate-900 text-sm mb-1">{lastOrder.address.name}</div>
              <div className="text-xs text-slate-600 leading-relaxed">
                {lastOrder.address.area}, {lastOrder.address.city}, {lastOrder.address.district} - {lastOrder.address.zipcode}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => setPageView('order-tracking')}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:shadow-xl text-white font-black rounded-2xl shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>📍 Track Live Order</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => setPageView('orders')}
          className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View All Orders</span>
        </button>

        <button
          onClick={() => setPageView('menu')}
          className="w-full sm:w-auto px-8 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span>Order More</span>
        </button>
      </div>

    </div>
  );
};
