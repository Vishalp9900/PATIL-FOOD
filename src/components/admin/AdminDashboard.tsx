import React from 'react';
import { Order, FoodItem, User } from '../../types';
import { TrendingUp, ShoppingBag, Users, UtensilsCrossed, IndianRupee, Star, Clock, ChefHat } from 'lucide-react';
import { handleImageError } from '../../utils/foodImage';

interface AdminDashboardProps {
  orders: Order[];
  foodItems: FoodItem[];
  users: User[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, foodItems, users }) => {
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const customerCount = users.filter(u => u.role === 'customer').length;
  const avgRating = foodItems.length > 0 
    ? (foodItems.reduce((acc, f) => acc + f.rating, 0) / foodItems.length).toFixed(1)
    : '0';
  
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const recentOrders = [...orders].slice(0, 5);

  // Top selling items based on order frequency
  const itemSales: Record<string, { item: FoodItem; sold: number; revenue: number }> = {};
  orders.forEach(order => {
    order.items.forEach(oi => {
      if (!itemSales[oi.foodItem.id]) {
        itemSales[oi.foodItem.id] = { item: oi.foodItem, sold: 0, revenue: 0 };
      }
      itemSales[oi.foodItem.id].sold += oi.quantity;
      itemSales[oi.foodItem.id].revenue += oi.priceAtPurchase * oi.quantity;
    });
  });
  const topItems = Object.values(itemSales).sort((a, b) => b.sold - a.sold).slice(0, 5);

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, gradient: 'from-emerald-500 to-teal-600', sub: 'All-time earnings' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, gradient: 'from-rose-500 to-orange-500', sub: `${activeOrders} active now` },
    { label: 'Total Customers', value: customerCount, icon: Users, gradient: 'from-blue-500 to-indigo-600', sub: 'Registered users' },
    { label: 'Menu Items', value: foodItems.length, icon: UtensilsCrossed, gradient: 'from-purple-500 to-pink-600', sub: `${avgRating}★ avg rating` },
  ];

  return (
    <div className="p-6 sm:p-8">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">Admin <span className="italic animated-gradient-text">Dashboard</span></h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening at <strong className="font-display font-black text-slate-700">Patil Foods</strong> today.</p>
        </div>
        <div className="text-right text-xs text-slate-500 font-bold">
          Last updated: <span className="text-slate-900">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl ring-1 ring-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-500" />
              Recent Orders
            </h3>
            <span className="text-xs font-bold text-slate-500">Last 5 orders</span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No orders yet</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map(order => (
                <div key={order.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'Cancelled' ? 'bg-slate-100 text-slate-500' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-sm">{order.id}</div>
                      <div className="text-xs text-slate-500 font-semibold">{order.userName} • {order.items.length} items</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900">₹{order.totalPrice}</div>
                    <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-md mt-1 ${
                      order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                      order.status === 'Cancelled' ? 'bg-slate-100 text-slate-500' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-3xl ring-1 ring-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Top Sellers
            </h3>
          </div>

          {topItems.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <ChefHat className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              No sales data yet
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {topItems.map((entry, idx) => (
                <div key={entry.item.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 ${
                    idx === 0 ? 'bg-amber-100 text-amber-700' :
                    idx === 1 ? 'bg-slate-200 text-slate-700' :
                    idx === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    #{idx + 1}
                  </div>
                  <img
                    src={entry.item.image}
                    alt={entry.item.name}
                    onError={handleImageError(entry.item.name, entry.item.category, entry.item.id)}
                    className="w-10 h-10 rounded-lg object-cover bg-gradient-to-br from-rose-100 to-orange-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-xs text-slate-900 truncate">{entry.item.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold">{entry.sold} sold • ₹{entry.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
