import React, { useEffect, useState } from 'react';
import { Order, PageView } from '../types';
import { History, Clock, MapPin, Trash2, RotateCw, CheckCircle2, ArrowLeft } from 'lucide-react';
import { handleImageError } from '../utils/foodImage';

interface OrdersProps {
  orders: Order[];
  deleteOrder: (orderId: string) => void;
  reorderItems: (items: { foodItem: any; quantity: number }[]) => void;
  setPageView: (page: PageView) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  setActiveTrackingOrder: (orderId: string) => void;
}

export const Orders: React.FC<OrdersProps> = ({
  orders,
  deleteOrder,
  reorderItems,
  setPageView,
  showToast,
  setActiveTrackingOrder,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-4 animate-pulse">
        <div className="h-28 rounded-[2rem] bg-slate-200" />
        <div className="h-44 rounded-3xl bg-slate-200" />
        <div className="h-44 rounded-3xl bg-slate-200" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
          <History className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">No Order History Found</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-base leading-relaxed">
          Looks like you haven't placed any orders yet. Check out our signature dishes and place your first order today!
        </p>
        <button
          onClick={() => setPageView('menu')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 text-white font-extrabold rounded-2xl shadow-lg shadow-rose-500/25 hover:bg-rose-600 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Explore Menu</span>
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">My <span className="italic animated-gradient-text">Orders</span></h1>
          <p className="text-slate-500 text-sm mt-1">Review your past orders and reorder your favorites in one click</p>
        </div>
        <button
          onClick={() => setPageView('menu')}
          className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>
      </div>

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-black text-xl text-slate-900">{order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200 animate-pulse'
                  }`}>
                    {order.status === 'Delivered' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{order.status}</span>
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-4">
                  <span>Placed: {order.createdAt}</span>
                  <span className="capitalize">Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Stripe'}</span>
                </div>
              </div>

              <div className="text-right flex items-center sm:block justify-between w-full sm:w-auto">
                <span className="text-xs text-slate-400 block font-medium">Total Amount</span>
                <span className="text-2xl font-black text-rose-600">Rs.{order.totalPrice}</span>
              </div>
            </div>

            {/* Items breakdown */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <img
                        src={item.foodItem.image}
                        alt={item.foodItem.name}
                        onError={handleImageError(item.foodItem.name, item.foodItem.category, item.foodItem.id)}
                        className="w-12 h-12 rounded-xl object-cover bg-gradient-to-br from-rose-100 to-orange-100"
                      />
                      <div className="flex-1">
                        <div className="font-extrabold text-slate-900 text-sm leading-snug">{item.foodItem.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Rs.{item.priceAtPurchase} &times; {item.quantity} = <strong className="text-rose-600">Rs.{item.priceAtPurchase * item.quantity}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delivered To</span>
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="font-bold text-slate-900 text-sm mb-1">{order.address.name}</div>
                  <div className="text-xs text-slate-600 leading-relaxed mb-2">
                    {order.address.area}, {order.address.city}, {order.address.district} - {order.address.zipcode}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Phone: {order.address.phone}</div>
                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <button
                onClick={() => setDeleteConfirmId(order.id)}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>

              <div className="flex items-center gap-2">
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      setActiveTrackingOrder(order.id);
                      setPageView('order-tracking');
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-md shadow-rose-500/25 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span>Track Live</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    reorderItems(order.items);
                    showToast('Items added to cart! Proceeding to cart...', 'success');
                    setPageView('cart');
                  }}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer shadow-md"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Reorder</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Custom Popup Modal for Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-100 scale-in">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Delete Order History?</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Are you sure you want to remove order <strong className="text-slate-800 font-mono">{deleteConfirmId}</strong> from your records? This cannot be undone.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteOrder(deleteConfirmId);
                  setDeleteConfirmId(null);
                  showToast('Order history deleted successfully', 'success');
                }}
                className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
