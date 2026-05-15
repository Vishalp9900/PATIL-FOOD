import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { Search, Eye, MapPin, Phone, Bike, X, Clock, CheckCircle2, Package, ChefHat } from 'lucide-react';
import { handleImageError } from '../../utils/foodImage';

interface AdminOrdersProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const STATUS_OPTIONS: OrderStatus[] = ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const statusColor = (status: OrderStatus) => {
  switch (status) {
    case 'Delivered': return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
    case 'Cancelled': return 'bg-slate-100 text-slate-500 ring-slate-200';
    case 'Out for Delivery': return 'bg-blue-100 text-blue-700 ring-blue-200';
    case 'Preparing': return 'bg-amber-100 text-amber-700 ring-amber-200';
    default: return 'bg-rose-100 text-rose-700 ring-rose-200';
  }
};

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, updateOrderStatus, showToast }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const filtered = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.userName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order ${orderId} updated to ${newStatus}`, 'success');
    if (viewOrder?.id === orderId) {
      setViewOrder({ ...viewOrder, status: newStatus });
    }
  };

  const stats = {
    total: orders.length,
    placed: orders.filter(o => o.status === 'Order Placed').length,
    preparing: orders.filter(o => o.status === 'Preparing').length,
    delivery: orders.filter(o => o.status === 'Out for Delivery').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  return (
    <div className="p-6 sm:p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Orders Management</h1>
        <p className="text-slate-500 text-sm mt-1">View, track and update order statuses</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'text-slate-700', icon: Package },
          { label: 'New', value: stats.placed, color: 'text-rose-700', icon: Clock },
          { label: 'Preparing', value: stats.preparing, color: 'text-amber-700', icon: ChefHat },
          { label: 'Delivery', value: stats.delivery, color: 'text-blue-700', icon: Bike },
          { label: 'Delivered', value: stats.delivered, color: 'text-emerald-700', icon: CheckCircle2 },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-4 ring-1 ring-slate-100">
              <Icon className={`w-5 h-5 ${s.color} mb-2`} />
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 ring-1 ring-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as OrderStatus | 'all')}
          className="px-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-3xl ring-1 ring-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500 text-sm font-semibold">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-black text-sm text-slate-900">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm text-slate-900">{order.userName}</div>
                      <div className="text-[11px] text-slate-500 font-semibold">{order.address.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{order.items.length} items</td>
                    <td className="px-6 py-4 font-black text-slate-900">₹{order.totalPrice}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black ring-1 cursor-pointer focus:outline-none ${statusColor(order.status)}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-semibold">{order.createdAt.split(' ')[1]}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setViewOrder(order)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h3 className="text-xl font-black text-slate-900">Order Details</h3>
                <span className="text-xs font-mono font-bold text-slate-500">{viewOrder.id}</span>
              </div>
              <button onClick={() => setViewOrder(null)} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Customer</div>
                  <div className="font-black text-slate-900">{viewOrder.userName}</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Total Amount</div>
                  <div className="font-black text-rose-600 text-xl">₹{viewOrder.totalPrice}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Items Ordered</h4>
                <div className="space-y-2">
                  {viewOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                      <img
                        src={item.foodItem.image}
                        alt={item.foodItem.name}
                        onError={handleImageError(item.foodItem.name, item.foodItem.category, item.foodItem.id)}
                        className="w-12 h-12 rounded-lg object-cover bg-gradient-to-br from-rose-100 to-orange-100"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-900">{item.foodItem.name}</div>
                        <div className="text-xs text-slate-500 font-semibold">₹{item.priceAtPurchase} × {item.quantity}</div>
                      </div>
                      <div className="font-black text-sm text-slate-900">₹{item.priceAtPurchase * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-rose-50 rounded-2xl p-4 ring-1 ring-rose-100">
                <div className="flex items-center gap-2 text-xs font-black text-rose-600 mb-2 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Delivery Address</span>
                </div>
                <div className="font-black text-sm text-slate-900">{viewOrder.address.name}</div>
                <div className="text-xs text-slate-600 font-bold flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> {viewOrder.address.phone}
                </div>
                <p className="text-sm text-slate-700 mt-2">
                  {viewOrder.address.area}, {viewOrder.address.city}, {viewOrder.address.district} - {viewOrder.address.zipcode}
                </p>
                {viewOrder.address.landmark && (
                  <p className="text-xs text-rose-600 font-medium mt-1">Landmark: {viewOrder.address.landmark}</p>
                )}
              </div>

              {viewOrder.deliveryPartner && (
                <div className="bg-slate-900 text-white rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-400 mb-3 uppercase tracking-wider">
                    <Bike className="w-3.5 h-3.5" />
                    <span>Delivery Partner</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={viewOrder.deliveryPartner.photo}
                      alt={viewOrder.deliveryPartner.name}
                      onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(viewOrder.deliveryPartner!.name)}`; }}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400 bg-slate-800"
                    />
                    <div className="flex-1">
                      <div className="font-black text-sm">{viewOrder.deliveryPartner.name}</div>
                      <div className="text-xs text-slate-400 font-bold">{viewOrder.deliveryPartner.phone}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-black text-amber-400">{viewOrder.deliveryPartner.vehicleNumber}</div>
                      <div className="text-[10px] text-slate-400 font-bold">{viewOrder.deliveryPartner.vehicleType}</div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Update Status</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(viewOrder.id, s)}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        viewOrder.status === s 
                          ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
