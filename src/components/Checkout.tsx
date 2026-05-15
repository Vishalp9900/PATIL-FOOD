import React, { useState } from 'react';
import { Address, CartItem, Order, PageView, User, DeliveryPartner } from '../types';
import { MapPin, CreditCard, Banknote, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { handleImageError } from '../utils/foodImage';

interface CheckoutProps {
  cartItems: CartItem[];
  selectedAddress: Address | undefined;
  placeOrder: (paymentMethod: 'cod' | 'online', newOrder: Order) => void;
  setPageView: (page: PageView) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  currentUser: User;
  deliveryPartners: DeliveryPartner[];
}

export const Checkout: React.FC<CheckoutProps> = ({
  cartItems,
  selectedAddress,
  placeOrder,
  setPageView,
  showToast,
  currentUser,
  deliveryPartners,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<string>('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.foodItem.price * item.quantity), 0);
  const isFreeDelivery = subtotal >= 500;
  const deliveryFee = isFreeDelivery ? 0 : 45;
  const packagingAndTaxes = 35;
  const finalTotal = subtotal + deliveryFee + packagingAndTaxes;

  if (!selectedAddress || cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">No Delivery Details Found</h2>
        <button
          onClick={() => setPageView('cart')}
          className="px-6 py-3 bg-rose-500 text-white font-bold rounded-xl cursor-pointer"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  const handleOrderSubmission = (method: 'cod' | 'online') => {
    const orderId = `PF-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const randomPartner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];

    const newOrder: Order = {
      id: orderId,
      userId: currentUser.id,
      userName: currentUser.name,
      items: cartItems.map(item => ({
        foodItem: item.foodItem,
        quantity: item.quantity,
        priceAtPurchase: item.foodItem.price
      })),
      totalPrice: finalTotal,
      address: selectedAddress,
      paymentMethod: method,
      status: 'Order Placed',
      createdAt: now,
      estimatedDelivery: '25-35 mins',
      deliveryPartner: randomPartner,
      statusTimeline: [
        { status: 'Order Placed', time: now },
      ],
    };

    if (method === 'online') {
      setIsProcessing(true);
      setPaymentStep('Connecting to Secure Payment Gateway...');
      setTimeout(() => {
        setPaymentStep('Authenticating Stripe 3D Secure...');
        setTimeout(() => {
          setPaymentStep('Payment Successful! Generating Order...');
          setTimeout(() => {
            setIsProcessing(false);
            placeOrder('online', newOrder);
            showToast('Order placed successfully with Online Payment!', 'success');
          }, 1200);
        }, 1500);
      }, 1500);
    } else {
      placeOrder('cod', newOrder);
      showToast('Order placed successfully with Cash on Delivery!', 'success');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setPageView('address')}
          disabled={isProcessing}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">Confirm <span className="italic animated-gradient-text">Order</span></h1>
          <p className="text-slate-500 text-sm mt-0.5">Select your preferred payment method to complete the order</p>
        </div>
      </div>

      {/* Simulated Processing Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100">
            <Loader2 className="w-16 h-16 text-rose-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Processing Payment</h3>
            <p className="text-sm font-medium text-slate-500 animate-pulse">{paymentStep}</p>
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Order Details & Address Summary */}
        <div className="md:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="font-extrabold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span>Delivery Address</span>
            </h3>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="font-extrabold text-slate-900 text-base mb-1">
                {selectedAddress.name} <span className="text-xs font-semibold text-slate-500 font-mono">({selectedAddress.phone})</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {selectedAddress.area}, {selectedAddress.city}, {selectedAddress.district} - {selectedAddress.zipcode}
              </p>
              {selectedAddress.landmark && (
                <p className="text-xs text-rose-600 font-medium mt-1">
                  Landmark: {selectedAddress.landmark}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="font-extrabold text-lg text-slate-900 mb-4">Items to Deliver</h3>

            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.foodItem.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.foodItem.image}
                      alt={item.foodItem.name}
                      onError={handleImageError(item.foodItem.name, item.foodItem.category, item.foodItem.id)}
                      className="w-12 h-12 rounded-xl object-cover bg-gradient-to-br from-rose-100 to-orange-100"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.foodItem.name}</h4>
                      <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 text-sm">Rs.{item.foodItem.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-base font-extrabold text-slate-900">
              <span>Total Payable</span>
              <span className="text-rose-600 text-xl">Rs.{finalTotal}</span>
            </div>
          </div>

        </div>

        {/* Payment Methods Selection */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md sticky top-28">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 pb-4 border-b border-slate-100">
              Choose Payment Method
            </h3>

            <div className="space-y-4 mb-8">
              
              {/* Online Payment */}
              <div 
                onClick={() => handleOrderSubmission('online')}
                className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl hover:bg-slate-800 transition-all cursor-pointer flex items-start gap-4 group"
              >
                <div className="p-3 bg-white/10 rounded-xl text-white group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-extrabold text-lg">Online Payment</h4>
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">RECOMMENDED</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Pay securely instantly via Debit/Credit Card, UPI, or Netbanking. Powered by Stripe.
                  </p>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div 
                onClick={() => handleOrderSubmission('cod')}
                className="bg-white hover:bg-slate-50 text-slate-900 rounded-2xl p-6 border-2 border-slate-200 hover:border-slate-300 transition-all cursor-pointer flex items-start gap-4"
              >
                <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
                  <Banknote className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg mb-1">Cash on Delivery</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Pay with cash upon doorstep delivery. Please keep exact change ready.
                  </p>
                </div>
              </div>

            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-600" />
              <span>Dhee Quick Bites guarantees 100% fresh preparation and hygienic packaging.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
