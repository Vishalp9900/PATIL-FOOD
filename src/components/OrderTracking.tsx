import React, { useEffect, useState } from 'react';
import { Order, PageView, OrderStatus } from '../types';
import { CheckCircle2, Clock, Package, Bike, MapPin, Phone, Star, ArrowLeft, Navigation, ChefHat } from 'lucide-react';

interface OrderTrackingProps {
  order: Order | null;
  setPageView: (page: PageView) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; icon: any; description: string }[] = [
  { status: 'Order Placed', label: 'Order Placed', icon: CheckCircle2, description: 'Your order has been confirmed' },
  { status: 'Preparing', label: 'Preparing', icon: ChefHat, description: 'Chef is crafting your meal' },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: Bike, description: 'Rider is on the way' },
  { status: 'Delivered', label: 'Delivered', icon: Package, description: 'Enjoy your meal!' },
];

export const OrderTracking: React.FC<OrderTrackingProps> = ({ order, setPageView, updateOrderStatus }) => {
  const [progressPct, setProgressPct] = useState(0);

  // Simulate live order status progression
  useEffect(() => {
    if (!order) return;
    if (order.status === 'Delivered' || order.status === 'Cancelled') return;

    const statusOrder: OrderStatus[] = ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentIdx = statusOrder.indexOf(order.status);
    if (currentIdx < statusOrder.length - 1) {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, statusOrder[currentIdx + 1]);
      }, 8000); // advance every 8 seconds
      return () => clearTimeout(timer);
    }
  }, [order, updateOrderStatus]);

  // Animate progress bar
  useEffect(() => {
    if (!order) return;
    const stepIdx = STATUS_STEPS.findIndex(s => s.status === order.status);
    setProgressPct((stepIdx / (STATUS_STEPS.length - 1)) * 100);
  }, [order]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <h2 className="text-2xl font-bold mb-4">No active order to track</h2>
        <button
          onClick={() => setPageView('orders')}
          className="bg-rose-500 text-white font-bold px-6 py-3 rounded-xl cursor-pointer"
        >
          View All Orders
        </button>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.findIndex(s => s.status === order.status);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setPageView('orders')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">Track <span className="italic animated-gradient-text">Order</span></h1>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-full ring-1 ring-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-slate-500 text-sm">Order ID: <span className="font-mono font-bold text-slate-700">{order.id}</span></p>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 mb-8 text-white shadow-xl ${
        order.status === 'Delivered'
          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20'
          : 'bg-gradient-to-r from-rose-500 to-orange-500 shadow-rose-500/20'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Current Status</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-2">{order.status}</h2>
            <p className="text-sm opacity-90 font-medium">
              {STATUS_STEPS.find(s => s.status === order.status)?.description || order.estimatedDelivery}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Estimated Time</div>
            <div className="text-2xl font-black">{order.estimatedDelivery}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Timeline */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 ring-1 ring-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6">Order Progress</h3>

          {/* Progress bar (visual) */}
          <div className="relative h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Status steps */}
          <div className="space-y-5">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx && order.status !== 'Delivered';
              const Icon = step.icon;
              const timelineEntry = order.statusTimeline.find(t => t.status === step.status);

              return (
                <div key={step.status} className="flex gap-4 items-start">
                  <div className={`relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ring-4 ring-white shadow-md ${
                    isCompleted
                      ? 'bg-gradient-to-br from-rose-500 to-orange-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-2xl ring-4 ring-rose-300 animate-ping" />
                    )}
                  </div>

                  <div className="flex-1 pt-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className={`font-black text-base ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                      </div>
                      {timelineEntry && (
                        <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                          {timelineEntry.time.split(' ')[1]}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-0.5 ${isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                      {step.description}
                    </p>
                    {isCurrent && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full ring-1 ring-rose-200">
                        <Clock className="w-3 h-3 animate-pulse" />
                        <span>In progress...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar — Delivery Partner & Address */}
        <div className="space-y-6">

          {/* Delivery Partner Card */}
          {order.deliveryPartner && (order.status === 'Out for Delivery' || order.status === 'Delivered' || order.status === 'Preparing') && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl ring-1 ring-slate-700">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 mb-4">
                <Bike className="w-4 h-4" />
                <span>Your Delivery Partner</span>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <img
                  src={order.deliveryPartner.photo}
                  alt={order.deliveryPartner.name}
                  onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(order.deliveryPartner!.name)}`; }}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-lg bg-slate-800"
                />
                <div>
                  <div className="font-black text-lg leading-tight">{order.deliveryPartner.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-md text-xs font-black">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{order.deliveryPartner.rating}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold">
                      {order.deliveryPartner.totalDeliveries}+ deliveries
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 mb-4 ring-1 ring-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Vehicle Details</div>
                <div className="font-mono font-black text-base text-amber-400">{order.deliveryPartner.vehicleNumber}</div>
                <div className="text-xs text-slate-300 font-semibold mt-0.5">{order.deliveryPartner.vehicleType}</div>
              </div>

              <a
                href={`tel:${order.deliveryPartner.phone}`}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call {order.deliveryPartner.phone}</span>
              </a>
            </div>
          )}

          {/* Delivery Address */}
          <div className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-500 mb-3">
              <MapPin className="w-4 h-4" />
              <span>Delivery Address</span>
            </div>
            <div className="font-black text-slate-900">{order.address.name}</div>
            <div className="text-xs text-slate-500 font-bold mb-2">{order.address.phone}</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {order.address.area}, {order.address.city}, {order.address.district} - {order.address.zipcode}
            </p>
            {order.address.landmark && (
              <p className="text-xs text-rose-600 font-medium mt-1">
                Landmark: {order.address.landmark}
              </p>
            )}
            {order.address.latitude && order.address.longitude && (
              <button className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors">
                <Navigation className="w-3.5 h-3.5" />
                <span>View on Map</span>
              </button>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-500 mb-3">
              <Package className="w-4 h-4" />
              <span>Order Summary</span>
            </div>
            <div className="space-y-2 mb-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm font-semibold text-slate-700">
                  <span>{item.quantity}× {item.foodItem.name}</span>
                  <span>₹{item.priceAtPurchase * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-black">
              <span>Total Paid</span>
              <span className="text-rose-600">₹{order.totalPrice}</span>
            </div>
            <div className="text-xs text-slate-400 font-bold mt-2 text-right capitalize">
              via {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
